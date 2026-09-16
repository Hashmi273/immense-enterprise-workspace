import { 
  canAccessApplication, 
  hasPermission, 
  canAccessRoute, 
  isAdmin, 
  isSuperAdmin 
} from "../lib/authorization";
import { UserProfile, Organization, Role, UserApplication } from "../types";

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
console.log(" RUNNING PHASE 6 RBAC AUTHORIZATION ENGINE TESTS");
console.log("=======================================================\n");

// 1. Immense Air Support Tests
console.log("1. Immense Air Support User:");
const immenseSupport = makeProfile(orgImmense, roleSupport);
assert(canAccessApplication(immenseSupport, orgImmense, roleSupport, "error-hub") === true, "Error Hub = ALLOWED");
assert(canAccessApplication(immenseSupport, orgImmense, roleSupport, "immense-quotes") === false, "Immense Quotes = DENIED");
assert(canAccessApplication(immenseSupport, orgImmense, roleSupport, "zion-quotes") === false, "Zion Quotes = DENIED");
assert(isAdmin(roleSupport) === false, "Admin Console = DENIED");

// 2. Immense Air Operations Tests
console.log("\n2. Immense Air Operations User:");
const immenseOps = makeProfile(orgImmense, roleOps);
assert(canAccessApplication(immenseOps, orgImmense, roleOps, "error-hub") === true, "Error Hub = ALLOWED");
assert(canAccessApplication(immenseOps, orgImmense, roleOps, "immense-quotes") === false, "Quotations = DENIED");

// 3. Immense Air Sales Tests
console.log("\n3. Immense Air Sales User:");
const immenseSales = makeProfile(orgImmense, roleSales);
assert(canAccessApplication(immenseSales, orgImmense, roleSales, "immense-quotes") === true, "Immense Quotes = ALLOWED");
assert(canAccessApplication(immenseSales, orgImmense, roleSales, "error-hub") === false, "Error Hub (default) = DENIED");
assert(canAccessApplication(immenseSales, orgImmense, roleSales, "zion-quotes") === false, "Zion Quotes = DENIED");
assert(isAdmin(roleSales) === false, "Admin Console = DENIED");

// 4. Immense Air Admin Tests
console.log("\n4. Immense Air Admin User:");
const immenseAdmin = makeProfile(orgImmense, roleAdmin);
assert(canAccessApplication(immenseAdmin, orgImmense, roleAdmin, "error-hub") === true, "Error Hub = ALLOWED");
assert(canAccessApplication(immenseAdmin, orgImmense, roleAdmin, "immense-quotes") === true, "Immense Quotes = ALLOWED");
assert(canAccessApplication(immenseAdmin, orgImmense, roleAdmin, "zion-quotes") === false, "Zion Quotes = DENIED (Cross-Entity Block)");
assert(isAdmin(roleAdmin) === true, "Admin Console = ALLOWED");

// 5. Zion Sales Tests
console.log("\n5. Zion Sales User:");
const zionSales = makeProfile(orgZion, roleSales);
assert(canAccessApplication(zionSales, orgZion, roleSales, "zion-quotes") === true, "Zion Quotes = ALLOWED");
assert(canAccessApplication(zionSales, orgZion, roleSales, "immense-quotes") === false, "Immense Quotes = DENIED (Cross-Entity Block)");
assert(canAccessApplication(zionSales, orgZion, roleSales, "error-hub") === false, "Error Hub = DENIED");

// 6. Zion Admin Tests
console.log("\n6. Zion Admin User:");
const zionAdmin = makeProfile(orgZion, roleAdmin);
assert(canAccessApplication(zionAdmin, orgZion, roleAdmin, "zion-quotes") === true, "Zion Quotes = ALLOWED");
assert(canAccessApplication(zionAdmin, orgZion, roleAdmin, "immense-quotes") === false, "Immense Quotes = DENIED (Cross-Entity Block)");
assert(canAccessApplication(zionAdmin, orgZion, roleAdmin, "error-hub") === false, "Error Hub = DENIED (Cross-Entity Block)");
assert(isAdmin(roleAdmin) === true, "Admin Console = ALLOWED");

// 7. Super Admin Tests
console.log("\n7. Super Admin User (Universal Scope):");
const superAdmin = makeProfile(orgCentral, roleSuperAdmin);
assert(canAccessApplication(superAdmin, orgCentral, roleSuperAdmin, "error-hub") === true, "Error Hub = ALLOWED");
assert(canAccessApplication(superAdmin, orgCentral, roleSuperAdmin, "immense-quotes") === true, "Immense Quotes = ALLOWED");
assert(canAccessApplication(superAdmin, orgCentral, roleSuperAdmin, "zion-quotes") === true, "Zion Quotes = ALLOWED");
assert(isSuperAdmin(roleSuperAdmin) === true, "Super Admin Flag = TRUE");
assert(isAdmin(roleSuperAdmin) === true, "Admin Console = ALLOWED");

// 8. Individual Application Override Tests
console.log("\n8. Individual Application Overrides:");
const salesWithErrorOverride: UserApplication[] = [
  { id: "ua-1", userId: "user-123", applicationId: "error-hub", grantedBy: "admin-1", createdAt: "" }
];
assert(
  canAccessApplication(immenseSales, orgImmense, roleSales, "error-hub", salesWithErrorOverride) === true,
  "Immense Sales granted Error Hub override = ALLOWED"
);

// 9. Cross-Entity Isolation Override Protection
console.log("\n9. Cross-Entity Override Boundary Defense:");
const zionWithImmenseOverride: UserApplication[] = [
  { id: "ua-2", userId: "user-123", applicationId: "immense-quotes", grantedBy: "rogue-admin", createdAt: "" }
];
assert(
  canAccessApplication(zionSales, orgZion, roleSales, "immense-quotes", zionWithImmenseOverride) === false,
  "Zion Sales with rogue Immense override = BLOCKED (Org Boundary Wins)"
);

// 10. Inactive User Quarantine Tests
console.log("\n10. Inactive User Quarantine:");
const inactiveUser = makeProfile(orgImmense, roleSuperAdmin, false); // Even Super Admin if inactive!
assert(canAccessApplication(inactiveUser, orgImmense, roleSuperAdmin, "immense-quotes") === false, "Inactive user application access = BLOCKED");
assert(canAccessRoute(inactiveUser, orgImmense, roleSuperAdmin, "/apps/immense-quotes") === false, "Inactive user route access = BLOCKED");

// 11. Route-Level Authorization Tests
console.log("\n11. Route Guards:");
assert(canAccessRoute(immenseSupport, orgImmense, roleSupport, "/apps/error-hub") === true, "Support -> /apps/error-hub = ALLOWED");
assert(canAccessRoute(immenseSupport, orgImmense, roleSupport, "/apps/immense-quotes") === false, "Support -> /apps/immense-quotes = BLOCKED");
assert(canAccessRoute(immenseSupport, orgImmense, roleSupport, "/apps/zion-quotes") === false, "Support -> /apps/zion-quotes = BLOCKED");
assert(canAccessRoute(immenseSupport, orgImmense, roleSupport, "/admin") === false, "Support -> /admin = BLOCKED");
assert(canAccessRoute(zionSales, orgZion, roleSales, "/apps/immense-quotes") === false, "Zion Sales -> /apps/immense-quotes = BLOCKED");
assert(canAccessRoute(zionSales, orgZion, roleSales, "/apps/zion-quotes") === true, "Zion Sales -> /apps/zion-quotes = ALLOWED");

console.log("\n=======================================================");
console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
}
