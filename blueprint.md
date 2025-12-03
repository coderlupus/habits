# Blueprint do Projeto: Rastreador de Hábitos

## Visão Geral

Este documento descreve a arquitetura, funcionalidades e plano de desenvolvimento para o aplicativo Rastreador de Hábitos. O objetivo é criar uma aplicação web moderna, reativa e escalável para ajudar os usuários a construir e manter bons hábitos.

---

## Seção 1: Arquitetura e Design (Versão Anterior)

A versão anterior do aplicativo estabeleceu a base da interface do usuário (UI), corrigiu uma inconsistência estrutural (mistura dos frameworks Vite e Next.js), e implementou a autenticação de usuários com Firebase.

### 1.1. Estrutura do Projeto
- **Framework:** Next.js com App Router (`src/app`).
- **Ponto de Entrada:** `src/app/page.jsx` (página de login).
- **Roteamento:**
    - `/`: Página de Login
    - `/signup`: Página de Cadastro
    - `/main`: Página Principal (protegida)
- **Componentes:** Componentes de UI reutilizáveis em `src/components/ui`, construídos com `shadcn/ui`.
- **Estilização:** Tailwind CSS.

### 1.2. Funcionalidades Implementadas
- **Autenticação:** Cadastro, login e logout de usuários com Firebase Authentication.
- **Rotas Protegidas:** A página `/main` é acessível apenas para usuários autenticados.

---

## Seção 2: Plano de Implementação da Funcionalidade (Atual)

**Objetivo:** Redesenhar a página principal (`/main`) para transformá-la em uma tela de hábitos moderna e funcional, baseada no design fornecido pelo usuário.

### 2.1. Análise do Design
A nova interface será composta pelos seguintes elementos:
- **Cabeçalho:** Saudação ao usuário, um ícone de calendário, um sino de notificação e um avatar.
- **Abas de Navegação:** Abas para "Hoje" e "Clubes".
- **Seletor de Data:** Uma lista horizontal para navegar pelos dias da semana.
- **Cartão de Progresso:** Um cartão que exibe o progresso das metas diárias (ex: "1 de 4 completadas").
- **Seção de Desafios:** Uma área para destacar desafios em andamento (ex: "Melhores Corredores").
- **Seção de Hábitos:** A lista principal de hábitos a serem rastreados. Cada hábito terá:
    - Ícone e nome (ex: "Beber água").
    - Indicador de progresso (ex: "500/2000 ML").
    - Avatares de amigos participando.
    - Um botão de ação para registrar o progresso.
- **Barra de Navegação Inferior:** Uma barra de navegação fixa com ícones para as seções principais do aplicativo e um botão de ação central proeminente.

### 2.2. Passos Detalhados da Implementação

1.  **Instalar Biblioteca de Ícones:**
    -   Instalar `lucide-react` para ter acesso a um conjunto de ícones modernos e consistentes.

2.  **Estruturar a Página Principal (`/main`):**
    -   Modificar `src/app/main/page.jsx` para criar o layout principal da nova tela, organizando as seções (Cabeçalho, Progresso, Hábitos, etc.).
    -   Utilizar componentes `shadcn/ui` (`Card`, `Button`, etc.) como base para os novos elementos.

3.  **Implementar o Cabeçalho:**
    -   Criar a saudação ao usuário e adicionar os ícones.

4.  **Implementar as Seções de Progresso e Hábitos:**
    -   Criar os cartões de progresso e desafios.
    -   Desenvolver a lista de hábitos, estilizando cada item para corresponder ao design.

5.  **Implementar a Barra de Navegação Inferior:**
    -   Criar um componente de layout que inclua a barra de navegação na parte inferior da tela, garantindo que ela seja fixa e responsiva.

6.  **Estilização e Polimento:**
    -   Aplicar o esquema de cores (predominantemente azul e branco), a tipografia e o espaçamento do design de referência usando Tailwind CSS.
    -   Garantir que o layout seja totalmente responsivo e se adapte bem a telas de dispositivos móveis.
