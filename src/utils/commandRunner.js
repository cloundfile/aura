const { spawn } = require("node:child_process");

function runCommand(args, env) {
  const child = spawn("npx", args, { stdio: "inherit", env });
  child.on("error", (err) => {
    console.error(`Erro ao executar o comando: ${err.message}`);
    process.exit(1);
  });
  child.on("exit", (code) => process.exit(typeof code === "number" ? code : 1));
}

module.exports = { runCommand };
