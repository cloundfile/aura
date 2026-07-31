const { runCommand } = require("../utils/commandRunner");
const { setupNpmWrapper } = require("../utils/npmWrapper");
const fs = require("fs");
const path = require("path");

class CreateModel {
  create(appName, cwd) {
    const npmFixDir = setupNpmWrapper();
    const env = { ...process.env, PATH: npmFixDir + path.delimiter + process.env.PATH };
    process.on("exit", () => fs.rmSync(npmFixDir, { recursive: true, force: true }));
    runCommand(["--yes", "create-expo-app@latest", appName || ".", "--template", "blank-typescript"], env);
  }
}

module.exports = { CreateModel };
