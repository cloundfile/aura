const { CreateModel } = require("../models/CreateModel");

class CreateController {
  handle(appName) {
    new CreateModel().create(appName, process.cwd());
  }
}

module.exports = { CreateController };
