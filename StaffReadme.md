# API de Gerenciamento de Staff (Equipe)

## Visão Geral
Esta documentação descreve todas as rotas disponíveis para gerenciamento de membros da equipe (Staff) no sistema de gerenciamento de biblioteca. A API foi desenvolvida com Node.js, Express, TypeScript e Prisma ORM.

## Pacotes Utilizados

### Dependências Principais
- **express** (v4.21.0) - Framework web para Node.js
- **@prisma/client** (v5.20.0) - ORM para interação com banco de dados
- **bcryptjs** (v2.4.3) - Biblioteca para criptografia de senhas
- **jsonwebtoken** (v9.0.2) - Geração e verificação de tokens JWT
- **typescript** (v5.6.2) - Superset JavaScript com tipagem estática

### DevDependencies
- **@types/express** - Tipos TypeScript para Express
- **@types/bcryptjs** - Tipos TypeScript para bcryptjs
- **@types/jsonwebtoken** - Tipos TypeScript para JWT
- **ts-node-dev** - Ferramenta de desenvolvimento para TypeScript

---

## Arquitetura da API

A API segue o padrão **MVC (Model-View-Controller)** com a seguinte estrutura:
- **Routes**: Define as rotas e métodos HTTP
- **Controllers**: Gerencia requisições e validações
- **Services**: Contém a lógica de negócio
- **Models**: Define a estrutura de dados (Request DTOs)
- **Middlewares**: Autenticação e outras validações intermediárias

---

## Middleware de Autenticação

### isAuthenticated
**Arquivo**: `src/middlewares/isAuthenticated.ts`

**Função**: Valida o token JWT e extrai informações do usuário autenticado.

**Lógica**:
1. Verifica a presença do header `Authorization`
2. Extrai o token do formato "Bearer {token}"
3. Valida o token usando JWT com a SECRET do ambiente
4. Decodifica as permissões do usuário (admin_flg, circ_flg, circ_mbr_flg, catalog_flg, reports_flg)
5. Adiciona `userid` e `userroles` ao objeto `req`
6. Retorna erro 401 se o token for inválido ou expirado
7. Retorna erro 422 se não houver token

**Pacotes utilizados**: jsonwebtoken, express

---

## Rotas da API

Base URL: `/staff`

---

## 1. POST /register

**Nome**: Registrar Membro da Equipe

**Endpoint**: `POST /staff/register`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas administradores (admin_flg = true)

**Função**: Cria um novo membro da equipe no sistema.

### Controller: RegisterStaffController
**Arquivo**: `src/controllers/Staff/RegisterStaffController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão de administrador
3. Valida campos obrigatórios:
   - first_name (nome)
   - last_name (sobrenome)
   - username (nome de usuário)
   - password (senha)
   - confirmPassword (confirmação de senha)
4. Adiciona o ID do usuário atual ao campo last_change_userid
5. Chama o serviço RegisterStaffService
6. Retorna status 201 com os dados do usuário criado

### Service: RegisterStaffService
**Arquivo**: `src/services/Staff/RegisterStaffService.ts`

#### Lógica do Service:
1. Verifica se já existe um usuário com o mesmo username
2. Valida se password e confirmPassword são iguais
3. Criptografa a senha usando bcrypt com salt rounds = 10
4. Cria o registro no banco de dados usando Prisma
5. Retorna apenas campos seguros (exclui a senha)

**Pacotes utilizados**: express, prisma/client, bcryptjs

#### Request Body:
```json
{
  "first_name": "string",
  "last_name": "string",
  "username": "string",
  "password": "string",
  "confirmPassword": "string",
  "admin_flg": "boolean (opcional)",
  "circ_flg": "boolean (opcional)",
  "circ_mbr_flg": "boolean (opcional)",
  "catalog_flg": "boolean (opcional)",
  "reports_flg": "boolean (opcional)"
}
```

#### Response (201):
```json
{
  "type": "success",
  "message": "Membro da equipe registrado com sucesso!",
  "registeredStaff": {
    "userid": "number",
    "first_name": "string",
    "last_name": "string",
    "username": "string",
    "admin_flg": "boolean",
    "circ_flg": "boolean",
    "circ_mbr_flg": "boolean",
    "catalog_flg": "boolean",
    "reports_flg": "boolean",
    "suspended_flg": "boolean"
  }
}
```

---

## 2. POST /login

**Nome**: Fazer Login de Membro da Equipe

**Endpoint**: `POST /staff/login`

**Autenticação**: Não requerida

**Função**: Autentica um membro da equipe e retorna um token JWT.

### Controller: LoginStaffController
**Arquivo**: `src/controllers/Staff/LoginStaffController.ts`

#### Lógica do Controller:
1. Valida campos obrigatórios:
   - username (nome de usuário)
   - password (senha)
2. Chama o serviço LoginStaffService
3. Retorna status 201 com token e dados do usuário

### Service: LoginStaffService
**Arquivo**: `src/services/Staff/LoginStaffService.ts`

#### Lógica do Service:
1. Busca o usuário pelo username no banco de dados
2. Verifica se o usuário existe
3. Verifica se a conta não está suspensa (suspended_flg = false)
4. Compara a senha fornecida com o hash armazenado usando bcrypt
5. Gera um token JWT contendo:
   - userid
   - admin_flg
   - circ_flg
   - circ_mbr_flg
   - catalog_flg
   - reports_flg
6. Retorna o token e dados do usuário (sem a senha)

**Pacotes utilizados**: express, prisma/client, bcryptjs, jsonwebtoken

#### Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

#### Response (201):
```json
{
  "type": "success",
  "message": "Usuário entrou com sucesso!",
  "staffLogged": {
    "userid": "number",
    "admin_flg": "boolean",
    "circ_flg": "boolean",
    "circ_mbr_flg": "boolean",
    "catalog_flg": "boolean",
    "reports_flg": "boolean",
    "first_name": "string",
    "last_name": "string",
    "token": "string (JWT)"
  }
}
```

---

## 3. GET /viewstaffs

**Nome**: Visualizar Todos os Membros da Equipe

**Endpoint**: `GET /staff/viewstaffs`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas administradores (admin_flg = true)

**Função**: Lista todos os membros da equipe cadastrados no sistema.

### Controller: ViewStaffsController
**Arquivo**: `src/controllers/Staff/ViewStaffsController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão de administrador
3. Chama o serviço ViewStaffsService
4. Retorna status 200 com a lista de todos os membros

### Service: ViewStaffsService
**Arquivo**: `src/services/Staff/ViewStaffsService.ts`

#### Lógica do Service:
1. Busca todos os registros de staff no banco de dados usando Prisma
2. Retorna a lista completa de membros da equipe

**Pacotes utilizados**: express, prisma/client

#### Response (200):
```json
{
  "type": "success",
  "message": "Membros da equipe encontrados com sucesso!",
  "staffs": [
    {
      "userid": "number",
      "first_name": "string",
      "last_name": "string",
      "username": "string",
      "admin_flg": "boolean",
      "circ_flg": "boolean",
      "circ_mbr_flg": "boolean",
      "catalog_flg": "boolean",
      "reports_flg": "boolean",
      "suspended_flg": "boolean",
      "...": "outros campos"
    }
  ]
}
```

---

## 4. GET /detail/:userid

**Nome**: Visualizar Detalhes de um Membro da Equipe

**Endpoint**: `GET /staff/detail/:userid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas administradores (admin_flg = true)

**Função**: Retorna os detalhes de um membro específico da equipe.

### Controller: DetailStaffController
**Arquivo**: `src/controllers/Staff/DetailStaffController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão de administrador
3. Extrai o userid dos parâmetros da URL
4. Chama o serviço DetailStaffService
5. Retorna status 200 com os dados do membro

### Service: DetailStaffService
**Arquivo**: `src/services/Staff/DetailStaffService.ts`

#### Lógica do Service:
1. Busca um membro específico pelo userid usando Prisma
2. Verifica se o membro existe
3. Retorna os dados do membro (sem a senha)

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **userid** (number) - ID do membro da equipe na URL

#### Response (200):
```json
{
  "type": "success",
  "message": "Membro da equipe encontrado com sucesso!",
  "staff": {
    "userid": "number",
    "first_name": "string",
    "last_name": "string",
    "username": "string",
    "admin_flg": "boolean",
    "circ_flg": "boolean",
    "circ_mbr_flg": "boolean",
    "catalog_flg": "boolean",
    "reports_flg": "boolean",
    "suspended_flg": "boolean",
    "...": "outros campos"
  }
}
```

---

## 5. PATCH /edit/:userid

**Nome**: Editar Dados de um Membro da Equipe

**Endpoint**: `PATCH /staff/edit/:userid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas administradores (admin_flg = true)

**Função**: Atualiza informações de um membro da equipe (exceto senha).

### Controller: EditStaffController
**Arquivo**: `src/controllers/Staff/EditStaffController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão de administrador
3. Extrai o userid dos parâmetros da URL
4. Valida que não estão sendo enviados campos de senha (password ou confirmPassword)
5. Adiciona o ID do usuário atual ao campo last_change_userid
6. Chama o serviço EditStaffService
7. Retorna status 201 com os dados atualizados

### Service: EditStaffService
**Arquivo**: `src/services/Staff/EditStaffService.ts`

#### Lógica do Service:
1. Verifica se o membro a ser editado existe
2. Se o username foi alterado, verifica se já não existe outro usuário com esse username
3. Atualiza os dados no banco usando Prisma
4. Retorna os dados atualizados (sem a senha)

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **userid** (number) - ID do membro da equipe na URL

#### Request Body:
```json
{
  "first_name": "string (opcional)",
  "last_name": "string (opcional)",
  "username": "string (opcional)",
  "admin_flg": "boolean (opcional)",
  "circ_flg": "boolean (opcional)",
  "circ_mbr_flg": "boolean (opcional)",
  "catalog_flg": "boolean (opcional)",
  "reports_flg": "boolean (opcional)",
  "suspended_flg": "boolean (opcional)"
}
```

#### Response (201):
```json
{
  "type": "success",
  "message": "Membro da equipe atualizado com sucesso!",
  "editedStaff": {
    "userid": "number",
    "first_name": "string",
    "last_name": "string",
    "username": "string",
    "...": "campos atualizados"
  }
}
```

---

## 6. PATCH /changepassword/:userid

**Nome**: Alterar Senha de um Membro da Equipe

**Endpoint**: `PATCH /staff/changepassword/:userid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas administradores (admin_flg = true)

**Função**: Atualiza a senha de um membro da equipe.

### Controller: ChangeStaffPasswordController
**Arquivo**: `src/controllers/Staff/ChangeStaffPasswordController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão de administrador
3. Extrai o userid dos parâmetros da URL
4. Valida campos obrigatórios:
   - password (nova senha)
   - confirmPassword (confirmação da nova senha)
5. Adiciona o ID do usuário atual ao campo last_change_userid
6. Chama o serviço ChangeStaffPasswordService
7. Retorna status 201 confirmando a alteração

### Service: ChangeStaffPasswordService
**Arquivo**: `src/services/Staff/ChangeStaffPasswordService.ts`

#### Lógica do Service:
1. Verifica se o membro existe
2. Valida se password e confirmPassword são iguais
3. Criptografa a nova senha usando bcrypt com salt rounds = 10
4. Atualiza a senha no banco de dados usando Prisma
5. Retorna confirmação de sucesso

**Pacotes utilizados**: express, prisma/client, bcryptjs

#### Request Parameters:
- **userid** (number) - ID do membro da equipe na URL

#### Request Body:
```json
{
  "password": "string",
  "confirmPassword": "string"
}
```

#### Response (201):
```json
{
  "type": "success",
  "message": "Senha alterada com sucesso!!"
}
```

---

## 7. DELETE /delete/:userid

**Nome**: Deletar Membro da Equipe

**Endpoint**: `DELETE /staff/delete/:userid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas administradores (admin_flg = true)

**Função**: Remove permanentemente um membro da equipe do sistema.

### Controller: DeleteStaffController
**Arquivo**: `src/controllers/Staff/DeleteStaffController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão de administrador
3. Extrai o userid dos parâmetros da URL
4. Chama o serviço DeleteStaffService
5. Retorna status 201 confirmando a exclusão

### Service: DeleteStaffService
**Arquivo**: `src/services/Staff/DeleteStaffService.ts`

#### Lógica do Service:
1. Verifica se o membro existe
2. Deleta o registro do banco de dados usando Prisma
3. Retorna confirmação de sucesso

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **userid** (number) - ID do membro da equipe na URL

#### Response (201):
```json
{
  "type": "success",
  "message": "Usuário deletado com sucesso!"
}
```

---

## Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida (GET)
- **201 Created**: Recurso criado/atualizado com sucesso (POST, PATCH, DELETE)
- **401 Unauthorized**: Token inválido ou expirado
- **422 Unprocessable Entity**: Erro de validação ou lógica de negócio

---

## Mensagens de Erro Comuns

### Autenticação
- `"Usuário não autenticado!"` - Token não fornecido
- `"Token inválido ou expirado, faça login novamente."` - Token JWT inválido
- `"Usuário não tem permissão!"` - Usuário não possui flag de administrador

### Validação de Campos
- `"Informe o nome!"` - Campo first_name obrigatório
- `"Informe o sobrenome!"` - Campo last_name obrigatório
- `"Informe o nome de usuário!"` - Campo username obrigatório
- `"Informe a senha!"` - Campo password obrigatório
- `"Repita a senha!"` - Campo confirmPassword obrigatório
- `"Informe a nova senha!"` - Campo password obrigatório na alteração de senha
- `"Repita a nova senha!"` - Campo confirmPassword obrigatório na alteração de senha

### Lógica de Negócio
- `"Já existe um usuário com esse login!"` - Username duplicado
- `"As senhas não estão iguais!"` - Senha e confirmação diferentes
- `"Usuário e/ou senha incorretos!"` - Credenciais inválidas no login
- `"Essa conta está suspensa, entre em contato com o suporte para liberar-la novamente!"` - Conta suspensa
- `"Não é possível alterar a senha nesse formulário!"` - Tentativa de alterar senha via rota de edição

---

## Segurança

### Criptografia de Senhas
- Utiliza **bcryptjs** com 10 salt rounds
- Senhas nunca são retornadas nas respostas da API
- Comparação segura de hashes durante o login

### Autenticação JWT
- Tokens contêm informações do usuário e permissões
- Validados em cada requisição protegida
- Secret armazenado em variável de ambiente (process.env.SECRET)

### Controle de Acesso
- Rotas protegidas por middleware de autenticação
- Verificação de permissões de administrador onde necessário
- Validação de suspensão de conta no login

---

## Estrutura de Permissões (Flags)

- **admin_flg**: Permissões administrativas completas
- **circ_flg**: Permissões de circulação
- **circ_mbr_flg**: Permissões de membros de circulação
- **catalog_flg**: Permissões de catalogação
- **reports_flg**: Permissões de relatórios
- **suspended_flg**: Indica se a conta está suspensa

---

## Helpers Utilizados

### Crypto Helper
**Arquivo**: `src/helpers/crypto.ts`
- `encrypt(saltRounds, password)`: Criptografa senha com bcrypt
- `compare(password, hash)`: Compara senha com hash

### Token Helper
**Arquivo**: `src/helpers/token.ts`
- `create(payload)`: Gera token JWT com as informações do usuário

---

## Observações Importantes

1. **Separação de Responsabilidades**: Alteração de senha possui rota dedicada separada da edição de dados
2. **Auditoria**: Campo `last_change_userid` rastreia quem fez a última alteração
3. **Validação em Camadas**: Validações tanto no Controller quanto no Service
4. **TypeScript**: Uso de interfaces e tipos para maior segurança de código
5. **Prisma ORM**: Queries type-safe e migrations gerenciadas

---

## Exemplo de Uso (Header de Autenticação)

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

**Desenvolvido por**: Caahmos  
**Versão**: 1.0.0  
**Tecnologias**: Node.js, Express, TypeScript, Prisma, JWT, Bcrypt
