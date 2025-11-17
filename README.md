<p align= "center">
 <img width="150" height="200" alt="image" src="https://github.com/user-attachments/assets/39d8b81a-1d7f-4769-b255-e4e150c32edb" />
</p>
<p align="center">Um trabalho para o PROJETO INTEGRADOR e para DESENVOLVIMENTO DE APLICAÇÕES WEB - 4º Informática do IFSP-Jacareí</p>
<br>
<p align="center">
 <img loading="lazy" src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=yellow&style=for-the-badge"/>
</p>
<h1>👓 Professores responsáveis</h1> 

-  Ana Paula Abrantes de Castro Shiguemori
-  Flavia Beatriz Rodrigues Prisco da Cunha
-  Ariadne Arrais Cruz
-  Luis Eduardo Sales do Nascimento

<h1>🎯 Objetivo do projeto</h1> 
O objetivo do projeto é construir um jogo de navegador educativo, que visa ensinar e estimular crianças a apreder de forma lúdica e prática. O estimulo ocorre com mimi games educativos, exercitanto o raciocício lógico das crianças. Os personagens pertencem a fauna brasileira e o mascote é um bem-te-vi, dando origem ao nome do jogo (Bem-Aprendi), cada personagem ensina uma matéria distinta, deixando a experiência mais divertida. 

<h1>👥 Público-alvo</h2>
O público-alvo desse projeto são crianças da faixa etária a partir de 8 anos que saibam ler e escrever. 

<h1>:hammer: Requisitos Funionais para o site</h2>

- `Sistema de Login e cadastro de usuários`: Armazenamento dos dados do usuário no banco de dados. 

 - `Mini games`: Mini games educativos que ensinem as crianças conceitos báscios das matérias.

 - `Sistema de pontuação e Ranking`: Pontuação do usuário em cada disciplina e pontuação geral do usuário. A pontuação geral é usada como base para a criação de um ranking entre os usuários.
 
<h1>☑️ Requisitos não funcionais para o site</h1> 

<h2>Requisitos de Produto:</h2>

- `Segurança`: Garantir a segurança dos dados do usuário.

- `Facilidade de uso`: Garantir que o sistema seja de uso fácil e intuitivo, possibilitando que crianças utilizem do sistema sem grandes dificuldades. 

- `Desempenho`: Garantir que o site funcione sem travamentos.

- `Qualidade educacional`: Garantir que os minigames estejam conceitualmente corretos e que proporcionem um aprendizado de qualidade às crianças


<h2>Requisitos Organizacionais:</h2>

- `Sistema operacional compatível`: O sistema deve ser acessado por qualquer navegador dos seguintes sistemas: Windows, Linux, android, ios, MacOs.

- `Tecnologias utilizadas`: O sistema deve ser WEB, ou seja, precisa ser desenvolvido para ser acessados pelos navegadores.


<h2>Requisitos Externos:</h2>

- `Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018`: O sistema deve seguir as normas estabelecidas pela LGPD. 

- `Marco Civil da Internet (Lei nº 12.965/2014)`: O sistema deve seguir as normas estabelecidas pelo Marco Civil da Internet. 

- `Código de Defesa do Consumidor (CDC) – Lei nº 8.078/1990`: O sistema deve seguir as normas estabelecidas pelo Código de Defesa do Consumidor. 


<h1>📑 Matriz de Requisitos</h1>

<img src="https://github.com/user-attachments/assets/23abb3b5-61d5-4dbf-98e6-15736e09be24" width=1000> 
<br>

- `Observação`: C.T significa Criação de Tela

<h1>📱Mockup do APP </h1>

`Esboço da Interface`: <img src="https://github.com/user-attachments/assets/fd435986-9a24-4f1a-8ec6-91acd348258c" width=1000> 
`Mockup do site`: https://www.canva.com/design/DAGhcNGDoB4/RJ91RutQgmSEIraWqMDJyQ/edit

<h1>🧍Diagramas UML</h1>

<h2>Diagrama de Caso de Uso</h2>
<img src="https://github.com/user-attachments/assets/c430381e-3e8c-4358-a4c6-9ab4fd46ad97" width=1000> 

<h2>Diagrama de Classes</h2>
<img  src="https://github.com/user-attachments/assets/c504a5b1-0774-4e99-9228-44085e8ff641" width=1000> 

<h2>Modelo Entidade Relacionamento (MER)</h2>
<img src="https://github.com/user-attachments/assets/24711657-9790-4f96-a321-2ff175fc68a4" width=1000> 

<h1>📖 Dicionário de Dados</h1>

Esse projeto contará com as seguintes Entidades e atributos

<h2>Users</h2>
 Essa entidade é necessária para cadastrar os dados dos usuários, utilizando o serviço de autenticação do supabase. Os dados são os atributos:
 <br><br>
 
- `uuid`: É um atributo do tipo uuid. É o responsável por criar um **Id único** para o usuário(**CHAVE PRIMÁRIA**).
- `email`: É um atributo do tipo TEXT. É o responsável por armazenar o email do usuário.

<h2>Entidade Usuario_infos</h2>
 Essa entidade é necessária para cadastrar os dados adicionais dos usuários. Os dados são os atributos:
 <br><br>
 
- `id`: É um atributo do tipo INT8. É o responsável por criar um **Id único** para o usuário(**CHAVE PRIMÁRIA**).
- `tipo`: É um atributo do tipo TEXT. É o responsável por armazenar o tipo do usuário: responsável ou criança.
- `nome`: É um atributo do tipo TEXT. É o responsável por armazenar o nome do usuário.
- `idade`: É um atributo do tipo INT8. É o responsável por armazenar a idade do usuário.
- `id_auth`: É um atributo do tipo UUID. É o responsável por referênciar esse usuário a entidade Users(**CHAVE ESTRANGEIRA**).

<h2>Entidade Crianca</h2>
 Essa entidade é necessária para cadastrar os dados das crianças. Os dados são os atributos:
 <br><br>
 
- `id`: É um atributo do tipo INT8. É o responsável por criar um **Id único** para o usuário(**CHAVE PRIMÁRIA**).
- `nome`: É um atributo do tipo TEXT. É o responsável por armazenar o nome do usuário.
- `idade`: É um atributo do tipo INT8. É o responsável por armazenar a idade do usuário.
- `id_responsavel`: É um atributo do tipo UUID. É o responsável por referênciar essa criança a algum responsável da entidade Users(**CHAVE ESTRANGEIRA**).

<h2>Entidade pontuaçoes-materias</h2>
 Essa entidade é necessária para relacionar a última pontuação feita com a criança. Os dados são os atributos:
 <br><br>
 
- `id`: É um atributo do tipo INT8. É o responsável por criar um **Id único** para a pontuação(**CHAVE PRIMÁRIA**).
- `materia`: É um atributo do tipo TEXT. É o responsável por armazenar o nome da matéria referente a pontuação.
- `pontuacao`: É um atributo do tipo INT8. É o responsável por armazenar a pontuação obtida pela crianca.
- `updated_at`: É um atributo do tipo timestamptz. É o responsável por armazenar a data e hora da atualização da pontuação.
- `id_crianca`: É um atributo do tipo UUID. É o responsável por referênciar essa pontuação a açguma criança da entidade Crianca(**CHAVE ESTRANGEIRA**).

  <h2>Entidadehistorico-tentativas</h2>
 Essa entidade é necessária para armazenar as tentativas feitas pela criança. Os dados são os atributos:
 <br><br>
 
- `id`: É um atributo do tipo INT8. É o responsável por criar um **Id único** para a pontuação(**CHAVE PRIMÁRIA**).
- `materia`: É um atributo do tipo TEXT. É o responsável por armazenar o nome da matéria referente a pontuação.
- `pontuacao`: É um atributo do tipo INT8. É o responsável por armazenar a pontuação obtida pela crianca.
- `created_at`: É um atributo do tipo timestamptz. É o responsável por armazenar a data e hora da criação da tentativa.
- `id_crianca`: É um atributo do tipo UUID. É o responsável por referênciar essa pontuação a açguma criança da entidade Crianca(**CHAVE ESTRANGEIRA**).
  
<h1>Como utilizar 🤔</h1>

### 1. Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:
* **[Node.js](https://nodejs.org/)**: (Recomendado v18 ou superior)
* **[npm](https://www.npmjs.com/)**: (geralmente instalado junto com o Node.js)
* **[Git](https://git-scm.com/)**: (para clonar o repositório)

---

### 2. Instalação

1.  **Clone o repositório** (substitua pela URL do seu repositório):
    ```bash
    git clone [https://github.com/seu-usuario/BEM-APRENDI.git](https://github.com/seu-usuario/BEM-APRENDI.git)
    ```

2.  **Entre na pasta** do projeto:
    ```bash
    cd BEM-APRENDI
    ```

3.  **Instale as dependências** do Node.js:
    ```bash
    npm install
    ```

---

### 3. Configuração do Ambiente (`.env`)

Este projeto precisa de um arquivo `.env` na raiz para armazenar chaves de API e outras variáveis de ambiente.

1.  Crie um arquivo chamado `.env` na pasta principal do projeto.

2.  Adicione as variáveis de ambiente necessárias. (Como seu projeto usa o Supabase, você precisará das chaves do seu painel):

    ```env
    # Exemplo para conexão com Supabase
    SUPABASE_URL=COLE_AQUI_A_URL_DO_SEU_PROJETO_SUPABASE
    SUPABASE_KEY=COLE_AQUI_A_SUA_CHAVE_ANON_SUPABASE
    ```
    > **Nota:** Você encontra essas chaves no painel do seu projeto no Supabase, em "Project Settings" > "API".

---

### 4. Executando o Servidor

Após instalar e configurar, você pode iniciar o servidor.

1.  Inicie o servidor local:
    ```bash
    node server/index.js
    ```
    *(Como alternativa, se você tiver um script "start" no seu `package.json`, você pode usar `npm start`)*

2.  O terminal deverá exibir a mensagem:
    ```
    Servidor rodando em http://localhost:3000
    ```

3.  Abra seu navegador e acesse o jogo:
    [http://localhost:3000](http://localhost:3000)

---

<h1>🧰 Tecnologias Utilizadas</h1> 

`Front-end`:
<br><br>
<img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
<img src="https://img.shields.io/badge/CreateJS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/Bootstrap-blueviolet?style=for-the-badge&logo=bootstrap&logoColor=white">


`Back-end`:
<br><br>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">


`Banco de Dados`:
<br><br>
<img src="https://img.shields.io/badge/supabase-%2300C4B7.svg?style=for-the-badge&logo=supabase&logoColor=white">

`Diagramas e Mockups`:
<br><br>
<img src="https://img.shields.io/badge/Canva-%2300C4CC.svg?style=for-the-badge&logo=canva&logoColor=white">
<img src="https://img.shields.io/badge/Microsoft_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white">

<h1>💻 Desenvolvedores</h1>

| [<img src="https://avatars.githubusercontent.com/u/111576177?v=4" width=115>](https://github.com/Gabriel-Baroni) <br> **Gabriel de Paula Baroni** | [<img src="https://avatars.githubusercontent.com/u/184117774?v=4" width=115>](https://github.com/vinimaxi) <br> **Vinícius Ferreira Guimarães Maximo** | [<img src="https://avatars.githubusercontent.com/u/184420136?v=4" width=115>](https://github.com/renan-alexandre-morais) <br> **Renan Alexandre Morais de Souza** | [<img src="https://avatars.githubusercontent.com/u/174640883?v=4" width=115>](https://github.com/Felipo-alt) <br> **Felipe Oliveira Batista Silva** |
| :---: | :---: | :---: |:---: |
