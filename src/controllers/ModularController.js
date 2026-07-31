const { ModularModel } = require("../models/ModularModel");
const { CliView } = require("../views/CliView");

class ModularController {
  handle() {
    const view = new CliView();
    const model = new ModularModel();
    const cwd = process.cwd();

    view.showSuccess("Projetando Aura...");
    model.scaffold(cwd).forEach((pasta) =>
      view.showSuccess(`  📁 src/${pasta}/ criado`)
    );

    if (model.updateTsconfig(cwd)) {
      view.showSuccess("  ✅ tsconfig.json atualizado com paths @/*");
    } else {
      view.showSuccess("  ⚠️  tsconfig.json não encontrado, pulando...");
    }
  }
}

module.exports = { ModularController };
