# LibrasFlow

LibrasFlow é uma aplicação web colaborativa para tradução e catalogação de sinais de **Libras** (Língua Brasileira de Sinais). A plataforma permite que usuários consultem um dicionário de sinais, traduzam palavras do português para Libras e contribuam com novos sinais — incluindo suas variações regionais — através de um fluxo de curadoria.

## 👥 Equipe e Divisão de Atividades

### Luca Mateo Rangel — Engenharia de Requisitos
- Levantamento e especificação dos requisitos funcionais e não funcionais do sistema (tradução de sinais, dicionário de Libras, envio e curadoria de sinais, autenticação de usuários).
- Definição das regras de negócio relacionadas à conformidade com a **LGPD**, incluindo consentimento de uso de imagem/vídeo, tratamento de dados de menores de idade (autorização de responsável legal) e fluxo de solicitação de exclusão de dados.
- Elicitação dos casos de uso por perfil de usuário (usuário comum, curador, administrador).
- Documentação dos critérios de aceite para as funcionalidades de tradução, submissão e aprovação/rejeição de sinais.

### Matheus Cesconetto — Modelagem de Software
- Modelagem das entidades de domínio do sistema (`Sign`, `User`, `TranslationHistory`, `DataDeletionRequest`) e seus atributos, tipos e relacionamentos.
- Definição da estrutura de dados de cada sinal, contemplando parâmetros linguísticos da Libras (configuração de mão, ponto de articulação, orientação, disposição das mãos, região de contato, componentes não manuais e classificação do sinal).
- Modelagem do fluxo de estados do processo de curadoria (`pending`, `approved`, `rejected`).
- Elaboração de diagramas (casos de uso, classes/entidades e fluxo de dados) representando a arquitetura conceitual da aplicação.

### João Pedro Espindola Sezerino — Projeto de Software
- Definição da arquitetura técnica da aplicação, com base em React, Vite e integração com o backend-as-a-service Base44.
- Estruturação do projeto em camadas (`pages`, `components`, `api`, `hooks`, `lib`, `utils`) e definição dos padrões de organização do código.
- Especificação da integração entre frontend e backend via `@base44/sdk`, incluindo autenticação, persistência das entidades e armazenamento de mídia (vídeos e fotos dos sinais).
- Decisões de design técnico quanto a roteamento (React Router), gerenciamento de estado assíncrono (TanStack Query), validação de formulários (React Hook Form + Zod) e biblioteca de componentes de interface (Radix UI / shadcn).

### Guilherme Wippel Kormann — Desenvolvimento Colaborativo
- Implementação das funcionalidades em conjunto com a equipe, seguindo as convenções definidas no projeto de software.
- Desenvolvimento e manutenção do versionamento colaborativo do código-fonte (controle de branches, revisão de código e integração das contribuições da equipe).
- Apoio na implementação das páginas da aplicação (Tradutor, Dicionário de Sinais, Envio de Sinais, Curadoria, Administração e Conta do Usuário).
- Testes de integração entre as funcionalidades desenvolvidas pelos diferentes membros da equipe, garantindo consistência entre requisitos, modelo de dados e arquitetura definidos.

## ✨ Funcionalidades

- **Tradutor**: tradução de palavras/expressões em português para o sinal correspondente em Libras.
- **Dicionário de sinais**: catálogo com detalhes linguísticos de cada sinal (configuração de mão, ponto de articulação, orientação, expressões não manuais, classificação, etc.), incluindo variações regionais por estado/região do Brasil.
- **Envio de sinais (Submit Sign)**: usuários podem submeter novos sinais com vídeo e foto da configuração de mão, com suporte a consentimento LGPD e fluxo específico para sinalizantes menores de idade.
- **Curadoria**: painel para revisão e aprovação/rejeição de sinais enviados pela comunidade.
- **Administração**: gerenciamento de usuários e conteúdo da plataforma.
- **Conta do usuário**: histórico de traduções, dados de perfil e solicitações de exclusão de dados (LGPD).
- **Autenticação**: login, cadastro, recuperação e redefinição de senha.

## 🛠️ Stack Tecnológica

- **[React 18](https://react.dev/)** + **[Vite](https://vite.dev/)** — frontend e build tool
- **[Base44](https://base44.com/)** (`@base44/sdk`, `@base44/vite-plugin`) — backend-as-a-service (entidades, autenticação e armazenamento)
- **[Tailwind CSS](https://tailwindcss.com/)** + **[Radix UI](https://www.radix-ui.com/)** + **[shadcn/ui](https://ui.shadcn.com/)** — estilização e componentes de UI
- **[React Router](https://reactrouter.com/)** — roteamento
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — formulários e validação
- **[TanStack Query](https://tanstack.com/query)** — gerenciamento de estado assíncrono
- **[Framer Motion](https://www.framer.com/motion/)** — animações
- **ESLint** + **TypeScript (checking via jsconfig)** — qualidade de código

## 📁 Estrutura do Projeto

```
librasFlow/
├── base44/
│   └── entities/        # Esquemas das entidades do backend (Sign, User, TranslationHistory, ...)
├── src/
│   ├── api/              # Cliente do Base44 SDK
│   ├── components/       # Componentes reutilizáveis de UI
│   ├── hooks/             # Hooks customizados
│   ├── lib/                # Utilitários e configurações
│   ├── pages/             # Páginas da aplicação (Home, Translator, Curation, Admin, ...)
│   ├── utils/             # Funções utilitárias
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json
```

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/)
- [Base44 CLI](https://docs.base44.com/developers/references/cli/get-started/overview.md) (caso queira rodar o backend localmente)

### Instalação

```bash
npm install
```

### Desenvolvimento

Para trabalhar apenas no frontend, usando o backend hospedado do Base44:

```bash
npm run dev
```

Para rodar backend e frontend localmente com o Base44:

```bash
base44 dev
```

### Outros comandos

```bash
npm run build       # build de produção
npm run preview     # pré-visualização do build de produção
npm run lint         # checagem de lint
npm run lint:fix    # correção automática de lint
npm run typecheck   # checagem de tipos
```
