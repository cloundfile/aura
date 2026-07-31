class CliView {
  help() {
    console.log(`Comandos disponíveis:
  aura create <nome>   - Cria um novo projeto Expo
  aura version         - Atualiza a versão do app
  aura modular         - Configura tsconfig.json com paths e cria pastas src
  aura preview         - Gera versão + build de preview (local)
  aura production      - Gera versão + build de produção
  aura help            - Mostra esta ajuda`);
  }

  showSuccess(message) {
    console.log(message);
  }

  showError(message) {
    console.error(message);
  }
}

module.exports = { CliView };