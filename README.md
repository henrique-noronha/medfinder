# Projeto de Sistemas 2025.1 - Universidade Federal do Tocantins
Bacharelado em Ciência da Computação,  

Professor: Edeilson Milhomem da Silva  

Grupo: [Henrique Noronha](https://github.com/henrique-noronha), [Vicente](https://github.com/Vicentolah17) e [João Victor Mota](https://github.com/JaumMota).

## Sumário

- [MedFinder](#medfinder)
  - [Descrição](#descrição)
- [MVP - MedFinder](#mvp---medfinder)
  - [Funcionalidades Essenciais](#funcionalidades-essenciais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Planejamento de Iterações](#planejamento-de-iterações)
  - [Iteração 1: Cadastro, login e edição de perfil](#iteração-1-cadastro-login-e-edição-de-perfil)
  - [Iteração 2: Cadastro e pesquisa de profissionais](#iteração-2-cadastro-e-pesquisa-de-profissionais)
  - [Iteração 3: Agendamento e Visual](#iteração-3-agendamento-e-visual)
  - [Iteração 4: Gestão de Disponibilidade, Resultados de Exames e Otimizações](#iteração-4-gestão-de-disponibilidade-resultados-de-exames-e-otimizações)
- [Como Executar o Projeto](#como-executar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Configuração](#configuração)
  - [Executando o Projeto](#executando-o-projeto)
- [Links Úteis](#links-úteis)

---

## MedFinder  
![Logo MedFinder](./medfinder/assets/images/logo2.png)
### Descrição

O **MedFinder** é uma plataforma digital inovadora que conecta pacientes a serviços de saúde de forma rápida e eficiente. O sistema permite que os usuários encontrem **clínicas médicas, laboratórios, fisioterapeutas, nutricionistas, dentistas e outros profissionais da área**, com base em especialidade, localização e convênio. Além disso, possibilita o **agendamento de consultas e exames** de maneira prática e online.

Para profissionais e estabelecimentos de saúde, o **MedFinder** oferece um espaço dedicado para a **divulgação de serviços**, aumentando a visibilidade e facilitando a captação de novos pacientes. Com um modelo de monetização baseado em **planos pagos e publicidade**, a plataforma busca se tornar uma solução sustentável e escalável dentro do mercado da saúde.

---

## MVP - MedFinder
O MVP (Minimum Viable Product) do MedFinder é uma versão funcional da plataforma focada nas principais funcionalidades essenciais para validar a proposta de valor e testar a aceitação do mercado.

### Funcionalidades Essenciais
- **Como Paciente (Usuário):**
  - Cadastro e Login de Pacientes
  - Busca de Profissionais/Serviços (com filtros: especialidade, localização, convênio, etc.)
  - Visualização de Perfis de Profissionais/Serviços
  - Agendamento Online Simplificado
  - Histórico de Consultas Agendadas
  - Visualização de Exames.
- **Como Profissional da Saúde/Estabelecimento:**
  - Cadastro e Login de Profissionais/Estabelecimentos
  - Gerenciamento de Perfil (informações, serviços oferecidos)
  - Visualização de Solicitações de Agendamento (Receber notificação)
  - Confirmação/Recusa de Agendamentos
  - Gerenciamento Básico de Agenda/Disponibilidade
- **Plataforma (Geral):**
  - Interface administrativa básica para gerenciamento de cadastros.

---

## Tecnologias Utilizadas

**React Native** com **Expo** e **TypeScript** para o frontend mobile, e **Firebase** (Authentication, Firestore, Storage) para o backend e serviços na nuvem.

---

## Planejamento de Iterações
### Iteração 1: Cadastro, login e edição de perfil  
Nesta primeira iteração, serão implementadas as funcionalidades essenciais para cadastro e login dos usuários.  

**Requisitos Funcionais**

| Nº | Requisito             | Tela              | Funcionalidade | Autor    | Revisor  |
|----|-------------------------|-------------------|----------------|----------|----------|
| 1  | Tela de Boas-vindas     | `` `index.tsx` ``       |                | Henrique | Vicente  |
| 2  | Cadastro de Usuário     | `` `register.tsx` ``    |                | João     | Henrique |
| 3  | Login de Usuário        | `` `login.tsx` ``       |                | João     | Vicente  |
| 4  | Tela Home               | `` `home.tsx` ``        |                | Vicente  | João     |
| 5  | Editar Perfil           | `` `edit.tsx` ``        |                | João     | Henrique |
| 6  | Telas de Autenticação   |                   |                | Henrique | Vicente  |

Objetivo: Como usuário quero poder me cadastrar na plataforma, fazer o login e editar meus dados.  



### Iteração 2: Cadastro e pesquisa de profissionais

Nesta segunda iteração, serão desenvolvidas funcionalidades voltadas ao cadastro e busca de profissionais da saúde na plataforma.  

**Requisitos Funcionais**

| Nº | Requisito                      | Tela                          | Funcionalidade         | Autor    | Revisor  |
|----|------------------------------------|-------------------------------|------------------------|----------|----------|
| 6  | Cadastro de Profissionais        | `` `register-professional.tsx` `` | Registro de perfil     | João     | Vicente  |
| 7  | Pesquisa de Profissionais        | `` `search.tsx` ``                 | Barra de busca         | Henrique | João     |
| 8  | Tela de Resultados de Exames     | `` `result.tsx` ``                 | Listagem de resultados | Vicente  | João     |
| 9  | Tela de Ajuda                    | `` `help.tsx` ``                   | Instruções de uso      | Vicente  | João     |
| 10 | Tela de Pendência                | `` `pending.tsx` ``                | Mensagem de pendência  | Henrique | Vicente  |

**Objetivo**:  
Como usuário quero poder visualizar os profissionais disponíveis na plataforma e buscar por especialidade, nome ou localização, além de contar com orientações de uso.

### Iteração 3: Agendamento e Visual

Nesta terceira iteração, o foco está na implementação do agendamento de consultas, melhorias visuais na interface, integração com convênios e login dos profissionais.

**Requisitos Funcionais**

| Nº | Requisito                                  | Tela                           | Funcionalidade                          | Autor     | Revisor   |
|----|----------------------------------------------|--------------------------------|-----------------------------------------|-----------|-----------|
| 11 | Agendamento de Usuário                       | `` `schedule.tsx` ``               | Escolha de data e tipo de agendamento   | Henrique  | João      |
| 12 | Tela de Agendamento de Profissional          | `` `appointmentConfirm.tsx` ``     | Confirmação de solicitação              | Vicente   | Henrique  |
| 13 | Refatorar Cadastro de Profissionais          | `` `register-professional.tsx` ``  | Adicionar senha e tipo de atendimentos  | João      | Vicente   |
| 14 | Tela de Pendentes                            | `` `pending.tsx` ``                 | Listagem de solicitações pendentes      | João      | Henrique  |
| 15 | Tela de Histórico                            | `` `history.tsx` ``                 | Consultas já realizadas                 | João      | Vicente   |
| 16 | Tela de Resultados                           | `` `results.tsx` ``                 | Listagem de exames/resultados           | Henrique  | João      |
| 17 | Fale Conosco na Tela de Ajuda                | `` `help.tsx` ``                    | Adicionar campo de contato              | Vicente   | João      |
| 18 | Visual geral (cores, polimento, logo)        | todas                          | Padronização e identidade visual        | Equipe    | Equipe    |

**Objetivo**:  
Como usuário, quero poder agendar atendimentos de forma simples e visualizar o histórico de consultas, enquanto conto com uma interface mais amigável e opções de contato para suporte.  
Como profissional, quero poder fazer meu login, visualizar, aceitar e cancelar consultas pendentes.

### Iteração 4: Gestão de Disponibilidade, Resultados de Exames e Otimizações

Nesta iteração, o foco será em aprimorar a gestão de horários pelos profissionais, implementar o fluxo completo de resultados de exames para usuários e profissionais, otimizar a busca por convênios e realizar ajustes gerais para melhorar a usabilidade e estabilidade da plataforma.

**Requisitos Funcionais**

| Nº | Requisito                                          | Tela (sugestão)                        | Funcionalidade                                                                       | Autor    | Revisor   |
|----|------------------------------------------------------|----------------------------------------|--------------------------------------------------------------------------------------|----------|-----------|
| 19 | Gerenciamento de Disponibilidade (Profissional)        | `` `professional-availability.tsx` ``      | Profissional define dias/horários; usuário visualiza e seleciona apenas disponíveis    | Henrique     | João  |
| 20 | Tela de Resultados de Exames (Usuário)               | `` `user-exam-results.tsx` ``            | Usuário visualiza seus resultados de exames                                          | Henrique | Vicente   |
| 21 | Tela de Resultados e Upload de Exames (Profissional) | `` `professional-exam-management.tsx` `` | Profissional visualiza e realiza upload de exames de pacientes                         | Vicente  | João      |
| 22 | Otimização de Pesquisa por Convênios                 | `` `search.tsx` ``, `` `filters.tsx` ``        | Ajustar e refinar a pesquisa para incluir/melhorar filtros de convênios                | João     | Vicente   |
| 23 | Melhorias e Correções Gerais                         | Todas                                  | Ajustes de usabilidade, performance e correção de bugs identificados                   | Henrique | João      |

**Objetivo**:
Como profissional, quero poder gerenciar meus dias e horários de atendimento de forma flexível.
Como usuário, quero poder visualizar apenas os horários disponíveis para agendamento e ter acesso aos meus resultados de exames diretamente na plataforma.
Como profissional, quero poder disponibilizar os resultados dos exames dos meus pacientes de forma digital e segura.
A plataforma deve oferecer uma busca por convênios mais precisa e eficiente, além de melhorias gerais na experiência de uso.  

---

## Como Executar o Projeto

Siga as instruções abaixo para configurar e executar o ambiente de desenvolvimento do MedFinder.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada, ex: 18.x ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js) ou [Yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) (aplicativo para Android/iOS para visualizar o app durante o desenvolvimento)
- Conta no [Firebase](https://firebase.google.com/) e um projeto Firebase configurado com Authentication, Firestore e Storage habilitados.  

### Opção 1:

### Configuração
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/henrique-noronha/medfinder](https://github.com/henrique-noronha/medfinder)
    cd medfinder
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  **Configure as variáveis de ambiente do Firebase:**
    - Crie um arquivo `firebaseConfig.ts` na raiz do projeto (ou no local onde você importa suas configurações do Firebase, por exemplo, dentro de uma pasta `./src/` ou `./config/`).
    - Adicione suas credenciais do Firebase a este arquivo. Exemplo (`firebaseConfig.ts`):
      ```typescript
      // Importe os módulos necessários do Firebase SDK
      import { initializeApp } from "firebase/app";
      import { getFirestore } from "firebase/firestore";
      import { getAuth } from "firebase/auth";
      import { getStorage } from "firebase/storage";

      const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_AUTH_DOMAIN",
        projectId: "SEU_PROJECT_ID",
        storageBucket: "SEU_STORAGE_BUCKET",
        messagingSenderId: "SEU_MESSAGING_SENDER_ID",
        appId: "SUA_APP_ID"
      };

      // Inicialize o Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const auth = getAuth(app);
      const storage = getStorage(app);

      export { db, auth, storage };
      ```
    - **Importante:** Certifique-se de que este arquivo (`firebaseConfig.ts`) esteja no seu arquivo `.gitignore` para evitar que suas chaves de API e outras credenciais sensíveis sejam enviadas para o repositório Git público.

### Executando o Projeto
1.  **Inicie o servidor de desenvolvimento Expo:**
    ```bash
    npx expo start
    ```
2.  Aguarde o Metro Bundler iniciar e um QR Code aparecer no terminal.
3.  Abra o aplicativo **Expo Go** no seu smartphone e escaneie o QR Code.
    - Alternativamente, você pode executar em emuladores Android/iOS (pressionando `a` ou `i` no terminal após o `expo start`).  
    
### 📲 Opção 2: Instalar o APK de Teste (Versão Completa)

Este método instala o aplicativo completo e autossuficiente no seu dispositivo Android, ideal para demonstrações e testes.

1.  **Baixe o Arquivo APK:**
    * Você pode baixar a versão de teste mais recente diretamente da nossa página de Releases no GitHub.
    * **[Clique aqui para baixar o APK (v1.0.0)](https://github.com/henrique-noronha/medfinder/releases/download/1.3.1/MedFinder.apk)**

2.  **Instale o Arquivo no Dispositivo:**
    * Transfira o arquivo `.apk` baixado para um celular ou emulador Android.
    * No dispositivo, encontre o arquivo (geralmente na pasta "Downloads").
    * Toque nele para iniciar a instalação.

3.  **Permita a Instalação:**
    * O Android mostrará um aviso de segurança. Toque em **"Configurações"** e ative a permissão para **"Instalar de fontes desconhecidas"**.
    * Volte e conclua a instalação clicando em **"Instalar"**.

4.  **Use o App:**
    * O ícone do MedFinder aparecerá na sua lista de apps. Esta versão funciona de forma independente, sem precisar do servidor (`expo start`).
---

## Links Úteis
- [Landing Page](https://henrique-noronha.github.io/medfinder/)
- [User Stories](UserStories.md)  
- [Canvas Model](https://www.canva.com/design/DAGieJYwx_A/xZMhdLHK27y2-sjlAGdxYA/edit?utm_content=DAGieJYwx_A&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)  
- [Prototipação](https://www.figma.com/design/ox6mAwSthgpXY2brCMVVpa/MedFinder?node-id=0-1&t=Epe7rgLvOBSERP3l-1)
- [Pitch MedFinder](/medfinder/assets/show/Pitch%20MedFinder.pptx)
- [Apresentação Técnica](/medfinder/assets/show/ApresentaçãoTecnicaMedFinder.pptx)
