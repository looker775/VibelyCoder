const fs = require("fs");
const path = require("path");

const cliFile = path.join(__dirname, "cli.js");
const packageJsonFile = path.join(__dirname, "package.json");

if (!fs.existsSync(cliFile)) {
  console.error("❌ cli.js not found in this folder!");
  process.exit(1);
}
if (!fs.existsSync(packageJsonFile)) {
  console.error("❌ package.json not found in this folder!");
  process.exit(1);
}

const cliCode = fs.readFileSync(cliFile, "utf8");
const pkg = JSON.parse(fs.readFileSync(packageJsonFile, "utf8"));

// ✅ Grab all require/import statements
const requireRegex = /require\(['"`](.*?)['"`]\)/g;
const importRegex = /import .*? from ['"`](.*?)['"`]/g;

let match;
const modulesUsed = new Set();

// 🔍 Find require() statements
while ((match = requireRegex.exec(cliCode)) !== null) {
  if (!match[1].startsWith(".")) modulesUsed.add(match[1]);
}

// 🔍 Find import statements
while ((match = importRegex.exec(cliCode)) !== null) {
  if (!match[1].startsWith(".")) modulesUsed.add(match[1]);
}

// ✅ Check against dependencies
const declaredDeps = new Set(Object.keys(pkg.dependencies || {}));
const missing = [...modulesUsed].filter(dep => !declaredDeps.has(dep));

console.log("📦 CLI requires these modules:", [...modulesUsed].join(", "));
if (missing.length > 0) {
  console.log("⚠️ Missing from package.json:", missing.join(", "));
  console.log(`👉 Run this command to add them:\n\n npm install ${missing.join(" ")} --save\n`);
} else {
  console.log("✅ All CLI dependencies are already listed in package.json");
}
