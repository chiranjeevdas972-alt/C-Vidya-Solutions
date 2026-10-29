import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  AUTHORIZED_ADMIN_EMAILS,
  isAuthorizedAdminEmail,
  isAuthorizedAdminUser,
  verifyAdminPasscodeWithServer,
} from "../../src/firebase";
import { resolveRoute } from "../../src/App";
import {
  getSafeResumeSource,
  deduplicateAppRegistrations,
  filterInquiriesList,
  filterApplicationsList,
  type AdminInquiryRecord,
  type AdminJobApplicationRecord,
} from "../../src/components/pages/AdminDashboardPage";
import {
  generateDeterministicAppRegistrationId,
  validateRegistration,
  submitAppRegistration,
  resetAppRegistrationSessionState,
} from "../../src/services/appRegistrationService";
import {
  getAuthorizedAdminEmails,
  isAuthorizedOwner,
  extractAdminTokenFromRequest,
  verifyFirebaseAdminIdToken,
  verifyAdminRequest,
  fromFirestoreRestValue,
  toFirestoreRestValue,
  firestoreAdminRestListCollection,
  firestoreAdminRestPatchDocument,
  isAllowedSoftwareEmbedUrl,
} from "../../server";

describe("Admin Authentication & Allowlist Enforcement", () => {
  it("contains only the two authorized administrator emails on both client and server", () => {
    expect(AUTHORIZED_ADMIN_EMAILS).toEqual([
      "cvidyasolutions@gmail.com",
      "chiranjeevdas972@gmail.com",
    ]);
    expect(getAuthorizedAdminEmails()).toEqual([
      "cvidyasolutions@gmail.com",
      "chiranjeevdas972@gmail.com",
    ]);
  });

  it("validates authorized admin emails case-insensitively", () => {
    expect(isAuthorizedAdminEmail("cvidyasolutions@gmail.com")).toBe(true);
    expect(isAuthorizedAdminEmail("CVIDYASOLUTIONS@GMAIL.COM")).toBe(true);
    expect(isAuthorizedAdminEmail("chiranjeevdas972@gmail.com")).toBe(true);
    expect(isAuthorizedAdminEmail("attacker@gmail.com")).toBe(false);
    expect(isAuthorizedAdminEmail("")).toBe(false);
    expect(isAuthorizedAdminEmail(null)).toBe(false);
  });

  it("requires both allowlisted email and emailVerified === true on User objects", () => {
    expect(
      isAuthorizedAdminUser({
        email: "cvidyasolutions@gmail.com",
        emailVerified: true,
      } as any),
    ).toBe(true);

    expect(
      isAuthorizedAdminUser({
        email: "chiranjeevdas972@gmail.com",
        emailVerified: true,
      } as any),
    ).toBe(true);

    // Unverified email must be rejected
    expect(
      isAuthorizedAdminUser({
        email: "cvidyasolutions@gmail.com",
        emailVerified: false,
      } as any),
    ).toBe(false);

    // Non-allowlisted email must be rejected even if verified
    expect(
      isAuthorizedAdminUser({
        email: "unauthorized@cvidyasolutions.com",
        emailVerified: true,
      } as any),
    ).toBe(false);

    expect(isAuthorizedAdminUser(null)).toBe(false);
  });

  it("disables legacy passcode fallback on both client and server", async () => {
    expect(isAuthorizedOwner("any_passcode")).toBe(false);
    expect(isAuthorizedOwner("CVIDYA2026")).toBe(false);
    const clientRes = await verifyAdminPasscodeWithServer("any_passcode");
    expect(clientRes.authorized).toBe(false);

    // Server token extractor ignores x-admin-passcode, body.passcode, and query.password
    const fakeReq: any = {
      headers: { "x-admin-passcode": "secret123" },
      body: { passcode: "secret123", password: "secret123" },
      query: { password: "secret123" },
    };
    expect(extractAdminTokenFromRequest(fakeReq)).toBe("");
    expect(await verifyAdminRequest(fakeReq)).toBe(false);
  });

  it("rejects expired, unverified, wrong-audience, or unauthorized Firebase JWTs on the backend", async () => {
    const makeJwt = (payload: Record<string, any>) => {
      const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
      const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
      return `${header}.${body}.fakesignature`;
    };

    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const pastExp = Math.floor(Date.now() / 1000) - 3600;

    // Expired token -> false
    expect(
      await verifyFirebaseAdminIdToken(
        makeJwt({
          email: "cvidyasolutions@gmail.com",
          email_verified: true,
          aud: "c-vidya-solutions",
          exp: pastExp,
        }),
      ),
    ).toBe(false);

    // Unverified email -> false
    expect(
      await verifyFirebaseAdminIdToken(
        makeJwt({
          email: "cvidyasolutions@gmail.com",
          email_verified: false,
          aud: "c-vidya-solutions",
          exp: futureExp,
        }),
      ),
    ).toBe(false);

    // Unauthorized email -> false
    expect(
      await verifyFirebaseAdminIdToken(
        makeJwt({
          email: "intruder@gmail.com",
          email_verified: true,
          aud: "c-vidya-solutions",
          exp: futureExp,
        }),
      ),
    ).toBe(false);

    // Wrong Firebase project audience -> false
    expect(
      await verifyFirebaseAdminIdToken(
        makeJwt({
          email: "cvidyasolutions@gmail.com",
          email_verified: true,
          aud: "wrong-firebase-project",
          exp: futureExp,
        }),
      ),
    ).toBe(false);
  });
});

describe("Public & Private Route Resolution", () => {
  it("resolves /admin and /admin-dashboard to the private admin page", () => {
    expect(resolveRoute("/admin", "")).toEqual({ type: "page", id: "admin" });
    expect(resolveRoute("/admin/", "")).toEqual({ type: "page", id: "admin" });
    expect(resolveRoute("/admin-dashboard", "")).toEqual({
      type: "page",
      id: "admin",
    });
    expect(resolveRoute("/", "#admin")).toEqual({ type: "page", id: "admin" });
  });

  it("preserves all existing public routes without regression", () => {
    expect(resolveRoute("/", "")).toEqual({ type: "page", id: "home" });
    expect(resolveRoute("/contact", "")).toEqual({
      type: "page",
      id: "contact",
      mode: "full",
    });
    expect(resolveRoute("/book-free-demo", "")).toEqual({
      type: "page",
      id: "contact",
      mode: "demo",
    });
    expect(resolveRoute("/careers", "")).toEqual({
      type: "page",
      id: "careers",
    });
    expect(resolveRoute("/mobile-app", "")).toEqual({
      type: "page",
      id: "mobile-app",
    });
    expect(resolveRoute("/services", "")).toEqual({
      type: "page",
      id: "services",
    });
    expect(resolveRoute("/pricing", "")).toEqual({
      type: "page",
      id: "pricing",
    });
    expect(resolveRoute("/about", "")).toEqual({ type: "page", id: "about" });
    expect(resolveRoute("/faq", "")).toEqual({ type: "page", id: "faq" });
  });
});

describe("Safe Resume Preview & Download Validation", () => {
  it("allows valid base64 PDF data URIs with %PDF- magic header", () => {
    const validPdf =
      "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyA+PgplbmRvYmoK";
    const res = getSafeResumeSource({
      resumeFileName: "candidate_cv.pdf",
      resumeData: validPdf,
    });
    expect(res.isValid).toBe(true);
    expect(res.type).toBe("pdf");
    expect(res.url).toBe(validPdf);
  });

  it("rejects base64 data URIs claiming to be PDF without the %PDF- header", () => {
    const fakePdf =
      "data:application/pdf;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==";
    const res = getSafeResumeSource({
      resumeFileName: "fake.pdf",
      resumeData: fakePdf,
    });
    expect(res.isValid).toBe(false);
    expect(res.url).toBeNull();
  });

  it("allows valid HTTPS resume URLs from trusted storage hosts with document extensions", () => {
    const res = getSafeResumeSource({
      resumeFileName: "resume.pdf",
      resumeUrl: "https://storage.googleapis.com/cvidya-resumes/resume.pdf",
    });
    expect(res.isValid).toBe(true);
    expect(res.type).toBe("external");
  });

  it("blocks untrusted HTTPS domains, active/executable HTTPS files, javascript:, data:text/html, and http:// URLs", () => {
    // Untrusted external domain even with .pdf
    expect(
      getSafeResumeSource({
        resumeFileName: "phishing.pdf",
        resumeUrl: "https://evil-attacker.example.com/resume.pdf",
      }).isValid,
    ).toBe(false);

    // Trusted domain but executable/HTML extension
    expect(
      getSafeResumeSource({
        resumeFileName: "malware.exe",
        resumeUrl: "https://storage.googleapis.com/cvidya-resumes/malware.exe",
      }).isValid,
    ).toBe(false);

    expect(
      getSafeResumeSource({
        resumeFileName: "xss.html",
        resumeUrl: "https://storage.googleapis.com/cvidya-resumes/payload.html",
      }).isValid,
    ).toBe(false);

    expect(
      getSafeResumeSource({
        resumeFileName: "exploit.pdf",
        resumeUrl: "javascript:alert(1)",
      }).isValid,
    ).toBe(false);

    expect(
      getSafeResumeSource({
        resumeFileName: "xss.html",
        resumeData: "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
      }).isValid,
    ).toBe(false);

    expect(
      getSafeResumeSource({
        resumeFileName: "insecure.pdf",
        resumeUrl: "http://storage.googleapis.com/cvidya-resumes/resume.pdf",
      }).isValid,
    ).toBe(false);
  });

  it("sanitizes path traversal characters in resumeFileName and handles metadata-only records", () => {
    const res = getSafeResumeSource({
      resumeFileName: "../../etc/passwd",
    });
    expect(res.isValid).toBe(false);
    expect(res.fileName).not.toContain("..");
    expect(res.fileName).not.toContain("/");
  });
});

describe("Mobile App Registration Deterministic ID & Deduplication", () => {
  it("generates deterministic idempotent IDs within the same time window and distinct IDs for different users/platforms", () => {
    const fixedTime = 1760000000000;
    const id1 = generateDeterministicAppRegistrationId(
      "User@Example.com",
      "+91 98765-43210",
      "android",
      fixedTime,
    );
    const id2 = generateDeterministicAppRegistrationId(
      "user@example.com",
      "919876543210",
      "android",
      fixedTime + 10000, // 10 seconds later in same 5-min window
    );
    expect(id1).toBe(id2);
    expect(id1).toMatch(/^appreg_android_[a-z0-9]+_[a-f0-9]{16}$/);

    // Different platform -> distinct ID
    const iosId = generateDeterministicAppRegistrationId(
      "user@example.com",
      "919876543210",
      "ios",
      fixedTime,
    );
    expect(iosId).not.toBe(id1);

    // Different phone -> distinct ID
    const diffPhoneId = generateDeterministicAppRegistrationId(
      "user@example.com",
      "919999988888",
      "android",
      fixedTime,
    );
    expect(diffPhoneId).not.toBe(id1);
  });

  it("validates mobile registration payloads accurately", () => {
    expect(
      validateRegistration({
        fullName: "Aarav Sharma",
        email: "aarav@example.com",
        phone: "+91 9876543210",
        platform: "android",
        consentGiven: true,
      }).isValid,
    ).toBe(true);

    expect(
      validateRegistration({
        fullName: "Aarav Sharma",
        email: "aarav@example.com",
        phone: "+91 9876543210",
        platform: "android",
        consentGiven: false,
      }).isValid,
    ).toBe(false);
  });

  it("merges app_download_registrations and linked inquiries without merging distinct users or phones", () => {
    const primary = [
      {
        id: "appreg_1001",
        name: "Rohan Verma",
        email: "rohan@example.com",
        phone: "+919876543210",
        platform: "android" as const,
        service: "Mobile App Registration (ANDROID)",
        source: "mobile_app_download_page",
        privacyConsent: true,
        privacyPolicyVersion: "2026.1",
        clientTimestamp: "2026-03-20T10:00:00.000Z",
        timestamp: "2026-03-20T10:00:00.000Z",
        status: "registered",
      },
    ];

    const inquiries = [
      // Linked inquiry of appreg_1001
      {
        id: "appreg_1001",
        name: "Rohan Verma",
        email: "rohan@example.com",
        phone: "+919876543210",
        service: "Mobile App Early Access (ANDROID)",
        source: "mobile_app_download_page",
        timestamp: "2026-03-20T10:00:00.000Z",
        status: "registered",
      },
      // Different phone number using same company email -> must NOT be merged with Rohan
      {
        id: "appreg_1002",
        name: "Rohan Team Member",
        email: "rohan@example.com",
        phone: "+919111122222",
        service: "Mobile App Early Access (ANDROID)",
        source: "mobile_app_download_page",
        timestamp: "2026-03-21T11:00:00.000Z",
        status: "registered",
      },
      // Legacy app registration stored only in inquiries
      {
        id: "legacy_inq_2002",
        name: "Priya Nair",
        email: "priya@example.com",
        phone: "+919811122233",
        service: "Mobile App Registration (IOS)",
        source: "mobile_app_download_page",
        timestamp: "2026-03-21T12:00:00.000Z",
        status: "New",
      },
      // Regular business inquiry (should NOT be included in app registrations)
      {
        id: "inq_regular_3003",
        name: "Vikram Singh",
        email: "vikram@example.com",
        phone: "+919900011122",
        service: "Library Management Software",
        source: "website",
        timestamp: "2026-03-22T08:00:00.000Z",
        status: "New",
      },
    ];

    const result = deduplicateAppRegistrations(primary, inquiries);
    expect(result).toHaveLength(3);
    expect(result.find((r) => r.id === "appreg_1001")?.originCollection).toBe(
      "merged",
    );
    expect(result.find((r) => r.id === "appreg_1002")).toBeDefined();
    expect(result.find((r) => r.id === "legacy_inq_2002")).toBeDefined();
  });
});

describe("Admin Dashboard Search & Filter Helpers & Missing Field Resilience", () => {
  const sampleInquiries: AdminInquiryRecord[] = [
    {
      id: "1",
      name: "Ananya Gupta",
      email: "ananya@edutech.in",
      phone: "9876543210",
      service: "Institute Management ERP",
      company: "Apex Academy",
      status: "New",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Rajesh Khanna",
      email: "rajesh@gymfit.in",
      phone: "9123456780",
      service: "Gym Fitness Zone",
      company: undefined,
      status: "Converted",
      timestamp: "2025-01-01T00:00:00.000Z",
    },
  ];

  it("filters inquiries by search query, status, service, and date window without crashing on missing optional fields", () => {
    expect(
      filterInquiriesList(sampleInquiries, { searchQuery: "Apex" }),
    ).toHaveLength(1);
    expect(
      filterInquiriesList(sampleInquiries, { statusFilter: "Converted" }),
    ).toHaveLength(1);
    expect(
      filterInquiriesList(sampleInquiries, {
        serviceFilter: "Institute Management ERP",
      }),
    ).toHaveLength(1);
    expect(
      filterInquiriesList(sampleInquiries, { dateWindow: "7d" }),
    ).toHaveLength(1);
  });

  const sampleApps: AdminJobApplicationRecord[] = [
    {
      id: "app1",
      name: "Neha Sharma",
      email: "neha@dev.in",
      phone: "9988776655",
      jobTitle: "Full Stack Engineer",
      jobCategory: "Engineering",
      jobLocation: "Remote",
      roleType: "Full-Time",
      experience: "3 years",
      resumeFileName: "neha_cv.pdf",
      status: "Shortlisted",
      timestamp: new Date().toISOString(),
    },
    {
      id: "app2",
      name: "Karan Patel",
      email: "karan@sales.in",
      phone: "9911223344",
      jobTitle: "SaaS Sales Intern",
      jobCategory: "Sales",
      jobLocation: "Kolkata",
      roleType: "Internship",
      experience: "Fresher",
      resumeFileName: "karan_resume.pdf",
      status: "New",
      timestamp: new Date().toISOString(),
    },
  ];

  it("filters job applications by applicant search, category, and status", () => {
    expect(
      filterApplicationsList(sampleApps, { searchQuery: "Full Stack" }),
    ).toHaveLength(1);
    expect(
      filterApplicationsList(sampleApps, { categoryFilter: "Sales" }),
    ).toHaveLength(1);
    expect(
      filterApplicationsList(sampleApps, { statusFilter: "Shortlisted" }),
    ).toHaveLength(1);
  });
});

describe("Firestore Security Rules & Bundle Secret Hygiene", () => {
  it("enforces email_verified == true, default deny, status spoofing prevention, and protected collections in firestore.rules", () => {
    const rulesContent = fs.readFileSync(
      path.resolve(process.cwd(), "firestore.rules"),
      "utf-8",
    );
    expect(rulesContent).toContain("request.auth.token.email_verified == true");
    expect(rulesContent).toContain('request.auth.token.email == "chiranjeevdas972@gmail.com"');
    expect(rulesContent).toContain('request.auth.token.email == "cvidyasolutions@gmail.com"');
    expect(rulesContent).toContain("match /inquiries/{inquiryId}");
    expect(rulesContent).toContain("match /job_applications/{jobApplicationId}");
    expect(rulesContent).toContain("match /applications/{applicationId}");
    expect(rulesContent).toContain("match /app_download_registrations/{regId}");
    expect(rulesContent).toContain("match /admins/{adminId}");
    expect(rulesContent).toContain("match /call_logs/{callId}");
    expect(rulesContent).toContain("allow create: if isValidId(callId) && isValidCallLog(request.resource.data) && isAdmin();");
    expect(rulesContent).toContain("!('isAdmin' in data)");
    expect(rulesContent).toContain("!('admin' in data)");
    expect(rulesContent).toContain('data.status in ["New", "New Lead", "Pending Callback", "registered", "Forwarded to cvidyasolutions@gmail.com"]');
  });

  it("does not expose hardcoded admin passcodes or private keys in frontend source", () => {
    const filesToCheck = [
      path.resolve(process.cwd(), "src/firebase.ts"),
      path.resolve(process.cwd(), "src/App.tsx"),
      path.resolve(
        process.cwd(),
        "src/components/pages/AdminDashboardPage.tsx",
      ),
    ];

    for (const filePath of filesToCheck) {
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).not.toContain("BEGIN PRIVATE KEY");
      expect(content).not.toContain("CVIDYA2026");
      expect(content).not.toContain("cvidya_admin_secret");
    }
  });
});

describe("Authenticated Server-Side Firestore REST Bridge", () => {
  it("converts JavaScript values to and from Cloud Firestore REST Value payloads", () => {
    const input = {
      name: "Ananya Sharma",
      count: 42,
      active: true,
      tags: ["saas", "crm"],
      meta: { source: "website" },
    };
    const restMap = toFirestoreRestValue(input);
    expect(restMap.mapValue).toBeDefined();
    const roundTrip = fromFirestoreRestValue(restMap);
    expect(roundTrip).toEqual(input);
  });

  it("forwards caller Authorization Bearer token to Cloud Firestore REST API for admin reads and updates", async () => {
    const originalFetch = globalThis.fetch;
    const calls: Array<{ url: string; headers: Record<string, string>; method: string }> = [];

    globalThis.fetch = (async (input: any, init?: any) => {
      const url = String(input);
      const method = init?.method || "GET";
      const headers = (init?.headers || {}) as Record<string, string>;
      calls.push({ url, headers, method });

      if (method === "GET") {
        return {
          ok: true,
          json: async () => ({
            documents: [
              {
                name: "projects/c-vidya-solutions/databases/ai-studio-cvidyasolutions-89b15118-e096-42ad-9641-2e1d65c26ca7/documents/inquiries/inq_rest_1",
                fields: {
                  name: { stringValue: "Verified Admin Inquiry" },
                  email: { stringValue: "client@cvidyasolutions.com" },
                  status: { stringValue: "New" },
                },
                createTime: "2026-03-25T10:00:00.000Z",
              },
            ],
          }),
        } as any;
      }

      return {
        ok: true,
        json: async () => ({
          name: "projects/c-vidya-solutions/databases/ai-studio-cvidyasolutions-89b15118-e096-42ad-9641-2e1d65c26ca7/documents/inquiries/inq_rest_1",
          fields: {
            id: { stringValue: "inq_rest_1" },
            status: { stringValue: "Converted" },
            adminNotes: { stringValue: "Closed via authenticated REST bridge" },
          },
        }),
      } as any;
    }) as any;

    try {
      const docs = await firestoreAdminRestListCollection("inquiries", "mock_admin_jwt_token");
      expect(docs).toHaveLength(1);
      expect(docs?.[0].id).toBe("inq_rest_1");
      expect(docs?.[0].name).toBe("Verified Admin Inquiry");
      expect(calls[0].headers.Authorization).toBe("Bearer mock_admin_jwt_token");
      expect(calls[0].url).toContain("/documents/inquiries");

      const updated = await firestoreAdminRestPatchDocument(
        "inquiries",
        "inq_rest_1",
        { status: "Converted", adminNotes: "Closed via authenticated REST bridge" },
        "mock_admin_jwt_token",
      );
      expect(updated).toBe(true);
      expect(calls[1].method).toBe("PATCH");
      expect(calls[1].headers.Authorization).toBe("Bearer mock_admin_jwt_token");
      expect(calls[1].url).toContain("updateMask.fieldPaths=status");
      expect(calls[1].url).toContain("updateMask.fieldPaths=adminNotes");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("supports multi-page pagination via nextPageToken and blocks unapproved collections or privilege fields", async () => {
    const originalFetch = globalThis.fetch;
    const calls: string[] = [];

    globalThis.fetch = (async (input: any) => {
      const url = String(input);
      calls.push(url);
      if (!url.includes("pageToken=")) {
        return {
          ok: true,
          json: async () => ({
            documents: [
              {
                name: "projects/c-vidya-solutions/databases/default/documents/inquiries/doc_page_1",
                fields: { name: { stringValue: "Page 1 Lead" } },
              },
            ],
            nextPageToken: "token_page_2",
          }),
        } as any;
      }
      return {
        ok: true,
        json: async () => ({
          documents: [
            {
              name: "projects/c-vidya-solutions/databases/default/documents/inquiries/doc_page_2",
              fields: { name: { stringValue: "Page 2 Lead" } },
            },
          ],
        }),
      } as any;
    }) as any;

    try {
      const pagedDocs = await firestoreAdminRestListCollection("inquiries", "admin_jwt");
      expect(pagedDocs).toHaveLength(2);
      expect(pagedDocs?.map((d) => d.id)).toEqual(["doc_page_1", "doc_page_2"]);
      expect(calls).toHaveLength(2);
      expect(calls[1]).toContain("pageToken=token_page_2");

      // Unapproved collection (e.g., "admins" or "users") -> rejected before fetch
      expect(await firestoreAdminRestListCollection("admins", "admin_jwt")).toBeNull();
      expect(await firestoreAdminRestListCollection("users", "admin_jwt")).toBeNull();

      // Patching only forbidden privilege fields -> rejected before fetch
      const privResult = await firestoreAdminRestPatchDocument(
        "inquiries",
        "inq_1",
        { isAdmin: true, admin: true, role: "superadmin" },
        "admin_jwt",
      );
      expect(privResult).toBe(false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

describe("Registration Retry, Partial Failure Recovery & Concurrency Protection", () => {
  it("deduplicates repeated submissions in the same 5-minute window without re-writing Firestore", async () => {
    resetAppRegistrationSessionState();
    const setDocCalls: string[] = [];
    let apiCalls = 0;

    const mockSetDoc = (async (ref: any) => {
      setDocCalls.push(ref?.path || "doc");
    }) as any;
    const mockFetch = (async () => {
      apiCalls++;
      return { ok: true, json: async () => ({ success: true }) } as any;
    }) as any;

    const payload = {
      fullName: "Kiran Verma",
      email: "kiran@cvidya.in",
      phone: "+91 9876543210",
      platform: "android" as const,
      consentGiven: true,
    };

    const first = await submitAppRegistration(payload, {
      nowMs: 1760000000000,
      firestoreSetDoc: mockSetDoc,
      fetchImpl: mockFetch,
    });
    expect(first.success).toBe(true);
    expect(first.deduplicated).toBe(false);
    expect(setDocCalls).toHaveLength(2); // app_download_registrations + inquiries
    expect(apiCalls).toBe(1);

    // Second submission 2 seconds later within same 5-minute bucket -> returns deduplicated success without calling setDoc
    const second = await submitAppRegistration(payload, {
      nowMs: 1760000002000,
      firestoreSetDoc: mockSetDoc,
      fetchImpl: mockFetch,
    });
    expect(second.success).toBe(true);
    expect(second.deduplicated).toBe(true);
    expect(second.registrationId).toBe(first.registrationId);
    expect(setDocCalls).toHaveLength(2); // zero additional Firestore writes
    expect(apiCalls).toBe(1);
  });

  it("retries only uncompleted channels after a partial failure without triggering duplicate writes on completed channels", async () => {
    resetAppRegistrationSessionState();
    let setDocAttempt = 0;
    let apiAttempt = 0;

    // Attempt 1: primary Firestore succeeds, linked inquiry fails, backend API fails
    const mockSetDoc = (async () => {
      setDocAttempt++;
      if (setDocAttempt === 2) {
        throw new Error("Simulated transient network drop on inquiries write");
      }
    }) as any;

    const mockFetch = (async () => {
      apiAttempt++;
      if (apiAttempt === 1) {
        throw new Error("Simulated transient API timeout");
      }
      return { ok: true, json: async () => ({ success: true }) } as any;
    }) as any;

    const payload = {
      fullName: "Meera Nair",
      email: "meera@cvidya.in",
      phone: "+91 9123456789",
      platform: "ios" as const,
      consentGiven: true,
    };

    const first = await submitAppRegistration(payload, {
      nowMs: 1760000000000,
      firestoreSetDoc: mockSetDoc,
      fetchImpl: mockFetch,
    });
    expect(first.success).toBe(true); // Primary Firestore succeeded
    expect(setDocAttempt).toBe(2);
    expect(apiAttempt).toBe(1);

    // Retry 3 seconds later: skips primary Firestore (already done), retries only linked inquiry + backend API
    const retry = await submitAppRegistration(payload, {
      nowMs: 1760000003000,
      firestoreSetDoc: mockSetDoc,
      fetchImpl: mockFetch,
    });
    expect(retry.success).toBe(true);
    expect(retry.registrationId).toBe(first.registrationId);
    expect(setDocAttempt).toBe(3); // Only 1 new setDoc call (for inquiries), primary was NOT re-written!
    expect(apiAttempt).toBe(2);
  });

  it("returns success: false when all persistence channels fail and blocks concurrent double-click requests", async () => {
    resetAppRegistrationSessionState();

    const failingSetDoc = (async () => {
      throw new Error("Firestore offline");
    }) as any;
    const failingFetch = (async () => {
      throw new Error("API offline");
    }) as any;

    const payload = {
      fullName: "Devendra Rao",
      email: "devendra@cvidya.in",
      phone: "+91 9988776655",
      platform: "android" as const,
      consentGiven: true,
    };

    const failed = await submitAppRegistration(payload, {
      nowMs: 1760000000000,
      firestoreSetDoc: failingSetDoc,
      fetchImpl: failingFetch,
    });
    expect(failed.success).toBe(false);
    expect(failed.errorMessage).toContain("Unable to save your registration");

    // Concurrent double-click test
    resetAppRegistrationSessionState();
    let resolveGate: (() => void) | null = null;
    const gatePromise = new Promise<void>((resolve) => {
      resolveGate = resolve;
    });
    const slowSetDoc = (async () => {
      await gatePromise;
    }) as any;

    const p1 = submitAppRegistration(payload, {
      nowMs: 1760000000000,
      firestoreSetDoc: slowSetDoc,
      fetchImpl: (async () => ({ ok: true })) as any,
    });
    const p2 = await submitAppRegistration(payload, {
      nowMs: 1760000000050,
      firestoreSetDoc: slowSetDoc,
      fetchImpl: (async () => ({ ok: true })) as any,
    });

    expect(p2.success).toBe(false);
    expect(p2.errorMessage).toContain("already in progress");

    if (resolveGate) (resolveGate as () => void)();
    const r1 = await p1;
    expect(r1.success).toBe(true);
  });
});

describe("SSRF & Open Redirect Protection on /api/live-software-embed", () => {
  it("allows verified C Vidya worker URLs and blocks private IPs, metadata hosts, and untrusted domains", () => {
    expect(isAllowedSoftwareEmbedUrl("https://v.cvidyasolutions.workers.dev/")).toBe(true);
    expect(isAllowedSoftwareEmbedUrl("https://crm.cvidyasolutions.workers.dev/")).toBe(true);
    expect(isAllowedSoftwareEmbedUrl("http://v.cvidyasolutions.workers.dev/")).toBe(false);
    expect(isAllowedSoftwareEmbedUrl("https://169.254.169.254/latest/meta-data/")).toBe(false);
    expect(isAllowedSoftwareEmbedUrl("https://metadata.google.internal/computeMetadata/v1/")).toBe(false);
    expect(isAllowedSoftwareEmbedUrl("https://localhost:8080/admin")).toBe(false);
    expect(isAllowedSoftwareEmbedUrl("https://127.0.0.1/")).toBe(false);
    expect(isAllowedSoftwareEmbedUrl("https://admin:secret@v.cvidyasolutions.workers.dev/")).toBe(false);
    expect(isAllowedSoftwareEmbedUrl("https://evil.example.com/")).toBe(false);
  });
});


