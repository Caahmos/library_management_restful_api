# API de Gerenciamento de Members (Membros/Usuários da Biblioteca)

## Visão Geral
Esta documentação descreve todas as rotas disponíveis para gerenciamento de membros (usuários da biblioteca) no sistema de gerenciamento de biblioteca. Os membros são os usuários finais que fazem empréstimos de livros. A API foi desenvolvida com Node.js, Express, TypeScript e Prisma ORM.

## Pacotes Utilizados

### Dependências Principais
- **express** (v4.21.0) - Framework web para Node.js
- **@prisma/client** (v5.20.0) - ORM para interação com banco de dados
- **multer** (v1.4.5-lts.1) - Upload de arquivos/imagens
- **date-fns** (v4.1.0) - Manipulação de datas
- **typescript** (v5.6.2) - Superset JavaScript com tipagem estática

### DevDependencies
- **@types/express** - Tipos TypeScript para Express
- **@types/multer** - Tipos TypeScript para Multer
- **ts-node-dev** - Ferramenta de desenvolvimento para TypeScript

---

## Arquitetura da API

A API segue o padrão **MVC (Model-View-Controller)** com a seguinte estrutura:
- **Routes**: Define as rotas e métodos HTTP
- **Controllers**: Gerencia requisições e validações
- **Services**: Contém a lógica de negócio
- **Models**: Define a estrutura de dados (Request DTOs)
- **Middlewares**: Autenticação e outras validações intermediárias
- **Helpers**: Upload de imagens e outras funções auxiliares

---

## Middleware e Helpers Utilizados

### isAuthenticated
**Arquivo**: `src/middlewares/isAuthenticated.ts`

**Função**: Valida o token JWT e extrai informações do usuário autenticado.

**Pacotes utilizados**: jsonwebtoken, express

### imageUpload Helper
**Arquivo**: `src/helpers/imageUpload.ts`

**Função**: Gerencia upload de imagens para membros, materiais e bibliografias.

**Configuração Multer**:

#### Storage (Armazenamento)
```typescript
destination: (req, file, cb) => {
  // Define pasta baseada na rota
  if (req.baseUrl.includes("member")) folder = "member";
  cb(null, `src/public/assets/imgs/${folder}`);
}

filename: (req, file, cb) => {
  // Gera nome único: número aleatório + timestamp + extensão
  cb(null, String(Math.random() * 1000) + Date.now() + path.extname(file.originalname));
}
```

#### FileFilter (Validação)
- Aceita apenas: `.png`, `.jpg`, `.jpeg`
- Retorna erro se formato inválido

**Lógica**:
1. Detecta rota base (member, material ou biblio)
2. Define pasta de destino correspondente
3. Gera nome único usando random + timestamp
4. Valida extensão do arquivo
5. Salva em `src/public/assets/imgs/member/`

**Pacotes utilizados**: multer, path (node:path)

---

## Rotas da API

Base URL: `/member`

---

## 1. POST /register

**Nome**: Registrar Novo Membro

**Endpoint**: `POST /member/register`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `circ_mbr_flg = true` (circulação de membros)

**Função**: Cria um novo membro no sistema com campos customizados opcionais.

### Controller: RegisterMemberController
**Arquivo**: `src/controllers/Member/Member/RegisterMemberController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `circ_mbr_flg`
3. Valida campos obrigatórios:
   - classification (classificação do membro)
   - barcode_nmbr (número do cartão)
   - first_name (primeiro nome)
   - last_name (sobrenome)
   - email
4. Adiciona o ID do usuário atual ao campo last_change_userid
5. Chama o serviço RegisterMemberService
6. Retorna status 201 com os dados do membro criado

### Service: RegisterMemberService
**Arquivo**: `src/services/Member/Member/RegisterMemberService.ts`

#### Lógica do Service:
1. **Valida barcode_nmbr único**: Verifica se já existe membro com mesmo código de cartão
2. **Valida email único**: Verifica se já existe membro com mesmo email
3. **Transaction do Prisma**: Usa transação para garantir atomicidade
4. **Cria membro**: Insere registro na tabela `member`
5. **Campos customizados** (opcional):
   - Se `code` e `data` forem fornecidos e tiverem mesmo tamanho
   - Valida se todos os códigos existem em `memberFieldDM`
   - Cria registros em `memberField` associando campos ao membro
6. Retorna membro criado

**Pacotes utilizados**: express, prisma/client

#### Request Body:
```json
{
  "classification": "number (ID da classificação)",
  "barcode_nmbr": "string (número do cartão)",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "address": "string (opcional)",
  "home_phone": "string (opcional)",
  "work_phone": "string (opcional)",
  "code": ["string", "string"] (opcional - array de códigos de campos customizados),
  "data": ["string", "string"] (opcional - array de valores dos campos customizados)
}
```

**Nota**: Arrays `code` e `data` devem ter o mesmo tamanho.

#### Response (201):
```json
{
  "type": "success",
  "message": "Membro registrado com sucesso!",
  "registeredMember": {
    "mbrid": "number",
    "first_name": "string",
    "last_name": "string",
    "barcode_nmbr": "string",
    "email": "string",
    "classification": "number",
    "isBlocked": "boolean",
    "blocked_until": "date | null",
    "...": "outros campos"
  }
}
```

---

## 2. GET /viewmembers

**Nome**: Visualizar Membros

**Endpoint**: `GET /member/viewmembers`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `circ_flg = true` (circulação)

**Função**: Lista membros com filtros e ordenação opcionais.

### Controller: ViewMembersController
**Arquivo**: `src/controllers/Member/Member/ViewMembersController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `circ_flg`
3. Extrai parâmetros de query:
   - `limit` - Quantidade máxima de resultados
   - `sort` - Ordenação (asc ou desc)
4. Chama o serviço ViewMembersService
5. Retorna status 201 com a lista de membros

### Service: ViewMembersService
**Arquivo**: `src/services/Member/Member/ViewMembersService.ts`

#### Lógica do Service:
1. Busca membros no banco de dados com Prisma
2. Aplica limite se fornecido
3. Aplica ordenação se fornecida
4. Retorna lista de membros

**Pacotes utilizados**: express, prisma/client

#### Query Parameters:
- **limit** (number, opcional) - Limita quantidade de resultados
- **sort** (string, opcional) - Ordenação: "asc" ou "desc"

#### Response (201):
```json
{
  "type": "success",
  "message": "Membros encontrados com sucesso!",
  "members": [
    {
      "mbrid": "number",
      "first_name": "string",
      "last_name": "string",
      "barcode_nmbr": "string",
      "email": "string",
      "isBlocked": "boolean",
      "...": "outros campos"
    }
  ]
}
```

---

## 3. GET /search

**Nome**: Buscar Membros

**Endpoint**: `GET /member/search`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `circ_flg = true` (circulação)

**Função**: Busca membros por nome, código de barras ou email com múltiplos filtros.

### Controller: SearchMemberController
**Arquivo**: `src/controllers/Member/Member/SearchMemberController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `circ_flg`
3. Extrai parâmetros de query:
   - `method` - Método de busca: "name", "barcode" ou "email"
   - `data` - Dado a ser buscado
   - `limit` - Quantidade máxima de resultados (padrão: 10)
   - `sort` - Ordenação: "asc" ou "desc" (padrão: "desc")
   - `isBlocked` - Filtrar por status de bloqueio
4. Define valores padrão se não fornecidos
5. Chama o serviço SearchMemberService
6. Retorna status 200 com os resultados

### Service: SearchMemberService
**Arquivo**: `src/services/Member/Member/SearchMemberService.ts`

#### Lógica do Service:

**Método "name"**:
- Busca membros com `first_name` que contenha o `data`
- Usa `contains` (busca parcial, case-insensitive)
- Retorna múltiplos resultados

**Método "barcode"**:
- Busca membro com `barcode_nmbr` exato
- Usa `findFirst` (busca exata)
- Retorna único resultado

**Método "email"**:
- Busca membros com `email` que contenha o `data`
- Usa `contains` (busca parcial)
- Retorna múltiplos resultados

**Filtro isBlocked**:
- Aplica filtro adicional se `isBlocked` for fornecido
- Permite buscar apenas membros bloqueados ou desbloqueados

**Lógica**:
1. Define filtro base com `isBlocked` se fornecido
2. Switch case baseado em `method`
3. Executa query correspondente no Prisma
4. Aplica `limit` e `sort` (ordenação por `createdAt`)
5. Lança erro se método inválido ou membro não encontrado
6. Retorna resultado(s)

**Pacotes utilizados**: express, prisma/client

#### Query Parameters:
- **method** (string, opcional) - "name", "barcode" ou "email" (padrão: "name")
- **data** (string) - Termo de busca
- **limit** (number, opcional) - Máximo de resultados (padrão: 10)
- **sort** (string, opcional) - "asc" ou "desc" (padrão: "desc")
- **isBlocked** (boolean, opcional) - Filtrar por bloqueio

**Exemplo**: `GET /member/search?method=name&data=João&limit=5&sort=asc`

#### Response (200):
```json
{
  "type": "success",
  "message": "Membro encontrado com sucesso!",
  "foundMember": [
    {
      "mbrid": "number",
      "first_name": "string",
      "last_name": "string",
      "barcode_nmbr": "string",
      "email": "string",
      "isBlocked": "boolean",
      "...": "outros campos"
    }
  ]
}
```

---

## 4. GET /detail/:mbrid

**Nome**: Detalhes Completos do Membro

**Endpoint**: `GET /member/detail/:mbrid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `circ_flg = true` (circulação)

**Função**: Retorna todos os detalhes de um membro específico.

### Controller: DetailMemberController
**Arquivo**: `src/controllers/Member/Member/DetailMemberController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `circ_flg`
3. Extrai `mbrid` dos parâmetros da URL
4. Chama o serviço DetailMemberService
5. Retorna status 200 com os dados completos do membro

### Service: DetailMemberService
**Arquivo**: `src/services/Member/Member/DetailMemberService.ts`

#### Lógica do Service:
1. Busca membro pelo `mbrid` usando Prisma
2. Inclui relacionamentos (campos customizados, etc)
3. Verifica se o membro existe
4. Retorna dados completos do membro

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **mbrid** (number) - ID do membro na URL

#### Response (200):
```json
{
  "type": "success",
  "message": "Membro encontrado com sucesso!",
  "member": {
    "mbrid": "number",
    "first_name": "string",
    "last_name": "string",
    "barcode_nmbr": "string",
    "email": "string",
    "address": "string",
    "home_phone": "string",
    "work_phone": "string",
    "classification": "number",
    "isBlocked": "boolean",
    "blocked_until": "date | null",
    "image_file": "string | null",
    "member_fields": [...],
    "...": "outros campos e relacionamentos"
  }
}
```

---

## 5. GET /basicdetail/:mbrid

**Nome**: Detalhes Básicos do Membro

**Endpoint**: `GET /member/basicdetail/:mbrid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas autenticação (sem verificação de flag específica)

**Função**: Retorna informações básicas de um membro específico.

### Controller: BasicDetailMemberController
**Arquivo**: `src/controllers/Member/Member/BasicDetailMemberControlle.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. **Não verifica permissões específicas** (qualquer usuário autenticado pode acessar)
3. Extrai `mbrid` dos parâmetros da URL
4. Chama o serviço BasicDetailMemberService
5. Retorna status 200 com dados básicos do membro

### Service: BasicDetailMemberService
**Arquivo**: `src/services/Member/Member/BasicDetailMemberService.ts`

#### Lógica do Service:
1. Busca membro pelo `mbrid` usando Prisma
2. Retorna apenas campos básicos (nome, email, etc)
3. Não inclui relacionamentos ou campos sensíveis

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **mbrid** (number) - ID do membro na URL

#### Response (200):
```json
{
  "type": "success",
  "message": "Membro encontrado com sucesso!",
  "member": {
    "mbrid": "number",
    "first_name": "string",
    "last_name": "string",
    "barcode_nmbr": "string",
    "email": "string"
  }
}
```

---

## 6. PATCH /edit/:mbrid

**Nome**: Editar Dados do Membro

**Endpoint**: `PATCH /member/edit/:mbrid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `circ_mbr_flg = true` (circulação de membros)

**Função**: Atualiza informações de um membro e seus campos customizados.

### Controller: EditMemberController
**Arquivo**: `src/controllers/Member/Member/EditMemberController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `circ_mbr_flg`
3. Extrai `mbrid` dos parâmetros da URL
4. Extrai dados do body e separa em dois objetos:
   - `editMemberData` - Dados básicos do membro
   - `memberFields` - Campos customizados (code e data)
5. Valida que arrays `code` e `data` tenham mesmo tamanho
6. Adiciona apenas campos fornecidos aos objetos
7. Define `last_change_userid` como ID do usuário atual
8. Chama o serviço EditMemberService
9. Retorna status 201 com dados atualizados

### Service: EditMemberService
**Arquivo**: `src/services/Member/Member/EditMemberService.ts`

#### Lógica do Service:
1. Verifica se o membro existe
2. Se foi alterado `barcode_nmbr`, verifica unicidade
3. Se foi alterado `email`, verifica unicidade
4. Atualiza dados básicos do membro
5. Se `memberFields` fornecido:
   - Deleta campos customizados antigos
   - Cria novos campos customizados
6. Retorna membro atualizado

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **mbrid** (number) - ID do membro na URL

#### Request Body:
```json
{
  "first_name": "string (opcional)",
  "last_name": "string (opcional)",
  "barcode_nmbr": "string (opcional)",
  "address": "string (opcional)",
  "home_phone": "string (opcional)",
  "work_phone": "string (opcional)",
  "email": "string (opcional)",
  "classification": "number (opcional)",
  "code": ["string"] (opcional),
  "data": ["string"] (opcional)
}
```

#### Response (201):
```json
{
  "type": "success",
  "message": "Membro atualizado com sucesso!",
  "editedMember": {
    "mbrid": "number",
    "first_name": "string",
    "last_name": "string",
    "...": "campos atualizados"
  }
}
```

---

## 7. PATCH /block/:mbrid

**Nome**: Bloquear/Desbloquear Membro

**Endpoint**: `PATCH /member/block/:mbrid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `circ_mbr_flg = true` (circulação de membros)

**Função**: Alterna status de bloqueio do membro ou força desbloqueio.

### Controller: BlockMemberController
**Arquivo**: `src/controllers/Member/Member/BlockMemberController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `circ_mbr_flg`
3. Extrai `mbrid` dos parâmetros da URL
4. Extrai parâmetro `force` da query (opcional)
5. Chama o serviço BlockMemberService
6. Retorna status 200 confirmando alteração

### Service: BlockMemberService
**Arquivo**: `src/services/Member/Member/BlockMemberService.ts`

#### Lógica do Service:

**Validações Iniciais**:
1. Verifica se o membro existe
2. Verifica se há empréstimos ativos (`status_cd = "out"`)
3. Se houver empréstimos, **bloqueia alteração** (deve devolver primeiro)

**Modo Force** (`force = "true"`):
- Força desbloqueio independente de `blocked_until`
- Define `isBlocked = false`
- Define `blocked_until = null`

**Modo Normal**:

**Se membro está bloqueado com data de bloqueio**:
1. Verifica se data atual é posterior a `blocked_until`
2. Se sim: desbloqueia automaticamente
3. Se não: lança erro informando data de desbloqueio

**Se membro não está bloqueado ou sem data**:
- Alterna status: `isBlocked = !isBlocked`

**Pacotes utilizados**: express, prisma/client, date-fns

#### Request Parameters:
- **mbrid** (number) - ID do membro na URL

#### Query Parameters:
- **force** (string, opcional) - "true" para forçar desbloqueio

**Exemplo**: `PATCH /member/block/123?force=true`

#### Response (200):
```json
{
  "type": "success",
  "message": "Alteração de bloqueio realizada com sucesso!",
  "member": {
    "mbrid": "number",
    "isBlocked": "boolean",
    "blocked_until": "date | null",
    "...": "outros campos"
  }
}
```

---

## 8. PATCH /updateimage/:mbrid

**Nome**: Atualizar Imagem do Membro

**Endpoint**: `PATCH /member/updateimage/:mbrid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `catalog_flg = true` (catalogação)

**Função**: Faz upload e atualiza a foto do membro.

### Controller: UpdateMemberImageController
**Arquivo**: `src/controllers/Member/Member/UpdateMemberImageController.ts`

#### Lógica do Controller:
1. Aplica middleware `upload.single('image_file')` antes do controller
2. Valida autenticação através do middleware isAuthenticated
3. Verifica se o usuário possui permissão `catalog_flg`
4. Extrai `mbrid` dos parâmetros da URL
5. Verifica se arquivo foi enviado (`req.file`)
6. Extrai nome do arquivo gerado pelo Multer
7. Valida que imagem foi enviada
8. Chama o serviço UpdateMemberImageService
9. Retorna status 201 confirmando upload

### Service: UpdateMemberImageService
**Arquivo**: `src/services/Member/Member/UpdateMemberImageService.ts`

#### Lógica do Service:
1. Verifica se o membro existe
2. Atualiza campo `image_file` com nome do arquivo
3. Retorna membro atualizado

**Nota**: O Multer já salvou a imagem em `src/public/assets/imgs/member/` antes do service ser chamado.

**Pacotes utilizados**: express, prisma/client, multer (via helper)

#### Request Parameters:
- **mbrid** (number) - ID do membro na URL

#### Request Body (multipart/form-data):
- **image_file** (file) - Arquivo de imagem (.png, .jpg, .jpeg)

#### Response (201):
```json
{
  "type": "success",
  "message": "Imagem do membro cadastrada com sucesso!",
  "addedImage": {
    "mbrid": "number",
    "image_file": "string (nome do arquivo salvo)",
    "...": "outros campos"
  }
}
```

---

## 9. DELETE /delete/:mbrid

**Nome**: Deletar Membro

**Endpoint**: `DELETE /member/delete/:mbrid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `circ_mbr_flg = true` (circulação de membros)

**Função**: Remove permanentemente um membro do sistema.

### Controller: DeleteMemberController
**Arquivo**: `src/controllers/Member/Member/DeleteMemberController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `circ_mbr_flg`
3. Extrai `mbrid` dos parâmetros da URL
4. Chama o serviço DeleteMemberService
5. Retorna status 201 confirmando exclusão

### Service: DeleteMemberService
**Arquivo**: `src/services/Member/Member/DeleteMemberService.ts`

#### Lógica do Service:
1. Verifica se o membro existe
2. Verifica se não há empréstimos ativos (proteção)
3. Deleta campos customizados relacionados (cascade)
4. Deleta o registro do membro
5. Retorna confirmação

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **mbrid** (number) - ID do membro na URL

#### Response (201):
```json
{
  "type": "success",
  "message": "Usuário deletado com sucesso!"
}
```

---

## Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida (GET, operações de leitura)
- **201 Created**: Recurso criado/atualizado com sucesso (POST, PATCH, DELETE)
- **422 Unprocessable Entity**: Erro de validação ou lógica de negócio

---

## Mensagens de Erro Comuns

### Autenticação e Permissões
- `"Usuário não autenticado!"` - Token não fornecido
- `"Usuário não tem permissão!"` - Usuário não possui flag necessária

### Validação de Campos (Register)
- `"Informe a classificação!"` - Campo classification obrigatório
- `"Informe o número do cartão!"` - Campo barcode_nmbr obrigatório
- `"Informe seu primeiro nome!"` - Campo first_name obrigatório
- `"Informe seu segundo nome!"` - Campo last_name obrigatório
- `"Informe o seu email!"` - Campo email obrigatório

### Lógica de Negócio
- `"Código do cartão já está registrado."` - barcode_nmbr duplicado
- `"Esse email já está registrado."` - Email duplicado
- `"Um ou mais códigos não estão cadastrados!"` - Código de campo customizado inválido
- `"Membro não encontrado!"` - mbrid não existe
- `"Método de busca inválido!"` - method deve ser "name", "barcode" ou "email"
- `"Realize a devolução do livro primeiro!"` - Não pode bloquear/deletar com empréstimo ativo
- `"Usuário ainda está bloqueado até {data}"` - Tentativa de desbloquear antes da data
- `"Nenhuma imagem enviada!"` - Upload sem arquivo
- `"Por favor, envie apenas jpg ou png"` - Formato de imagem inválido

---

## Campos Customizados (Member Fields)

### Conceito
Permite adicionar campos dinâmicos aos membros baseados em definições configuráveis.

### Estrutura
- **code** - Código do campo (definido em `MemberFieldDM`)
- **data** - Valor do campo para o membro específico

### Modelo de Dados
```
MemberFieldDM (Definição de campos)
  └─ code: string (ex: "CPF", "RG", "TELEFONE2")
  └─ description: string
  └─ ...

MemberField (Valores dos campos por membro)
  └─ mbrid: number (FK para Member)
  └─ code: string (FK para MemberFieldDM)
  └─ data: string (valor do campo)
```

### Fluxo de Uso

**No Registro**:
1. Frontend envia arrays `code` e `data`
2. Backend valida que todos os `code` existem em `MemberFieldDM`
3. Cria registros em `MemberField` associando ao novo membro

**Na Edição**:
1. Frontend envia novos arrays `code` e `data`
2. Backend deleta campos antigos do membro
3. Cria novos registros com valores atualizados

---

## Upload de Imagens

### Configuração
- **Pasta de destino**: `src/public/assets/imgs/member/`
- **Formatos aceitos**: .png, .jpg, .jpeg
- **Nome do arquivo**: Gerado automaticamente (random + timestamp + extensão)
- **Campo no formulário**: `image_file`
- **Tipo de requisição**: `multipart/form-data`

### Exemplo de Nome Gerado
```
573.123456789.jpg
(random).(timestamp).(extensão original)
```

### Acesso Público
Imagens ficam acessíveis via:
```
http://localhost:{PORT}/{nome_do_arquivo}.jpg
```

---

## Estrutura de Permissões (Flags)

Diferentes rotas requerem diferentes permissões:

| Flag | Descrição | Rotas que Requerem |
|------|-----------|-------------------|
| `circ_flg` | Circulação básica | viewmembers, search, detail |
| `circ_mbr_flg` | Circulação de membros | register, edit, block, delete |
| `catalog_flg` | Catalogação | updateimage |

**Rota sem flag específica**:
- `basicdetail` - Qualquer usuário autenticado

---

## Tabela Resumo das Rotas

| Método | Rota | Permissão | Função |
|--------|------|-----------|---------|
| POST | /register | circ_mbr_flg | Criar novo membro |
| GET | /viewmembers | circ_flg | Listar membros |
| GET | /search | circ_flg | Buscar membros (nome/barcode/email) |
| GET | /detail/:mbrid | circ_flg | Detalhes completos |
| GET | /basicdetail/:mbrid | Autenticado | Detalhes básicos |
| PATCH | /edit/:mbrid | circ_mbr_flg | Editar dados |
| PATCH | /block/:mbrid | circ_mbr_flg | Bloquear/desbloquear |
| PATCH | /updateimage/:mbrid | catalog_flg | Upload de foto |
| DELETE | /delete/:mbrid | circ_mbr_flg | Deletar membro |

---

## Relacionamentos do Modelo Member

```
Member
  ├─ classification (FK para MemberClassifyDM)
  ├─ member_fields (1:N para MemberField)
  ├─ biblio_copies (1:N para BiblioCopy - empréstimos)
  ├─ biblio_status_hist (1:N para BiblioStatusHist - histórico)
  └─ last_change_userid (FK para Staff)
```

---

## Bloqueio de Membros

### Tipos de Bloqueio

**1. Bloqueio Manual**:
- Administrador usa rota `/block/:mbrid`
- Define `isBlocked = true`
- Sem data de desbloqueio automático

**2. Bloqueio Automático** (via cron job):
- Sistema detecta empréstimos atrasados
- Calcula período de graça (grace_period_days)
- Bloqueia automaticamente se ultrapassar prazo
- Define `blocked_until` com data de liberação

**3. Bloqueio com Data Limite**:
- `isBlocked = true`
- `blocked_until` definido
- Desbloqueia automaticamente quando data atual > blocked_until

### Regras de Desbloqueio

**Automático**:
- Quando `blocked_until` é atingido
- Apenas tentando fazer checkout ou ao chamar `/block/:mbrid`

**Manual**:
- Administrador usa `/block/:mbrid` (alterna status)
- Administrador usa `/block/:mbrid?force=true` (força desbloqueio imediato)

**Restrições**:
- Não pode bloquear/desbloquear se houver empréstimos ativos
- Deve devolver livros primeiro

---

## Segurança

### Validação de Unicidade
- `barcode_nmbr` único no sistema
- `email` único no sistema

### Validação de Empréstimos
- Impede bloqueio se há livros emprestados
- Impede exclusão se há livros emprestados

### Upload Seguro
- Validação de extensão de arquivo
- Nome de arquivo gerado (evita override)
- Armazenamento em pasta específica

### Auditoria
- Campo `last_change_userid` rastreia alterações
- Registra quem criou/editou cada membro

---

## Observações Importantes

1. **Campos Customizados**: Sistema flexível permite adicionar campos dinâmicos sem alterar schema
2. **Transações**: Registro usa transação Prisma para garantir atomicidade
3. **Busca Flexível**: Três métodos de busca (nome, barcode, email) com filtros
4. **Bloqueio Inteligente**: Sistema respeita período de graça e data de desbloqueio
5. **Upload Isolado**: Imagens de membros separadas de outros tipos
6. **Permissões Granulares**: Diferentes níveis de acesso por funcionalidade
7. **Detalhes Duplos**: Rota básica para acesso público, completa para administração

---

**Desenvolvido por**: Caahmos  
**Versão**: 1.0.0  
**Tecnologias**: Node.js, Express, TypeScript, Prisma, Multer, Date-fns
