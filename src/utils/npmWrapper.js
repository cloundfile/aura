const { execSync } = require("node:child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

function setupNpmWrapper() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "aura-npm-"));
  const wrapperPath = path.join(tmpDir, "npm");
  const realNpm = process.platform === "win32"
    ? execSync("where npm").toString().trim().split("\n")[0]
    : execSync("command -v npm").toString().trim();
  fs.writeFileSync(wrapperPath, `#!/bin/sh
  REAL_NPM='${realNpm}'
  has_pack=false
  has_json=false
  for arg in "$@"; do
    if [ "$arg" = "pack" ]; then has_pack=true; fi
    if [ "$arg" = "--json" ]; then has_json=true; fi
  done
  if $has_pack && $has_json; then
    RAW=$("$REAL_NPM" "$@" 2>/dev/null)
    EXIT_CODE=$?
    if [ $EXIT_CODE -ne 0 ]; then
      echo "$RAW" >&2
      exit $EXIT_CODE
    fi
    FIRST_CHAR=$(printf '%s' "$RAW" | head -c1)
    if [ "$FIRST_CHAR" = "[" ]; then
      printf '%s' "$RAW"
    else
      node -e "process.stdout.write(JSON.stringify(Object.values(JSON.parse(process.argv[1])).filter(v=>v&&typeof v==='object')))" "$RAW"
    fi
  else
    exec "$REAL_NPM" "$@"
  fi
  `);
  fs.chmodSync(wrapperPath, 0o755);
  return tmpDir;
}

module.exports = { setupNpmWrapper };
