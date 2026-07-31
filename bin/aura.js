#!/usr/bin/env node
const { CliController } = require("../src/controllers/CliController");

const [command, appName] = process.argv.slice(2);
new CliController(command, appName).run();
