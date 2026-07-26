# Aura

Aura é um CLI para acelerar o desenvolvimento de projetos Expo com TypeScript.

## Instalação

```bash
npm install -g @inneobr/aura
```

## Comandos

| Comando | Descrição |
|---|---|
| `aura create <nome>` | Cria um novo projeto Expo com TypeScript |
| `aura version` | Atualiza a versão do app em `package.json` e `app.json` |
| `aura projetar` | Configura `tsconfig.json` com `@/*` e cria a estrutura `src/` |
| `aura preview` | Gera versionamento + build de preview local |
| `aura production` | Gera versionamento + build de produção |
| `aura help` | Exibe a ajuda |

## Estrutura gerada pelo `aura projetar`

```
src/
├── components/
├── repositories/
├── routes/
├── screens/
├── services/
└── utils/
```
