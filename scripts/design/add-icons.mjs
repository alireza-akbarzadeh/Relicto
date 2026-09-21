// Add Material Symbols to ICON_NAMES (sorted, deduped, line endings preserved).
// Usage: node scripts/design/add-icons.mjs name [name...]
//        npx tsc --noEmit | node scripts/design/add-icons.mjs --from-tsc
import fs from "node:fs";

const FILE = "src/components/ui/icon/icon-names.ts";
const source = fs.readFileSync(FILE, "utf8");
const nl = source.includes("\r\n") ? "\r\n" : "\n";
const start = source.indexOf("export const ICON_NAMES = [");
const end = source.indexOf("] as const;", start);
const existing = new Set([...source.slice(start, end).matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]));

let wanted = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
if (process.argv.includes("--from-tsc")) {
  const log = fs.readFileSync(0, "utf8");
  const lines = log.split(/\r?\n/).filter((line) => /is not assignable to type|have no overlap/.test(line));
  const quoted = lines.flatMap((line) => [...line.matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]));
  wanted = wanted.concat(quoted);
}

const added = [...new Set(wanted)].filter((name) => !existing.has(name));
if (added.length === 0) {
  console.log("nothing to add");
  process.exit(0);
}
const all = [...existing, ...added].sort();
const body = `export const ICON_NAMES = [${nl}${all.map((name) => `  "${name}",`).join(nl)}${nl}`;
fs.writeFileSync(FILE, source.slice(0, start) + body + source.slice(end));
console.log(`added ${added.length}: ${added.join(", ")}`);
