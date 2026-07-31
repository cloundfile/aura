const { VersionModel } = require("../models/VersionModel");
const { CliView } = require("../views/CliView");

class VersionController {
  handle() {
    try {
      const result = new VersionModel().update(process.cwd());
      result.updated.forEach(({ filePath }) =>
        new CliView().showSuccess(`${filePath} -> ${result.version}`)
      );
    } catch (err) {
      new CliView().showError(err.message);
      process.exit(1);
    }
  }
}

module.exports = { VersionController };
