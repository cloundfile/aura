const fs = require("fs");
const path = require("path");

class VersionModel {
  generateVersion(date = new Date()) {
    const pad = (n) => String(n).padStart(2, "0");
    return `1.0.${pad(date.getDate())}${pad(date.getMonth() + 1)}${pad(date.getHours())}${pad(date.getMinutes())}`;
  }

  update(cwd) {
    const pkgPath = path.resolve(cwd, "package.json");
    if (!fs.existsSync(pkgPath)) {
      throw new Error("package.json not found in the current directory");
    }

    const version = this.generateVersion();
    const files = [
      { path: "package.json", fields: ["version"] },
      { path: "app.json", fields: ["expo.version"] },
    ];

    const updated = files.map(({ path: filePath, fields }) => {
      const fullPath = path.resolve(cwd, filePath);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`${filePath} not found in the current directory`);
      }
      const content = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      fields.forEach((field) => {
        const keys = field.split(".");
        let obj = content;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) {
            throw new Error(`${filePath}: campo "${keys[i]}" não encontrado`);
          }
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = version;
      });
      fs.writeFileSync(fullPath, JSON.stringify(content, null, 2) + "\n");
      return { filePath };
    });

    return { version, updated };
  }
}

module.exports = { VersionModel };
