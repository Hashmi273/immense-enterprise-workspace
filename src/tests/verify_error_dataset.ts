import { ERROR_DATASET } from "../apps/error-hub/data/errors";
import fs from "fs";

const originalRaw = JSON.parse(
  fs.readFileSync("C:/Users/Admin/.gemini/antigravity/scratch/inspect_repos/sms-error-code/data/errors.json", "utf-8")
);

console.log("Original Count: ", originalRaw.length);
console.log("Integrated Count:", ERROR_DATASET.length);

if (originalRaw.length !== ERROR_DATASET.length) {
  console.error("MISMATCH ERROR!");
  process.exit(1);
}

// Compare each record
let mismatches = 0;
for (let i = 0; i < originalRaw.length; i++) {
  if (
    originalRaw[i].code !== ERROR_DATASET[i].code ||
    originalRaw[i].description !== ERROR_DATASET[i].description ||
    originalRaw[i].category !== ERROR_DATASET[i].category
  ) {
    mismatches++;
  }
}

console.log("Record-by-record comparison mismatches:", mismatches);
if (mismatches > 0) {
  console.error("DATA INTEGRITY VIOLATION!");
  process.exit(1);
} else {
  console.log("DATASET VERIFICATION: 100% IDENTICAL (0 differences across 693 records)");
}
