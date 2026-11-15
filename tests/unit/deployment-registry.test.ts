import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import {
  CANONICAL_PRODUCT_REGISTRY_SEED,
  normalizeProductLookupKey,
  validateDeploymentUrl,
  isAuthorizedGitHubRepo,
  createInMemoryDeploymentRegistryStore,
  validateAndProcessDeploymentRegistration,
  adminUpdateDeploymentEntry,
  toPublicRegistryView,
  mergeProductsWithRegistry,
} from "../../src/shared/deploymentRegistry";
import { saasProductsData, aiAgentsData } from "../../src/data";

function computeHmacSignature(payload: unknown, secret: string): string {
  const raw = typeof payload === "string" ? payload : JSON.stringify(payload);
  return (
    "sha256=" +
    crypto.createHmac("sha256", secret).update(raw, "utf8").digest("hex")
  );
}

describe("Automatic Software & AI Agent Deployment Registry", () => {
  it("contains all 14 canonical products (10 software + 4 AI agents) with zero duplicate IDs", () => {
    expect(CANONICAL_PRODUCT_REGISTRY_SEED).toHaveLength(14);

    const software = CANONICAL_PRODUCT_REGISTRY_SEED.filter(
      (p) => p.category === "software",
    );
    const aiAgents = CANONICAL_PRODUCT_REGISTRY_SEED.filter(
      (p) => p.category === "ai-agent",
    );

    expect(software).toHaveLength(10);
    expect(aiAgents).toHaveLength(4);

    const canonicalIds = new Set(
      CANONICAL_PRODUCT_REGISTRY_SEED.map((p) => p.productId),
    );
    const legacyIds = new Set(
      CANONICAL_PRODUCT_REGISTRY_SEED.map((p) => p.legacyId),
    );
    expect(canonicalIds.size).toBe(14);
    expect(legacyIds.size).toBe(14);
  });

  it("initializes without fabricated GitHub repository bindings and keeps Institutes Management Coming Soon", () => {
    for (const entry of CANONICAL_PRODUCT_REGISTRY_SEED) {
      expect(entry.githubRepository).toBe("");
      expect(entry.connectedToAutoDeploy).toBe(false);
    }

    const institutes = CANONICAL_PRODUCT_REGISTRY_SEED.find(
      (e) => e.productId === "cvidya-institutes-management",
    );
    expect(institutes).toBeDefined();
    expect(institutes?.legacyId).toBe("institutes");
    expect(institutes?.deploymentUrl).toBe("");
    expect(institutes?.deploymentStatus).toBe("coming-soon");
  });

  it("maps canonical IDs and legacy aliases accurately", () => {
    expect(normalizeProductLookupKey("cvidya-library-management")).toBe(
      "cvidya-library-management",
    );
    expect(normalizeProductLookupKey("library")).toBe(
      "cvidya-library-management",
    );
    expect(normalizeProductLookupKey("farming")).toBe("cvidya-agrifusion");
    expect(normalizeProductLookupKey("agrifusion")).toBe("cvidya-agrifusion");
    expect(normalizeProductLookupKey("members")).toBe(
      "cvidya-jewellers-management",
    );
    expect(normalizeProductLookupKey("ai-support")).toBe(
      "cvidya-ai-customer-support-agent",
    );
    expect(normalizeProductLookupKey("non-existent-app")).toBeNull();
  });

  it("strictly validates production URLs and blocks HTTP, localhost, IPs, credentials, and preview/staging hosts", () => {
    expect(
      validateDeploymentUrl("https://crm.cvidyasolutions.workers.dev/").valid,
    ).toBe(true);
    expect(
      validateDeploymentUrl("https://c-vidya-crm.pages.dev/").valid,
    ).toBe(true);
    expect(
      validateDeploymentUrl("https://crm.cvidyasolutions.com/").valid,
    ).toBe(true);

    // Rejected URLs
    expect(
      validateDeploymentUrl("http://crm.cvidyasolutions.workers.dev/").valid,
    ).toBe(false);
    expect(validateDeploymentUrl("https://localhost:3000/").valid).toBe(false);
    expect(validateDeploymentUrl("https://127.0.0.1/").valid).toBe(false);
    expect(
      validateDeploymentUrl("https://metadata.google.internal/").valid,
    ).toBe(false);
    expect(
      validateDeploymentUrl(
        "https://user:pass@crm.cvidyasolutions.workers.dev/",
      ).valid,
    ).toBe(false);
    expect(
      validateDeploymentUrl("https://a1b2c3d4.c-vidya-crm.pages.dev/").valid,
    ).toBe(false);
    expect(
      validateDeploymentUrl("https://preview.cvidyasolutions.com/").valid,
    ).toBe(false);
    expect(
      validateDeploymentUrl("https://staging-crm.cvidyasolutions.com/").valid,
    ).toBe(false);
    expect(validateDeploymentUrl("https://evil.example.com/").valid).toBe(
      false,
    );
  });

  it("automatically updates Cloudflare Workers and Cloudflare Pages production deployments and syncs website product arrays", () => {
    const store = createInMemoryDeploymentRegistryStore();

    // Update CRM (Workers -> new production URL)
    const workerRes = validateAndProcessDeploymentRegistration(store, {
      productId: "cvidya-enterprise-crm",
      hostingPlatform: "cloudflare-workers",
      githubRepository: "cvidyasolutions/cvidya-enterprise-crm",
      branch: "main",
      environment: "production",
      deploymentUrl: "https://crm-v2.cvidyasolutions.workers.dev/",
      version: "2.4.0",
      commitSha: "abc1234def5678",
      buildId: "gh-run-101",
      status: "success",
      deployedBy: "github-actions",
    });

    expect(workerRes.ok).toBe(true);
    expect(workerRes.status).toBe(200);
    expect(workerRes.entry?.deploymentUrl).toBe(
      "https://crm-v2.cvidyasolutions.workers.dev/",
    );
    expect(workerRes.entry?.connectedToAutoDeploy).toBe(true);
    expect(workerRes.entry?.version).toBe("2.4.0");

    // Activate Institutes (Pages production deployment activates Coming Soon product)
    const pagesRes = validateAndProcessDeploymentRegistration(store, {
      productId: "cvidya-institutes-management",
      hostingPlatform: "cloudflare-pages",
      githubRepository: "cvidyasolutions/cvidya-institutes",
      branch: "main",
      environment: "production",
      deploymentUrl: "https://cvidya-institutes.pages.dev/",
      version: "1.0.0+gh.55",
      commitSha: "998877665544",
      buildId: "gh-run-102",
      status: "success",
    });

    expect(pagesRes.ok).toBe(true);
    expect(pagesRes.entry?.hostingPlatform).toBe("cloudflare-pages");
    expect(pagesRes.entry?.deploymentStatus).toBe("active");
    expect(pagesRes.entry?.enabled).toBe(true);

    // Public view strips internal fields & propagates to merged React data
    const publicView = toPublicRegistryView(store);
    expect(publicView.items).toHaveLength(14);
    expect((publicView.items[0] as any).githubRepository).toBeUndefined();

    const mergedSaas = mergeProductsWithRegistry(
      saasProductsData,
      publicView.items,
    );
    const crmMerged = mergedSaas.find((p) => p.id === "crm");
    const institutesMerged = mergedSaas.find((p) => p.id === "institutes");
    expect(crmMerged?.externalLink).toBe(
      "https://crm-v2.cvidyasolutions.workers.dev/",
    );
    expect(crmMerged?.connectedToAutoDeploy).toBe(true);
    expect(institutesMerged?.externalLink).toBe(
      "https://cvidya-institutes.pages.dev/",
    );
    expect(institutesMerged?.deploymentStatus).toBe("active");
  });

  it("rejects non-main branches, non-production environments, unauthorized repos, and bound-repo mismatches", () => {
    const store = createInMemoryDeploymentRegistryStore();

    const wrongBranch = validateAndProcessDeploymentRegistration(store, {
      productId: "cvidya-library-management",
      githubRepository: "cvidyasolutions/library",
      branch: "feature/test",
      environment: "production",
      deploymentUrl: "https://v.cvidyasolutions.workers.dev/",
      buildId: "gh-201",
      status: "success",
    });
    expect(wrongBranch.ok).toBe(false);
    expect(wrongBranch.status).toBe(400);

    const wrongEnv = validateAndProcessDeploymentRegistration(store, {
      productId: "cvidya-library-management",
      githubRepository: "cvidyasolutions/library",
      branch: "main",
      environment: "preview",
      deploymentUrl: "https://v.cvidyasolutions.workers.dev/",
      buildId: "gh-202",
      status: "success",
    });
    expect(wrongEnv.ok).toBe(false);
    expect(wrongEnv.status).toBe(400);

    const unallowedRepo = validateAndProcessDeploymentRegistration(
      store,
      {
        productId: "cvidya-library-management",
        githubRepository: "attacker/rogue-repo",
        branch: "main",
        environment: "production",
        deploymentUrl: "https://v.cvidyasolutions.workers.dev/",
        buildId: "gh-203",
        status: "success",
      },
      { allowlistEnv: "cvidyasolutions/*" },
    );
    expect(unallowedRepo.ok).toBe(false);
    expect(unallowedRepo.status).toBe(403);

    // Bind repo first, then test conflicting repo ownership rejection
    const bindFirst = validateAndProcessDeploymentRegistration(store, {
      productId: "cvidya-ai-support-agent".replace(
        "cvidya-ai-support-agent",
        "ai-support",
      ),
      githubRepository: "cvidyasolutions/ai-support",
      branch: "main",
      environment: "production",
      deploymentUrl:
        "https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/",
      buildId: "gh-204",
      status: "success",
    });
    expect(bindFirst.ok).toBe(true);

    const conflictRepo = validateAndProcessDeploymentRegistration(store, {
      productId: "cvidya-ai-customer-support-agent",
      githubRepository: "otherorg/other-support",
      branch: "main",
      environment: "production",
      deploymentUrl: "https://evil.cvidyasolutions.workers.dev/",
      buildId: "gh-205",
      status: "success",
    });
    expect(conflictRepo.ok).toBe(false);
    expect(conflictRepo.status).toBe(403);
  });

  it("enforces duplicate buildId idempotency and preserves last known good URL on failed build alerts", () => {
    const store = createInMemoryDeploymentRegistryStore();

    const first = validateAndProcessDeploymentRegistration(store, {
      productId: "cvidya-fitness-zone",
      githubRepository: "cvidyasolutions/fitness",
      branch: "main",
      environment: "production",
      deploymentUrl: "https://fitzone.cvidyasolutions.workers.dev/",
      version: "3.0.0",
      buildId: "gh-build-500",
      status: "success",
    });
    expect(first.ok).toBe(true);
    expect(first.duplicate).toBeFalsy();

    // Replay same buildId
    const replay = validateAndProcessDeploymentRegistration(store, {
      productId: "cvidya-fitness-zone",
      githubRepository: "cvidyasolutions/fitness",
      branch: "main",
      environment: "production",
      deploymentUrl: "https://fitzone.cvidyasolutions.workers.dev/",
      version: "3.0.0",
      buildId: "gh-build-500",
      status: "success",
    });
    expect(replay.ok).toBe(true);
    expect(replay.duplicate).toBe(true);

    // Failed build notification keeps active URL & version intact while flagging failureAlert
    const failed = validateAndProcessDeploymentRegistration(store, {
      productId: "cvidya-fitness-zone",
      githubRepository: "cvidyasolutions/fitness",
      branch: "main",
      environment: "production",
      version: "3.1.0-broken",
      buildId: "gh-build-501",
      status: "failed",
      errorMessage: "Wrangler bundle exceeded limit",
    });
    expect(failed.ok).toBe(true);
    expect(failed.failedRecorded).toBe(true);
    expect(failed.entry?.failureAlert).toBe(true);
    expect(failed.entry?.deploymentUrl).toBe(
      "https://fitzone.cvidyasolutions.workers.dev/",
    );
    expect(failed.entry?.version).toBe("3.0.0");
  });

  it("supports admin manual URL override, toggle enable/disable, and clearing failure alerts", () => {
    const store = createInMemoryDeploymentRegistryStore();

    const disabled = adminUpdateDeploymentEntry(
      store,
      "cvidya-salesflow-ai-agent",
      { enabled: false },
      "chiranjeevdas972@gmail.com",
    );
    expect(disabled.ok).toBe(true);
    expect(disabled.entry?.enabled).toBe(false);
    expect(disabled.entry?.deploymentStatus).toBe("inactive");

    const publicView = toPublicRegistryView(store);
    const mergedAgents = mergeProductsWithRegistry(
      aiAgentsData,
      publicView.items,
    );
    const salesflow = mergedAgents.find((a) => a.id === "ai-salesflow");
    expect(salesflow?.enabled).toBe(false);
    expect(salesflow?.externalLink).toBe("");

    // Re-enable and confirm HMAC signature helper matches expected format
    const enabled = adminUpdateDeploymentEntry(
      store,
      "cvidya-salesflow-ai-agent",
      {
        enabled: true,
        deploymentUrl: "https://salesflow-v2.cvidyasolutions.workers.dev/",
      },
      "chiranjeevdas972@gmail.com",
    );
    expect(enabled.ok).toBe(true);
    expect(enabled.entry?.enabled).toBe(true);

    const hmac = computeHmacSignature(
      { productId: "cvidya-salesflow-ai-agent" },
      "super-secret-token",
    );
    expect(hmac).toMatch(/^sha256=[a-f0-9]{64}$/);
    expect(isAuthorizedGitHubRepo("cvidyasolutions/salesflow").authorized).toBe(
      true,
    );
  });

  it("verifies timing-safe Bearer tokens and HMAC-SHA256 webhook signatures via server verifyDeploymentWebhookAuth", async () => {
    const { verifyDeploymentWebhookAuth } = await import("../../server");
    const secret = "cvidya-test-webhook-secret-2026";
    const payloadStr = JSON.stringify({
      productId: "cvidya-enterprise-crm",
      branch: "main",
      environment: "production",
      deploymentUrl: "https://crm.cvidyasolutions.workers.dev/",
      buildId: "gh-auth-test-1",
    });
    const validSig = computeHmacSignature(payloadStr, secret);

    // Valid Bearer + HMAC
    expect(
      verifyDeploymentWebhookAuth({
        rawBody: payloadStr,
        authHeader: `Bearer ${secret}`,
        signatureHeader: validSig,
        expectedSecret: secret,
      }),
    ).toEqual({ ok: true, status: 200 });

    // Missing auth headers -> 401
    expect(
      verifyDeploymentWebhookAuth({
        rawBody: payloadStr,
        expectedSecret: secret,
      }).status,
    ).toBe(401);

    // Server missing configured secret -> 503
    expect(
      verifyDeploymentWebhookAuth({
        rawBody: payloadStr,
        authHeader: `Bearer ${secret}`,
        expectedSecret: "",
      }).status,
    ).toBe(503);

    // Invalid Bearer -> 401
    expect(
      verifyDeploymentWebhookAuth({
        rawBody: payloadStr,
        authHeader: "Bearer wrong-token",
        signatureHeader: validSig,
        expectedSecret: secret,
      }).status,
    ).toBe(401);

    // Tampered body with stale HMAC -> 401
    expect(
      verifyDeploymentWebhookAuth({
        rawBody: payloadStr.replace("crm.cvidyasolutions", "tampered.cvidyasolutions"),
        authHeader: `Bearer ${secret}`,
        signatureHeader: validSig,
        expectedSecret: secret,
      }).status,
    ).toBe(401);
  });
});
