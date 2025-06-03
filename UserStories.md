## User Stories e Protótipos de Tela


 ### Página de Boas-vindas MedFinder:


![Index](./images/index.png)  

 ### Cadastro e Login:  
 Como usuário quero me cadastrar e fazer login na plataforma para acessar os serviços de saúde disponíveis. Para realizar o login é necessário ter feito o cadastro e preencher o email e senha, caso contrário, clicar em "Não possui cadastro?"  


 ![Login](./images/login.png) ![Cadastro](./images/cadastro.png)  


 ### Tela Inicial do Usuário  

 Como usuário, após fazer o login, consigo visualizar o campo de pesquisa, além de cards como: histórico, pendências, resultados e ajuda.  


 ![Home](./images/home.png)
 


**Critérios de Aceitação**  

-  O usuário deve visualizar um campo de busca para pesquisar por especialidade médica.  
-  O campo de busca deve permitir a digitação de termos.  
-  O botão de pesquisa deve estar visível e acessível para iniciar a busca.  
-  O usuário deve ver quatro opções de navegação: **Histórico**, **Pendentes**, **Ajuda** e **Resultados**.  
-  Ao clicar em **Histórico**, o usuário é direcionado para uma tela com consultas passadas.  
-  Ao clicar em **Pendentes**, o usuário é direcionado para uma tela com consultas e exames ainda não realizados.  
-  Ao clicar em **Ajuda**, o usuário acessa informações sobre como usar o aplicativo.  
-  Ao clicar em **Resultados**, o usuário visualiza seus exames disponíveis na plataforma.  
-  O usuário deve ver seu nome ou um avatar no canto superior direito da tela.    

**Cenários de Uso**

 Cenário 1: Busca por um profissional
- O usuário digita "Cardiologista" no campo de busca.
- Clica no botão de pesquisa.
- O sistema exibe uma lista de profissionais disponíveis.

 Cenário 2: Visualização do histórico de consultas
- O usuário clica no botão "Histórico".
- O sistema exibe uma lista de consultas passadas.

 Cenário 3: Ver agendamentos pendentes
- O usuário clica no botão "Pendentes".
- O sistema exibe consultas e exames ainda não realizados.

 Cenário 4: Acesso a exames disponíveis
- O usuário clica no botão "Resultados".
- O sistema exibe os exames já disponibilizados pelos laboratórios.  

### Histórico, pendentes e resultados.  
Como usuário, quero verificar meu histórico, minhas pendencias e os resultados dos meus exames.  
Para isso haverá cards na tela inicial, que ao clicar redirecionará para as respectivas páginas.  

![Histórico](./images/historico.png) ![Pendentes](./images/pendentes.png) ![Resultados](./images/Exames.png)  

**Critérios de Aceitação**    
-  Permitir visualizar o **histórico** de consultas já concluídas, com botão "detalhes" para expansão.
-  Exibir uma lista de **agendamentos pendentes** com data e horário, além dos botões "detalhes" e "cancelar".    
-  Mostrar **resultados** das consultas passadas, com botão "detalhes" para expansão.  

### Pesquisa  
Como **usuário**, quero pesquisar profissionais e serviços da saúde podendo visualizar uma lista de resultados, podendo clicar em um profissional ou serviço para abrir uma nova página e realizar o agendamento.  

![Pesquisa](./images/pesquisa.png)    

**Critérios de Aceitação**  
-  Permitir que o usuário pesquise por profissionais com filtros disponíveis.  
-  Exibir uma lista de profissionais com nome, local de atendimento e foto se houver.  
-  Incluir um botão ou link em cada profissional para acessar a página de agendamento.  
-  Redirecionar o usuário para a página do profissional selecionado ao clicar.  

### Agendamentos  
Como usuário, quero que, ao clicar em um profissional, seja aberta uma aba contendo um calendário e um botão 'Ver Detalhes', para que eu possa selecionar uma data disponível e visualizar informações detalhadas do agendamento.  

![Agendamento](./images/agendamento.png)   

 **Critérios de Aceitação**
-  Ao clicar em um profissional na lista, o sistema deve abrir uma nova aba com um calendário.
-  O calendário deve exibir as datas disponíveis para agendamento.
-  Deve haver um botão "Ver Detalhes" para data e horário disponível.
-  Ao clicar em "Ver Detalhes", o sistema deve exibir informações adicionais (ex: horário da consulta, duração, observações, etc.).
-  A interface deve ser intuitiva e responsiva para facilitar a seleção da data e visualização dos detalhes.
