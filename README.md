# LibrasFlow

LibrasFlow é uma aplicação web colaborativa para tradução e catalogação de sinais de **Libras** (Língua Brasileira de Sinais). A plataforma permite que usuários consultem um dicionário de sinais, traduzam palavras do português para Libras e contribuam com novos sinais — incluindo suas variações regionais — através de um fluxo de curadoria.

## 👥 Equipe e Divisão de Atividades

Este projeto foi desenvolvido para a disciplina *AMS0002 – Análise e Modelagem de Sistemas* (UDESC), com base no relatório técnico "Análise, Modelagem e Especificação de um Sistema Colaborativo e Inclusivo para o Dicionário da Língua Brasileira de Sinais".

### Luca Mateo Rangel — Engenharia de Requisitos
- Identificação dos quatro perfis hierárquicos de usuário (Visitante, Colaborador/Sinalizante, Curador/Linguista e Administrador) e suas respectivas histórias de usuário.
- Elicitação dos Requisitos Funcionais (RF01–RF07), cobrindo dicionário e tradução por IA, submissão detalhada de sinais, modelagem gramatical da Libras, gestão de mídia dupla (foto + vídeo), workflow de curadoria, manutenção do dicionário e gestão administrativa de contas.
- Definição dos Requisitos Não-Funcionais (RNF01–RNF04) com métricas quantificáveis: limites de upload (50MB vídeo / 10MB foto, processamento em até 15s), latência de busca (≤800ms), tempo de exibição de notificações (3s) e responsividade a partir de 320px.
- Especificação da conformidade normativa com *WCAG 2.1 (Nível AA)* e *LGPD*, incluindo TCLE, tratamento de dados de menores (nome e CPF do responsável legal) e direito ao esquecimento via exclusão em cascata.
- Estruturação do caso de uso "Submeter Novo Sinal ao Dicionário", com fluxo principal e fluxos alternativos (menor de idade, falha de validação de mídia, ausência de consentimento).

### Matheus Cesconetto — Modelagem de Software
- Elaboração do *Diagrama de Classes*, definindo a hierarquia de generalização entre Usuario (abstrata), Colaborador, Curador e Administrador, e a entidade central Sinal com seus relacionamentos de composição com ParametroPrimario e ParametroSecundario.
- Modelagem das enumerações linguísticas (ComponenteNaoManual, DisposicaoMao, StatusSinal, TipoSinal), garantindo que os parâmetros gramaticais da Libras sejam restritos a categorias controladas.
- Elaboração do *Diagrama de Atividades*, organizado em raias (Colaborador, Curador/Administrador, Usuário Comum), detalhando o fluxo completo de submissão, validação de arquivos, tratamento de menores de idade, aceite do TCLE e decisão de aprovação/rejeição.
- Elaboração do *Diagrama de Sequência*, representando a interação síncrona entre Colaborador, Interface, GerenciadorDeSinais e Banco de Dados durante a submissão, e a fase assíncrona de moderação pelo Curador.

### João Pedro Espindola Sezerino — Projeto de Software
- Definição e justificativa da arquitetura adotada: *Arquitetura em Camadas (Layered Architecture)* integrada ao padrão *MVC*.
- Especificação das quatro camadas do sistema — Apresentação (View), Controle e Aplicação, Domínio e Serviços, e Infraestrutura/Acesso a Dados — e suas responsabilidades isoladas.
- Elaboração da Matriz de Justificativas Técnicas, correlacionando os desafios do projeto (complexidade gramatical da Libras, fluxo de aprovação de mídia, armazenamento escalável, conformidade com a LGPD) às soluções arquiteturais e seus impactos (manutenibilidade, confiabilidade, escalabilidade e segurança jurídica).
- Detalhamento dos impactos da arquitetura no sucesso do projeto: manutenibilidade e evolução tecnológica, robustez e segurança do fluxo de moderação, e estratégia de persistência/escalabilidade de mídia (separação entre banco relacional e armazenamento em buckets).

### Guilherme Wippel Kormann — Desenvolvimento Colaborativo
- Estabelecimento do *Critério de Pronto (Definition of Done)*, alinhado às práticas do framework Scrum, com critérios de execução de escopo, revisão por pares, qualidade do protótipo (sem erros críticos, conformidade com WCAG e LGPD), consistência dos artefatos e atualização da gestão ágil.
- Organização e manutenção do quadro Kanban (Trello) do projeto, estruturando o backlog, as Sprints e a movimentação das tarefas até a coluna "Concluído".
- Garantia de que atividades transversais (Engenharia de Requisitos, Arquitetura de Software, Modelagem UML e implementação das camadas do protótipo) só fossem encerradas após passar pelo processo de validação do DoD.
- Acompanhamento da revisão por pares dos artefatos produzidos pela equipe, assegurando consistência técnica e redução de retrabalho ao longo do desenvolvimento.

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
