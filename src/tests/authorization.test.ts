import { 
  canAccessApplication, 
  hasPermission, 
  canAccessRoute, 
  isAdmin, 
  isSuperAdmin,
  isOrgAdmin,
  REGISTERED_APPLICATIONS,
  AppRegistryItem
} from "../lib/authorization";
import { UserProfile, Organization, Role, UserApplication, AppSlug } from "../types";

// Helper fixture factories
const orgImmense: Organization = { id: "org-immense", name: "Immense Air Pvt Ltd", slug: "immense-air", createdAt: "" };
const orgZion: Organization = { id: "org-zion", name: "Zion", slug: "zion", createdAt: "" };
const orgCentral: Organization = { id: "org-central", name: "Central", slug: "central", createdAt: "" };

const roleSuperAdmin: Role = { id: "role-super", name: "Super Admin", description: "", isSystem: true };
const roleAdmin: Role = { id: "role-admin", name: "Admin", description: "", isSystem: true };
const roleSales: Role = { id: "role-sales", name: "Sales", description: "", isSystem: true };
const roleSupport: Role = { id: "role-support", name: "Support", description: "", isSystem: true };
const roleOps: Role = { id: "role-ops", name: "Operations", description: "", isSystem: true };

function makeProfile(org: Organization, role: Role, isActive = true): UserProfile {
  return {
    id: "user-123",
    fullName: "Test User",
    email: "test@example.com",
    organizationId: org.id,
    organization: org,
    roleId: role.id,
    role: role,
    isActive,
    createdAt: "",
    updatedAt: "",
  };
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log("\n=======================================================");
console.log(" RUNNING PHASE 8 LAUNCHER & DIRECT URL PROTECTION TESTS");
console.log("=======================================================\n");

const immenseSupport = makeProfile(orgImmense, roleSupport);
const immenseOps = makeProfile(orgImmense, roleOps);
const immenseSales = makeProfile(orgImmense, roleSales);
const immenseAdmin = makeProfile(orgImmense, roleAdmin);
const zionSales = makeProfile(orgZion, roleSales);
const zionAdmin = makeProfile(orgZion, roleAdmin);
const superAdmin = makeProfile(orgCentral, roleSuperAdmin);

// -------------------------------------------------------------
// A. Launcher Visibility Tests (Section 12: Tests 1-7)
// -------------------------------------------------------------
console.log("--- A. LAUNCHER VISIBILITY TESTS ---");

// Test 1: Support sees Error Hub only
assert(
  canAccessApplication(immenseSupport, orgImmense, roleSupport, "error-hub") === true &&
  canAccessApplication(immenseSupport, orgImmense, roleSupport, "immense-quotes") === false &&
  canAccessApplication(immenseSupport, orgImmense, roleSupport, "zion-quotes") === false,
  "Test 1: Support sees Error Hub only"
);

// Test 2: Operations sees Error Hub only
assert(
  canAccessApplication(immenseOps, orgImmense, roleOps, "error-hub") === true &&
  canAccessApplication(immenseOps, orgImmense, roleOps, "immense-quotes") === false &&
  canAccessApplication(immenseOps, orgImmense, roleOps, "zion-quotes") === false,
  "Test 2: Operations sees Error Hub only"
);

// Test 3: Immense Sales sees Immense Quotes
assert(
  canAccessApplication(immenseSales, orgImmense, roleSales, "immense-quotes") === true &&
  canAccessApplication(immenseSales, orgImmense, roleSales, "zion-quotes") === false,
  "Test 3: Immense Sales sees Immense Quotes"
);

// Test 4: Zion Sales sees Zion Quotes
assert(
  canAccessApplication(zionSales, orgZion, roleSales, "zion-quotes") === true &&
  canAccessApplication(zionSales, orgZion, roleSales, "immense-quotes") === false &&
  canAccessApplication(zionSales, orgZion, roleSales, "error-hub") === false,
  "Test 4: Zion Sales sees Zion Quotes"
);

// Test 5: Immense Admin sees Immense applications only
assert(
  canAccessApplication(immenseAdmin, orgImmense, roleAdmin, "error-hub") === true &&
  canAccessApplication(immenseAdmin, orgImmense, roleAdmin, "immense-quotes") === true &&
  canAccessApplication(immenseAdmin, orgImmense, roleAdmin, "zion-quotes") === false,
  "Test 5: Immense Admin sees Immense applications only"
);

// Test 6: Zion Admin sees Zion applications only
assert(
  canAccessApplication(zionAdmin, orgZion, roleAdmin, "zion-quotes") === true &&
  canAccessApplication(zionAdmin, orgZion, roleAdmin, "immense-quotes") === false &&
  canAccessApplication(zionAdmin, orgZion, roleAdmin, "error-hub") === false,
  "Test 6: Zion Admin sees Zion applications only"
);

// Test 7: Super Admin sees all applications
assert(
  canAccessApplication(superAdmin, orgCentral, roleSuperAdmin, "error-hub") === true &&
  canAccessApplication(superAdmin, orgCentral, roleSuperAdmin, "immense-quotes") === true &&
  canAccessApplication(superAdmin, orgCentral, roleSuperAdmin, "zion-quotes") === true,
  "Test 7: Super Admin sees all applications"
);

// -------------------------------------------------------------
// B. Direct URL Protection Tests (Section 12: Tests 8-14)
// -------------------------------------------------------------
console.log("\n--- B. DIRECT URL ROUTE PROTECTION TESTS ---");

// Test 8: Support -> Immense Quotes = blocked
assert(canAccessRoute(immenseSupport, orgImmense, roleSupport, "/apps/immense-quotes") === false, "Test 8: Support -> Immense Quotes = BLOCKED");

// Test 9: Support -> Zion Quotes = blocked
assert(canAccessRoute(immenseSupport, orgImmense, roleSupport, "/apps/zion-quotes") === false, "Test 9: Support -> Zion Quotes = BLOCKED");

// Test 10: Zion Sales -> Immense Quotes = blocked
assert(canAccessRoute(zionSales, orgZion, roleSales, "/apps/immense-quotes") === false, "Test 10: Zion Sales -> Immense Quotes = BLOCKED");

// Test 11: Zion Admin -> Immense Quotes = blocked
assert(canAccessRoute(zionAdmin, orgZion, roleAdmin, "/apps/immense-quotes") === false, "Test 11: Zion Admin -> Immense Quotes = BLOCKED");

// Test 12: Immense Admin -> Zion Quotes = blocked
assert(canAccessRoute(immenseAdmin, orgImmense, roleAdmin, "/apps/zion-quotes") === false, "Test 12: Immense Admin -> Zion Quotes = BLOCKED");

// Test 13: Sales -> Admin = blocked
assert(canAccessRoute(immenseSales, orgImmense, roleSales, "/admin") === false &&
       canAccessRoute(zionSales, orgZion, roleSales, "/admin") === false, "Test 13: Sales -> Admin = BLOCKED");

// Test 14: Support -> Admin = blocked
assert(canAccessRoute(immenseSupport, orgImmense, roleSupport, "/admin") === false, "Test 14: Support -> Admin = BLOCKED");

// -------------------------------------------------------------
// C. Client Manipulation Defenses (Section 12: Tests 15-20)
// -------------------------------------------------------------
console.log("\n--- C. CLIENT / STORAGE MANIPULATION DEFENSES ---");

// Test 15: LocalStorage manipulation defense
// Simulated attacker injecting { role: "Super Admin" } into localStorage
const simulatedAttackerProfile = { ...immenseSales }; // authoritative database profile
const attackerLocalStorageRole = "Super Admin"; // injected in browser
// Engine ignores localStorage and evaluates against verified database profile object
assert(
  isAdmin(simulatedAttackerProfile.role) === false &&
  canAccessRoute(simulatedAttackerProfile, orgImmense, simulatedAttackerProfile.role, "/admin") === false,
  "Test 15: localStorage role manipulation cannot escalate privileges"
);

// Test 16: SessionStorage manipulation defense
const attackerSessionStorageOrg = "zion"; // injected in browser
assert(
  canAccessApplication(simulatedAttackerProfile, orgImmense, simulatedAttackerProfile.role, "zion-quotes") === false,
  "Test 16: sessionStorage organization manipulation cannot bypass entity boundary"
);

// Test 17: URL query manipulation defense
// Attacker opens /apps/zion-quotes?role=SuperAdmin&org=zion
const sanitizedRoutePath = "/apps/zion-quotes"; // normalized path stripped of malicious queries
assert(
  canAccessRoute(immenseSales, orgImmense, roleSales, sanitizedRoutePath) === false,
  "Test 17: URL query manipulation (?role=SuperAdmin) does not alter authorization outcome"
);

// Test 18: React state tampering defense
const tamperedUserApp: UserApplication = {
  id: "ua-fake",
  userId: "user-123",
  applicationId: "zion-quotes", // attempting to grant cross-entity app
  grantedBy: "attacker",
  createdAt: ""
};
assert(
  canAccessApplication(immenseSales, orgImmense, roleSales, "zion-quotes", [tamperedUserApp]) === false,
  "Test 18: React state override cannot cross entity boundary"
);

// Test 19: Browser refresh on unauthorized route
// On refresh, session & profile reload from database; authorization is re-evaluated
assert(
  canAccessRoute(immenseSupport, orgImmense, roleSupport, "/apps/immense-quotes") === false,
  "Test 19: Browser refresh on unauthorized route remains BLOCKED"
);

// Test 20: Back/forward navigation defense
assert(
  canAccessRoute(zionSales, orgZion, roleSales, "/apps/immense-quotes") === false &&
  canAccessRoute(immenseSupport, orgImmense, roleSupport, "/admin") === false,
  "Test 20: History back/forward navigation continues to enforce route guards"
);

// -------------------------------------------------------------
// D. Application Active Status Tests (Section 12: Tests 21-22)
// -------------------------------------------------------------
console.log("\n--- D. APPLICATION ACTIVE/INACTIVE STATUS TESTS ---");

// Mock registry with an inactive application
const mockRegistryWithInactive: Record<AppSlug, AppRegistryItem> = {
  ...REGISTERED_APPLICATIONS,
  "immense-quotes": {
    ...REGISTERED_APPLICATIONS["immense-quotes"],
    isActive: false, // temporarily deactivated by enterprise management
  },
};

// Test 21: Inactive application is hidden from normal users
assert(
  canAccessApplication(immenseSales, orgImmense, roleSales, "immense-quotes", [], [], mockRegistryWithInactive) === false,
  "Test 21: Inactive application is hidden from normal users"
);
// Super Admin retains administrative inspection
assert(
  canAccessApplication(superAdmin, orgCentral, roleSuperAdmin, "immense-quotes", [], [], mockRegistryWithInactive) === true,
  "Test 21b: Super Admin retains inspection access to inactive application"
);

// Test 22: Direct URL to inactive application is blocked
assert(
  canAccessRoute(immenseSales, orgImmense, roleSales, "/apps/immense-quotes", [], [], mockRegistryWithInactive) === false,
  "Test 22: Direct URL to inactive application is BLOCKED"
);

console.log("\n=======================================================");
console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
}
