# Blueprint do Projeto: App de Hábitos

## Visão Geral

Este documento descreve a arquitetura, funcionalidades e plano de desenvolvimento para o aplicativo de criação de hábitos. O objetivo é criar uma aplicação web que permita aos usuários criar, acompanhar e gerenciar seus hábitos diários.

## Funcionalidades Implementadas

*   **Configuração do Firebase:**
    *   Projeto Firebase `habits-47cc3` conectado.
    *   Cloud Firestore inicializado para armazenamento de dados.
    *   Firebase Authentication configurado para gerenciamento de usuários.
    *   Arquivo de configuração `firebase.js` criado com as credenciais do projeto.
*   **Dependências:**
    *   `firebase`: SDK do Firebase para interagir com os serviços de backend.

## Plano de Desenvolvimento Atual: Implementar Autenticação de Usuário

O próximo passo é construir a interface e a lógica para que os usuários possam se registrar, fazer login e sair do aplicativo.

### Passos:

1.  **Instalar `react-router-dom`:** Para gerenciar a navegação entre as diferentes páginas (login, cadastro, página principal).
2.  **Estruturar as Páginas:**
    *   Criar um diretório `src/pages` para organizar os componentes de página.
    *   Criar a página de Login (`LoginPage.jsx`).
    *   Criar a página de Cadastro (`SignUpPage.jsx`).
    *   Criar a página principal do app (`HomePage.jsx`) que será acessível após o login.
3.  **Configurar as Rotas:**
    *   Atualizar o `App.jsx` para definir as rotas para as páginas de login, cadastro e a página principal.
    *   Envolver o componente principal com o `BrowserRouter` no `main.jsx`.
4.  **Criar Componentes de UI:**
    *   Criar um diretório `src/components` para componentes reutilizáveis.
    *   Desenvolver um componente de navegação (`NavBar.jsx`) que exibe o status de login e os links de navegação.
5.  **Implementar Lógica de Autenticação:**
    *   Utilizar as funções do `firebase/auth` (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged`) para gerenciar o estado do usuário.
    *   Criar um hook customizado (`useAuth`) para fornecer o estado do usuário (logado/não logado) para os componentes da aplicação.
6.  **Proteger Rotas:**
    *   Criar um componente de rota protegida que redireciona usuários não autenticados para a página de login, garantindo que o conteúdo principal do aplicativo seja privado.
7.  **Atualizar Regras de Segurança:**
    *   Modificar as regras de segurança do Firestore para garantir que cada usuário possa apenas ler e escrever seus próprios dados.

