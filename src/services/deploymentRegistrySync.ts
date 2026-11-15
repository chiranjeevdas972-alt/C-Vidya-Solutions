import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { aiAgentsData, otherServicesData, saasProductsData } from "../data";
import type { ProductService } from "../types";
import {
  CANONICAL_PRODUCT_REGISTRY_SEED,
  mergeProductsWithRegistry,
  toPublicRegistryItem,
  type PublicDeploymentItem,
} from "../shared/deploymentRegistry";

const CACHE_KEY = "cvidya_deployment_registry_cache_v1";
const CACHE_TTL_MS = 60_000;

interface RegistrySnapshotState {
  items: PublicDeploymentItem[];
  registryVersion: number;
  updatedAt: string;
  source: "seed" | "cache" | "api" | "firestore";
}

const DEFAULT_PUBLIC_ITEMS: PublicDeploymentItem[] = CANONICAL_PRODUCT_REGISTRY_SEED.map(
  toPublicRegistryItem,
);

function readCachedSnapshot(): RegistrySnapshotState | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items) || parsed.items.length === 0) return null;
    if (typeof parsed.cachedAt === "number" && Date.now() - parsed.cachedAt > CACHE_TTL_MS * 15) {
      return null;
    }
    return {
      items: parsed.items,
      registryVersion: Number(parsed.registryVersion || 1),
      updatedAt: String(parsed.updatedAt || ""),
      source: "cache",
    };
  } catch {
    return null;
  }
}

function writeCachedSnapshot(state: RegistrySnapshotState): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        cachedAt: Date.now(),
        registryVersion: state.registryVersion,
        updatedAt: state.updatedAt,
        items: state.items,
      }),
    );
  } catch {
    // Ignore storage quota errors
  }
}

class DeploymentRegistryManager {
  private state: RegistrySnapshotState;
  private listeners = new Set<() => void>();
  private inflightPromise: Promise<void> | null = null;
  private lastFetchAt = 0;

  constructor() {
    const cached = readCachedSnapshot();
    this.state = cached || {
      items: DEFAULT_PUBLIC_ITEMS,
      registryVersion: 1,
      updatedAt: "2026-01-01T00:00:00.000Z",
      source: "seed",
    };
  }

  getSnapshot(): RegistrySnapshotState {
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  applyExternalItems(
    items: PublicDeploymentItem[],
    registryVersion = this.state.registryVersion + 1,
    updatedAt = new Date().toISOString(),
    source: RegistrySnapshotState["source"] = "api",
  ): void {
    if (!Array.isArray(items) || items.length === 0) return;
    const byId = new Map<string, PublicDeploymentItem>(
      DEFAULT_PUBLIC_ITEMS.map((item) => [item.productId, item]),
    );
    for (const incoming of items) {
      if (incoming && incoming.productId && byId.has(incoming.productId)) {
        byId.set(incoming.productId, incoming);
      }
    }
    this.state = {
      items: Array.from(byId.values()),
      registryVersion,
      updatedAt,
      source,
    };
    writeCachedSnapshot(this.state);
    this.emit();
  }

  async refresh(force = false): Promise<void> {
    const now = Date.now();
    if (!force && now - this.lastFetchAt < 10_000 && this.state.source !== "seed") {
      return;
    }
    if (this.inflightPromise) return this.inflightPromise;

    this.inflightPromise = (async () => {
      this.lastFetchAt = Date.now();
      let updatedFromApi = false;

      // 1. Fetch from Backend / Cloudflare Worker Edge API
      try {
        const res = await fetch("/api/deployments/registry", {
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            this.applyExternalItems(
              data.items,
              Number(data.registryVersion || this.state.registryVersion),
              String(data.updatedAt || new Date().toISOString()),
              "api",
            );
            updatedFromApi = true;
          }
        }
      } catch {
        // Fallback to Firestore below
      }

      // 2. Sync with Firestore `cvidya_deployment_registry` public docs if available
      try {
        const snap = await getDocs(collection(db, "cvidya_deployment_registry"));
        if (!snap.empty) {
          const baseMap = new Map<string, PublicDeploymentItem>(
            (updatedFromApi ? this.state.items : DEFAULT_PUBLIC_ITEMS).map((i) => [
              i.productId,
              i,
            ]),
          );
          let hasNewerFirestore = false;
          snap.forEach((docSnap) => {
            const d = docSnap.data() as any;
            const pid = String(d?.productId || docSnap.id || "").trim();
            const current = baseMap.get(pid);
            if (!current) return;
            const fsUpdatedAt = String(d?.updatedAt || "");
            // Prefer Firestore record if it has a valid connected deployment or newer timestamp
            if (
              Boolean(d?.connectedToAutoDeploy) ||
              fsUpdatedAt > this.state.updatedAt ||
              !updatedFromApi
            ) {
              hasNewerFirestore = true;
              const enabled = typeof d.enabled === "boolean" ? d.enabled : current.enabled;
              baseMap.set(pid, {
                productId: pid,
                legacyId: String(d.legacyId || current.legacyId),
                name: String(d.name || current.name),
                category: d.category === "ai-agent" ? "ai-agent" : "software",
                hostingPlatform:
                  d.hostingPlatform === "cloudflare-pages"
                    ? "cloudflare-pages"
                    : "cloudflare-workers",
                deploymentUrl: enabled ? String(d.deploymentUrl || "") : "",
                version: String(d.version || current.version || "1.0.0"),
                deploymentStatus: d.deploymentStatus || current.deploymentStatus,
                enabled,
                connectedToAutoDeploy: Boolean(d.connectedToAutoDeploy),
                lastDeploymentAt: d.lastDeploymentAt || current.lastDeploymentAt || null,
                badge: String(d.badge || current.badge),
              });
            }
          });
          if (hasNewerFirestore) {
            this.state = {
              items: Array.from(baseMap.values()),
              registryVersion: this.state.registryVersion + 1,
              updatedAt: new Date().toISOString(),
              source: "firestore",
            };
            writeCachedSnapshot(this.state);
            this.emit();
          }
        }
      } catch {
        // Non-fatal if offline or Firestore collection empty
      }
    })().finally(() => {
      this.inflightPromise = null;
    });

    return this.inflightPromise;
  }
}

export const deploymentRegistryManager = new DeploymentRegistryManager();

export function useDeploymentRegistry() {
  const [snapshot, setSnapshot] = useState<RegistrySnapshotState>(() =>
    deploymentRegistryManager.getSnapshot(),
  );

  useEffect(() => {
    const unsub = deploymentRegistryManager.subscribe(() => {
      setSnapshot(deploymentRegistryManager.getSnapshot());
    });
    deploymentRegistryManager.refresh(false);

    const handleFocus = () => {
      deploymentRegistryManager.refresh(false);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleFocus);
    }
    return () => {
      unsub();
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleFocus);
      }
    };
  }, []);

  const saasProducts = useMemo<ProductService[]>(
    () => mergeProductsWithRegistry(saasProductsData, snapshot.items),
    [snapshot.items],
  );

  const aiAgents = useMemo<ProductService[]>(
    () => mergeProductsWithRegistry(aiAgentsData, snapshot.items),
    [snapshot.items],
  );

  const otherServices = useMemo<ProductService[]>(
    () => mergeProductsWithRegistry(otherServicesData, snapshot.items),
    [snapshot.items],
  );

  const registryByLegacyId = useMemo(() => {
    const map = new Map<string, PublicDeploymentItem>();
    for (const item of snapshot.items) {
      map.set(item.legacyId, item);
      map.set(item.productId, item);
    }
    return map;
  }, [snapshot.items]);

  return {
    saasProducts,
    aiAgents,
    otherServices,
    registryItems: snapshot.items,
    registryByLegacyId,
    registryVersion: snapshot.registryVersion,
    refreshRegistry: () => deploymentRegistryManager.refresh(true),
  };
}
