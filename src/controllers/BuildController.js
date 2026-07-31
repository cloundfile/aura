const { BuildModel } = require("../models/BuildModel");
const { VersionController } = require("./VersionController");

class BuildController {
  handle(profile) {
    new VersionController().handle();
    new BuildModel()[profile === "preview" ? "preview" : "production"]();
  }
}

module.exports = { BuildController };
