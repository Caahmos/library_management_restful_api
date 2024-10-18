# Projeto API de Livraria - Node.js

[<img src="./src/public/assets/gif/der.gif" alt="">]()

Este projeto é uma aplicação de API de livraria que oferece funcionalidades de gerenciamento de livros, autores e usuários. A aplicação utiliza o padrão MVC (Model-View-Controller) para organizar o código e realiza operações básicas de CRUD (Create, Read, Update, Delete). O Prisma é utilizado como ORM e TypeScript como linguagem de programação. Este é um projeto pessoal meu, que visa facilitar a gestão de bibliotecas.

## Descrição do Projeto

A API de livraria permite que os usuários gerenciem livros, autores e informações de empréstimos. Cada livro possui as seguintes informações:

- Título
- Autor
- Gênero
- Disponibilidade
- MARC

Para acessar funcionalidades restritas, como a adição, visualização, atualização e exclusão de livros, o usuário precisa estar autenticado. A autenticação é realizada usando JWT (JSON Web Token).

## Tecnologias Utilizadas

- **Node.js:** Plataforma de desenvolvimento server-side baseada no motor V8 do Google Chrome.
- **Express:** Framework web para Node.js, utilizado para simplificar o desenvolvimento de aplicações web.
- **Prisma:** ORM utilizado para interagir com o banco de dados MySQL de forma eficiente e segura.
- **TypeScript:** Linguagem que adiciona tipagem estática ao JavaScript, aumentando a robustez do código.
- **MySQL:** Banco de dados relacional utilizado para armazenar os dados dos livros, autores e informações de usuários.
- **JWT (JSON Web Token):** Biblioteca utilizada para autenticação e controle de acesso.

## Estrutura do Projeto

A estrutura do projeto segue o padrão MVC, dividindo as responsabilidades em:

- **Model (models):** Responsável pela definição dos objetos e interações com o banco de dados MySQL.
- **Controller (controllers):** Gerencia as requisições do usuário, interagindo com os modelos e respondendo com os dados adequados.
- **Service (services):** Contém a lógica de negócio, isolando as operações que não pertencem diretamente aos controladores.
- **Middleware de Autenticação:** Garante que apenas usuários autenticados tenham acesso a determinadas funcionalidades.

## Pré-requisitos

- Node.js instalado
- XAMPP instalado e MySQL em execução

## Como Executar o Projeto

1. Clone o repositório: `git clone https://github.com/Caahmos/library_management_restful_api.git`
2. Acesse o diretório do projeto: `cd library_management_restful_api`
3. Instale as dependências: `npm install`
4. Crie um arquivo `.env` na raiz do projeto e configure as variáveis necessárias, incluindo a URL do banco de dados (DATABASE_URL), a chave secreta de autenticação do JWT (SECRET) e a porta do servidor (PORT).
5. Inicie o servidor: `npm start`
6. Abra o navegador e acesse `http://localhost:5000` para interagir com a API.

### Exemplo de DATABASE_URL
- "mysql://root@localhost:3306/library_management"

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues, propor melhorias ou enviar pull requests.
