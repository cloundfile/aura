const { CliView } = require("../views/CliView");
const { CreateController } = require("./CreateController");
const { VersionController } = require("./VersionController");
const { ModularController } = require("./ModularController");
const { BuildController } = require("./BuildController");

class CliController {
  constructor(command, appName) {
    this.command = command;
    this.appName = appName;
  }

  run() {
    switch (this.command) {
      case "create":
        new CreateController().handle(this.appName);
        break;
      case "version":
        new VersionController().handle();
        break;
      case "modular":
        new ModularController().handle();
        break;
      case "preview":
        new BuildController().handle("preview");
        break;
      case "production":
        new BuildController().handle("production");
        break;
      case "help":
      case undefined:
      case null:
        new CliView().help();
        break;
      default:
        new CliView().showError("Comando não encontrado, para ajuda digite aura help");
        process.exit(1);
    }
  }
}

module.exports = { CliController };
