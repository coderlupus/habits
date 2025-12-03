# Blueprint do Projeto: Rastreador de Hábitos

## Visão Geral

Este documento descreve a arquitetura, funcionalidades e plano de desenvolvimento para o aplicativo Rastreador de Hábitos. O objetivo é criar uma aplicação web moderna, reativa e escalável para ajudar os usuários a construir e manter bons hábitos.

---

## Seção 1: Arquitetura e Design (Versão Atual)

A versão atual do aplicativo estabeleceu a base da interface do usuário (UI) e corrigiu uma inconsistência estrutural crítica (mistura dos frameworks Vite e Next.js). O projeto agora está unificado sob o Next.js com o App Router.

### 1.1. Estrutura do Projeto (Pós-Limpeza)
- **Framework:** Next.js com App Router (`src/app`).
- **Ponto de Entrada:** `src/app/page.jsx` (página de login).
- **Roteamento:**
    - `/`: Página de Login
    - `/signup`: Página de Cadastro
    - `/main`: Página Principal (protegida)
- **Componentes:** Componentes de UI reutilizáveis localizados em `src/components/ui`, construídos com `shadcn/ui`.
- **Estilização:** Tailwind CSS com um arquivo `globals.css` central.

### 1.2. Design e Estilo
- **Biblioteca de Componentes:** `shadcn/ui` foi escolhido por sua flexibilidade, acessibilidade e integração com Tailwind CSS.
- **Tema:** Um tema limpo e moderno foi estabelecido em `globals.css`, com variáveis para modo claro e escuro.
- **Tipografia:** A fonte "Inter" é usada para garantir uma boa legibilidade.
- **Layout:** Os layouts são responsivos, utilizando Flexbox para centralizar conteúdo nas páginas de autenticação e um layout de painel para a página principal.

### 1.3. Funcionalidades Implementadas (Somente UI)
- **Página de Login:** Um formulário com campos para email e senha.
- **Página de Cadastro:** Um formulário similar para a criação de novas contas.
- **Página Principal:** Um layout de painel com um cabeçalho, título, botão de "Logout" e uma área de conteúdo preparada para exibir a lista de hábitos. A navegação entre as páginas é feita com o `useRouter` do Next.js.

---

## Seção 2: Plano de Implementação da Funcionalidade (Atual)

**Objetivo:** Conectar a interface de usuário de autenticação ao Firebase para permitir que os usuários criem contas e façam login de verdade.

### 2.1. Integração com Firebase
- **Ferramentas:** Firebase SDK para a Web.
- **Serviços a Utilizar:**
    1.  **Firebase Authentication:** Para gerenciar o login e cadastro de usuários de forma segura.
    2.  **Cloud Firestore:** Como banco de dados NoSQL para armazenar informações dos usuários e seus respectivos hábitos (será configurado após a autenticação funcionar).

### 2.2. Passos Detalhados da Implementação

1.  **Configurar o Firebase no Projeto:**
    -   Verificar o login do usuário no Firebase.
    -   Verificar se há um projeto Firebase ativo ou criar um novo.
    -   Inicializar os serviços do Firebase (`Authentication`, `Firestore`) no projeto usando as ferramentas disponíveis, o que irá configurar `firebase.json` e as regras de segurança.

2.  **Implementar a Lógica de Cadastro (`/signup`):**
    -   Capturar os dados (email e senha) do formulário de cadastro.
    -   Utilizar a função `createUserWithEmailAndPassword` do SDK do Firebase para criar um novo usuário.
    -   Após o cadastro bem-sucedido, redirecionar o usuário para a página principal (`/main`).
    -   Exibir mensagens de erro caso o email já esteja em uso ou a senha seja inválida.

3.  **Implementar a Lógica de Login (`/`):**
    -   Capturar os dados (email e senha) do formulário de login.
    -   Utilizar a função `signInWithEmailAndPassword` do SDK do Firebase para autenticar o usuário.
    -   Após o login bem-sucedido, redirecionar o usuário para a página principal (`/main`).
    -   Exibir mensagens de erro para credenciais incorretas.

4.  **Implementar a Lógica de Logout:**
    -   No botão "Logout" na página principal (`/main`), chamar a função `signOut` do Firebase.
    -   Redirecionar o usuário de volta para a página de login (`/`).

5.  **Proteger a Rota Principal (`/main`):**
    -   Criar um mecanismo (`ProtectedRoute.jsx` ou um hook `useAuth`) que verifique o estado de autenticação do usuário.
    -   Se o usuário não estiver logado, ele será automaticamente redirecionado da página `/main` para a página de login.
