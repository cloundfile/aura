class CliView {
  help() {
    console.log(`Comandos disponíveis:
      aura create <nome>   - Cria um novo projeto Expo
      aura version         - Atualiza a versão do app
      aura modular         - Gera as pastas do app
      aura preview         - Gera versão de testes local
      aura production      - Gera versão de produção
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