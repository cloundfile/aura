const { runCommand } = require("../utils/commandRunner");

class BuildModel {
  preview() {
    runCommand(["eas", "build", "--platform", "android", "--profile", "preview", "--local"]);
  }

  production() {
    runCommand(["eas", "build", "--platform", "android", "--profile", "production"]);
  }
}

module.exports = { BuildModel };
