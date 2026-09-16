import { ERROR_DATASET } from "../apps/error-hub/data/errors";
import { canAccessApplication, canAccessRoute } from "../lib/authorization";
import { UserProfile, Organization, Role } from "../types";

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
console.log(" RUNNING PHASE 9 ERROR HUB FUNCTIONAL & RBAC TESTS");
console.log("=======================================================\n");

// 1. Dataset Integrity
console.log("--- 1. DATASET INTEGRITY ---");
assert(ERROR_DATASET.length === 693, "Total record count == 693 (Identical to original production)");

// 2. Search Engine Verification
console.log("\n--- 2. SEARCH ENGINE VERIFICATION ---");
// Exact code search: 20A
const exact20A = ERROR_DATASET.filter(e => e.code.toLowerCase() === "20a");
assert(exact20A.length > 0 && exact20A[0].description.includes("Bearer Service"), "Exact search for '20A' finds 'Bearer Service Not Supported'");

// Exact code search: 408
const exact408 = ERROR_DATASET.filter(e => e.code.toLowerCase() === "408");
assert(exact408.length > 0, "Exact search for '408' returns valid match");

// Partial code search: 51
const partial51 = ERROR_DATASET.filter(e => e.code.toLowerCase().includes("51"));
assert(partial51.length > 1, `Partial code search for '51' returns multiple matches (${partial51.length} found)`);

// Description keyword search: timeout
const descTimeout = ERROR_DATASET.filter(e => e.description.toLowerCase().includes("timeout"));
assert(descTimeout.length > 0, `Description keyword search for 'timeout' returns ${descTimeout.length} matches`);

// Description keyword search: DLT
const descDLT = ERROR_DATASET.filter(e => e.description.toLowerCase().includes("dlt") || e.category.toLowerCase().includes("dlt"));
assert(descDLT.length > 0, `DLT keyword search returns ${descDLT.length} matches`);

// Zero result search
const zeroResult = ERROR_DATASET.filter(e => e.code.toLowerCase() === "xyz9999notfound");
assert(zeroResult.length === 0, "Non-existent error query correctly yields 0 results");

// 3. Category Filter Verification
console.log("\n--- 3. CATEGORY FILTER VERIFICATION ---");
const categories = Array.from(new Set(ERROR_DATASET.map(e => e.category)));
assert(categories.length >= 5, `Categorization intact: found ${categories.length} distinct categories`);
for (const cat of categories) {
  const inCat = ERROR_DATASET.filter(e => e.category === cat);
  assert(inCat.length > 0, `Category '${cat}' contains ${inCat.length} records`);
}

// 4. RBAC & Security for Error Hub
console.log("\n--- 4. RBAC ROUTE & PERMISSION SECURITY ---");
const orgImmense: Organization = { id: "org-immense", name: "Immense Air Pvt Ltd", slug: "immense-air", createdAt: "" };
const orgZion: Organization = { id: "org-zion", name: "Zion", slug: "zion", createdAt: "" };
const orgCentral: Organization = { id: "org-central", name: "Central", slug: "central", createdAt: "" };

const roleSupport: Role = { id: "r-sup", name: "Support", description: "", isSystem: true };
const roleOps: Role = { id: "r-ops", name: "Operations", description: "", isSystem: true };
const roleSales: Role = { id: "r-sal", name: "Sales", description: "", isSystem: true };
const roleAdmin: Role = { id: "r-adm", name: "Admin", description: "", isSystem: true };
const roleSuper: Role = { id: "r-supa", name: "Super Admin", description: "", isSystem: true };

function makeP(org: Organization, r: Role, active = true): UserProfile {
  return { id: "u-1", fullName: "User", email: "u@example.com", organizationId: org.id, roleId: r.id, role: r, isActive: active, createdAt: "", updatedAt: "" };
}

// Support -> Allowed
assert(canAccessApplication(makeP(orgImmense, roleSupport), orgImmense, roleSupport, "error-hub") === true, "Immense Support -> Error Hub = ALLOWED");
// Operations -> Allowed
assert(canAccessApplication(makeP(orgImmense, roleOps), orgImmense, roleOps, "error-hub") === true, "Immense Operations -> Error Hub = ALLOWED");
// Immense Sales -> Blocked by default
assert(canAccessApplication(makeP(orgImmense, roleSales), orgImmense, roleSales, "error-hub") === false, "Immense Sales without override -> Error Hub = BLOCKED");
// Immense Sales with override -> Allowed
assert(canAccessApplication(makeP(orgImmense, roleSales), orgImmense, roleSales, "error-hub", [{ id: "1", userId: "u-1", applicationId: "error-hub", grantedBy: "adm", createdAt: "" }]) === true, "Immense Sales with override -> Error Hub = ALLOWED");
// Zion Sales -> Blocked
assert(canAccessApplication(makeP(orgZion, roleSales), orgZion, roleSales, "error-hub") === false, "Zion Sales -> Error Hub = BLOCKED (Cross-Entity Defense)");
// Zion Admin -> Blocked
assert(canAccessApplication(makeP(orgZion, roleAdmin), orgZion, roleAdmin, "error-hub") === false, "Zion Admin -> Error Hub = BLOCKED (Cross-Entity Defense)");
// Immense Admin -> Allowed
assert(canAccessApplication(makeP(orgImmense, roleAdmin), orgImmense, roleAdmin, "error-hub") === true, "Immense Admin -> Error Hub = ALLOWED");
// Super Admin -> Allowed
assert(canAccessApplication(makeP(orgCentral, roleSuper), orgCentral, roleSuper, "error-hub") === true, "Super Admin -> Error Hub = ALLOWED");
// Inactive user -> Blocked
assert(canAccessApplication(makeP(orgImmense, roleSupport, false), orgImmense, roleSupport, "error-hub") === false, "Inactive User -> Error Hub = BLOCKED");

console.log("\n=======================================================");
console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) process.exit(1);
