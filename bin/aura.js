#!/usr/bin/env node
const { spawn, execSync } = require("node:child_process");
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

const [command, appName] = process.argv.slice(2);

function runVersion() {
  const pkgPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.error("package.json not found in the current directory");
    process.exit(1);
  }
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const version = `1.0.${pad(now.getDate())}${pad(now.getMonth() + 1)}${pad(now.getHours())}${pad(now.getMinutes())}`;

  const files = [
    { path: "package.json", fields: ["version"] },
    { path: "app.json", fields: ["expo.version"] },
  ];

  files.forEach(({ path: filePath, fields }) => {
    const fullPath = path.resolve(process.cwd(), filePath);
    try {
      const content = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      fields.forEach((field) => {
        const keys = field.split(".");
        let obj = content;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) {
            console.error(`${filePath}: campo "${keys[i]}" não encontrado`);
            process.exit(1);
          }
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = version;
      });
      fs.writeFileSync(fullPath, JSON.stringify(content, null, 2) + "\n");
      console.log(`${filePath} -> ${version}`);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.error(`${filePath} not found in the current directory`);
      } else {
        console.error(`Erro ao processar ${filePath}: ${err.message}`);
      }
      process.exit(1);
    }
  });

  return version;
}

function runCommand(args, env) {
  const child = spawn("npx", args, { stdio: "inherit", env });
  child.on("error", (err) => {
    console.error(`Erro ao executar o comando: ${err.message}`);
    process.exit(1);
  });
  child.on("exit", (code) => process.exit(typeof code === "number" ? code : 1));
}

if (command === "create") {
  const npmFixDir = setupNpmWrapper();
  const env = { ...process.env, PATH: npmFixDir + path.delimiter + process.env.PATH };
  process.on("exit", () => fs.rmSync(npmFixDir, { recursive: true, force: true }));
  runCommand(["--yes", "create-expo-app@latest", appName || ".", "--template", "blank-typescript"], env);
} else if (command === "version") {
  runVersion();
} else if (command === "production") {
  runVersion();
  runCommand(["eas", "build", "--platform", "android", "--profile", "production"]);
} else if (command === "help" || !command) {
  console.log(`Comandos disponíveis:
  aura create <nome>   - Cria um novo projeto Expo
  aura version         - Atualiza a versão do app
  aura preview         - Gera versão + build de preview (local)
  aura production      - Gera versão + build de produção
  aura help            - Mostra esta ajuda`);
} else if (command === "preview") {
  runVersion();
  runCommand(["eas", "build", "--platform", "android", "--profile", "preview", "--local"]);
} else {
  console.error(`Comando não encontrado, para ajuda digite aura help`);
  process.exit(1);
}
