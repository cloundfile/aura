const fs = require("fs");
const path = require("path");

class ModularModel {
  scaffold(cwd) {
    const pastas = ["screens", "services", "components", "repositories", "routes", "utils"];
    pastas.forEach((pasta) => {
      fs.mkdirSync(path.join(cwd, "src", pasta), { recursive: true });
    });
    return pastas;
  }

  updateTsconfig(projeto) {
    const tsconfigPath = path.join(projeto, "tsconfig.json");
    if (!fs.existsSync(tsconfigPath)) {
      return null;
    }
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
    tsconfig.compilerOptions ??= {};
    tsconfig.compilerOptions.paths = {
      "@/*": ["./src/*"],
      ...(tsconfig.compilerOptions.paths ?? {}),
    };
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");
    return tsconfigPath;
  }
}

module.exports = { ModularModel };
