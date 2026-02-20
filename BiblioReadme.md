# API de Gerenciamento de Biblio (Bibliografias/Livros)

## Visão Geral
Esta documentação descreve todas as rotas disponíveis para gerenciamento de bibliografias (livros, materiais bibliográficos) no sistema de gerenciamento de biblioteca. As bibliografias são os itens do acervo que podem ser emprestados. A API foi desenvolvida com Node.js, Express, TypeScript e Prisma ORM, incluindo suporte a campos MARC para catalogação profissional.

## Pacotes Utilizados

### Dependências Principais
- **express** (v4.21.0) - Framework web para Node.js
- **@prisma/client** (v5.20.0) - ORM para interação com banco de dados
- **multer** (v1.4.5-lts.1) - Upload de arquivos/imagens
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

## Conceitos Importantes

### Formato MARC
**MARC (MAchine-Readable Cataloging)** é um padrão internacional para descrição bibliográfica. O sistema utiliza campos MARC para catalogação profissional.

**Estrutura de um Campo MARC**:
- **Tag** - Número de 3 dígitos que identifica o campo (ex: 245 = Título)
- **Subfield** - Código de letra que identifica subcampo (ex: a, b, c)
- **Exemplo**: 245a = Título principal, 245b = Subtítulo, 100a = Autor principal

**Tags Comuns**:
- `100a` - Autor principal
- `245a` - Título principal
- `245b` - Subtítulo/Complemento do título
- `245c` - Declaração de responsabilidade
- `090a` / `099a` - Número de chamada (call number)

### BiblioField (Campos MARC)
Armazena metadados bibliográficos no formato MARC:
- **fieldid** - ID sequencial do campo
- **bibid** - FK para Biblio
- **tag** - Tag MARC (ex: 245)
- **subfield_cd** - Código do subcampo (ex: 'a', 'b')
- **field_data** - Valor do campo

### BiblioMedia
Armazena URLs de mídias relacionadas (vídeos, áudios, etc):
- **bibid** - FK para Biblio
- **midiaUrl** - URL da mídia

---

## Middleware e Helpers Utilizados

### isAuthenticated
**Arquivo**: `src/middlewares/isAuthenticated.ts`

**Função**: Valida o token JWT e extrai informações do usuário autenticado.

**Pacotes utilizados**: jsonwebtoken, express

### imageUpload Helper
**Arquivo**: `src/helpers/imageUpload.ts`

**Função**: Gerencia upload de imagens para bibliografias.

**Configuração**: Salva em `src/public/assets/imgs/biblio/`

**Pacotes utilizados**: multer, path (node:path)

---

## Rotas da API

Base URL: `/biblio`

---

## 1. POST /register

**Nome**: Registrar Nova Bibliografia

**Endpoint**: `POST /biblio/register`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `catalog_flg = true` (catalogação)

**Função**: Cria uma nova bibliografia no sistema com campos MARC opcionais.

### Controller: RegisterBiblioController
**Arquivo**: `src/controllers/Biblio/Biblio/RegisterBiblioController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `catalog_flg`
3. Extrai dados do body
4. Adiciona o ID do usuário atual ao campo last_change_userid
5. Chama o serviço RegisterBiblioService
6. Retorna status 201 com os dados da bibliografia criada

### Service: RegisterBiblioService
**Arquivo**: `src/services/Biblio/Biblio/RegisterBiblioService.ts`

#### Lógica do Service:

**1. Extração Inteligente de Campos**:
```typescript
// Se campos principais não fornecidos, tenta extrair de valores MARC
if (!title) title = tryGetFromValues("245a") || "";
if (!author) author = tryGetFromValues("100a") || "";
if (!call_nmbr1) call_nmbr1 = tryGetFromValues("090a") || tryGetFromValues("099a") || "";
```

**2. Validações Obrigatórias**:
- `material_cd` - Tipo de material (livro, revista, CD, etc)
- `collection_cd` - Código da coleção
- `call_nmbr1` - Número de chamada (classificação)
- `title` - Título da obra
- `author` - Autor da obra

**3. Validação de Campos Obrigatórios MARC**:
- Se `requiredFlgs` fornecido, valida que todos os campos marcados como obrigatórios (valor "1") estão preenchidos
- Retorna lista de campos faltantes se houver

**4. Verificação de Duplicidade**:
- Verifica se já existe bibliografia com mesmo título
- Lança erro se título duplicado

**5. Transaction do Prisma**:
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Cria registro principal da bibliografia
  const biblio = await tx.biblio.create({...});
  
  // 2. Se há campos MARC, cria registros em biblioField
  if (indexes?.length && values && tags && subfields) {
    const marcFields = indexes.map((index) => ({
      fieldid: fieldIndex++,
      bibid: biblio.bibid,
      tag: Number(tags[index]),
      subfield_cd: subfields[index],
      field_data: values[index],
    }));
    await tx.biblioField.createMany({ data: marcFields });
  }
  
  // 3. Cria registro em biblioMedia (para URLs futuras)
  await tx.biblioMedia.create({ data: { bibid: biblio.bibid } });
  
  return biblio;
});
```

**Pacotes utilizados**: express, prisma/client

#### Request Body:
```json
{
  "title": "string",
  "author": "string",
  "call_nmbr1": "string",
  "material_cd": "number",
  "collection_cd": "number",
  "opac_flg": "boolean (opcional)",
  "call_nmbr2": "string (opcional)",
  "call_nmbr3": "string (opcional)",
  "title_remainder": "string (opcional)",
  "responsibility_stmt": "string (opcional)",
  "topic1": "string (opcional)",
  "topic2": "string (opcional)",
  "topic3": "string (opcional)",
  "topic4": "string (opcional)",
  "topic5": "string (opcional)",
  "values": {
    "245a": "Título",
    "100a": "Autor",
    "...": "outros campos MARC"
  },
  "indexes": ["245a", "100a", "..."],
  "tags": [245, 100, ...],
  "subfields": ["a", "a", ...],
  "fieldIds": [0, 1, ...],
  "requiredFlgs": {
    "245a": "1",
    "100a": "0"
  }
}
```

**Nota**: Arrays `indexes`, `values`, `tags`, `subfields` devem ter mesmo tamanho.

#### Response (201):
```json
{
  "type": "success",
  "message": "Bibliografia registrada com sucesso!",
  "registeredBibliography": {
    "bibid": "number",
    "title": "string",
    "author": "string",
    "call_nmbr1": "string",
    "material_cd": "number",
    "collection_cd": "number",
    "opac_flg": "boolean",
    "...": "outros campos"
  }
}
```

---

## 2. GET /viewbiblios

**Nome**: Visualizar Todas as Bibliografias

**Endpoint**: `GET /biblio/viewbiblios`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas autenticação (sem verificação de flag específica)

**Função**: Lista todas as bibliografias cadastradas no sistema.

### Controller: ViewBibliosController
**Arquivo**: `src/controllers/Biblio/Biblio/ViewBibliosController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. **Não verifica permissões específicas** (qualquer usuário autenticado pode acessar)
3. Chama o serviço ViewBibliosService
4. Retorna status 200 com a lista de bibliografias

### Service: ViewBibliosService
**Arquivo**: `src/services/Biblio/Biblio/ViewBibliosService.ts`

#### Lógica do Service:
1. Busca todas as bibliografias no banco de dados usando Prisma
2. Inclui relacionamentos (cópias, mídias, etc)
3. Retorna lista completa

**Pacotes utilizados**: express, prisma/client

#### Response (200):
```json
{
  "type": "success",
  "message": "Bibliografias encontradas com sucesso!",
  "biblios": [
    {
      "bibid": "number",
      "title": "string",
      "author": "string",
      "call_nmbr1": "string",
      "material_cd": "number",
      "collection_cd": "number",
      "...": "outros campos"
    }
  ]
}
```

---

## 3. GET /search

**Nome**: Buscar Bibliografias

**Endpoint**: `GET /biblio/search`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas autenticação (sem verificação de flag específica)

**Função**: Busca bibliografias por título, autor, coleção ou código de barras.

### Controller: SearchBibliosController
**Arquivo**: `src/controllers/Biblio/Biblio/SearchBibliosController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Extrai parâmetros de query:
   - `method` - Método de busca: "title", "author", "collection" ou "barcode" (padrão: "title")
   - `data` - Termo de busca
   - `limit` - Quantidade máxima de resultados
3. Define valores padrão se não fornecidos
4. Chama o serviço SearchBibliosService
5. Retorna status 200 com os resultados

### Service: SearchBibliosService
**Arquivo**: `src/services/Biblio/Biblio/SearchBibliosService.ts`

#### Lógica do Service:

**Sem método/data**:
- Retorna as mais recentes (orderBy createdAt desc)
- Limite padrão: 10

**Método "title"**:
- Busca bibliografias com `title` que contenha o `data`
- Usa `contains` (busca parcial, case-insensitive)
- Retorna múltiplos resultados

**Método "author"**:
- Busca bibliografias com `author` que contenha o `data`
- Usa `contains` (busca parcial)
- Retorna múltiplos resultados

**Método "collection"**:
1. Busca coleção por descrição exata
2. Se encontrada, busca bibliografias dessa coleção
3. Retorna múltiplos resultados

**Método "barcode"**:
1. Busca cópia de livro pelo código de barras
2. Se encontrada, busca bibliografia relacionada
3. Retorna resultado único

**Incluem sempre**:
- `biblio_copy` - Cópias do livro
- `BiblioMedia` - Mídias relacionadas
- `collection.description` - Descrição da coleção
- `collection.colors` - Cores da coleção

**Ordenação**: Por data de criação (desc)

**Pacotes utilizados**: express, prisma/client

#### Query Parameters:
- **method** (string, opcional) - "title", "author", "collection" ou "barcode" (padrão: "title")
- **data** (string, opcional) - Termo de busca
- **limit** (number, opcional) - Máximo de resultados (padrão: 10)

**Exemplos**:
- `GET /biblio/search?method=title&data=Harry Potter&limit=5`
- `GET /biblio/search?method=author&data=Machado de Assis`
- `GET /biblio/search?method=collection&data=Literatura Brasileira`
- `GET /biblio/search?method=barcode&data=123456789`

#### Response (200):
```json
{
  "type": "success",
  "message": "Bibliografias encontradas com sucesso!",
  "biblios": [
    {
      "bibid": "number",
      "title": "string",
      "author": "string",
      "biblio_copy": [...],
      "BiblioMedia": {...},
      "collection": {
        "description": "string",
        "colors": "string"
      },
      "...": "outros campos"
    }
  ]
}
```

---

## 4. GET /randomsearch

**Nome**: Busca Aleatória de Coleções

**Endpoint**: `GET /biblio/randomsearch`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas autenticação (sem verificação de flag específica)

**Função**: Retorna coleções aleatórias com suas bibliografias (para carrossel/destaque).

### Controller: RandomSearchController
**Arquivo**: `src/controllers/Biblio/Biblio/RandomSearchController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Extrai parâmetros de query:
   - `method` - Atualmente apenas "collection" está implementado
   - `number` - Quantidade de coleções aleatórias a retornar
3. Chama o serviço RandomSearchService
4. Retorna status 200 com as coleções e bibliografias

### Service: RandomSearchService
**Arquivo**: `src/services/Biblio/Biblio/RandomSearchService.ts`

#### Lógica do Service:

**Algoritmo de Seleção Aleatória**:
1. Busca todas as coleções disponíveis
2. Para cada número solicitado:
   - **Recursivamente** seleciona coleção aleatória
   - Busca bibliografias dessa coleção (até 100)
   - Se coleção tem menos de 15 bibliografias, tenta outra (recursão)
   - Se coleção tem 15+ bibliografias, aceita e retorna
3. Retorna array com coleções selecionadas e suas bibliografias

**Filtro de Qualidade**:
- Garante que coleções retornadas tenham pelo menos 15 bibliografias
- Evita exibir coleções vazias ou com pouco conteúdo

**Pacotes utilizados**: express, prisma/client

#### Query Parameters:
- **method** (string) - "collection" (único método implementado)
- **number** (number) - Quantidade de coleções aleatórias

**Exemplo**: `GET /biblio/randomsearch?method=collection&number=3`

#### Response (200):
```json
{
  "type": "success",
  "message": "Bibliografias encontradas com sucesso!",
  "biblios": [
    {
      "collection": {
        "code": "number",
        "description": "string",
        "colors": "string"
      },
      "biblios": [
        {
          "bibid": "number",
          "title": "string",
          "author": "string",
          "collection": {
            "description": "string",
            "colors": "string"
          },
          "...": "outros campos"
        }
      ]
    }
  ]
}
```

---

## 5. GET /detailedsearch

**Nome**: Busca Detalhada com Filtros

**Endpoint**: `GET /biblio/detailedsearch`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas autenticação (sem verificação de flag específica)

**Função**: Busca bibliografias com múltiplos filtros e ordenações.

### Controller: DetailedSearchController
**Arquivo**: `src/controllers/Biblio/Biblio/DetailedSearchController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Extrai parâmetros de query:
   - `collection` - Filtrar por descrição da coleção
   - `date` - Ordenação por data: "asc" ou "desc"
   - `order` - Ordenação alfabética: "A-Z" ou "Z-A"
   - `take` - Quantidade de resultados (padrão: 100)
3. Chama o serviço DetailedSearchService
4. Retorna status 200 com os resultados

### Service: DetailedSearchService
**Arquivo**: `src/services/Biblio/Biblio/DetailedSearchService.ts`

#### Lógica do Service:

**1. Construção do Filtro**:
```typescript
// Se coleção fornecida:
if (collection) {
  // Busca código da coleção por descrição
  const collectionExists = await prisma.collectionDM.findFirst({
    where: { description: collection }
  });
  whereClause.collection_cd = collectionExists.code;
}
```

**2. Construção da Ordenação**:
```typescript
let orderBy: any[] = [];

// Ordenação alfabética
if (order === "A-Z") orderBy.push({ title: "asc" });
if (order === "Z-A") orderBy.push({ title: "desc" });

// Ordenação por data
if (date === "asc") orderBy.push({ createdAt: "asc" });
if (date === "desc") orderBy.push({ createdAt: "desc" });

// Padrão se nenhuma ordenação
if (orderBy.length === 0) orderBy = [{ createdAt: "desc" }];
```

**3. Execução da Query**:
- Aplica filtros construídos
- Aplica ordenações (pode ter múltiplas)
- Inclui relacionamentos (biblio_copy, BiblioMedia)
- Limita resultados

**Pacotes utilizados**: express, prisma/client

#### Query Parameters:
- **collection** (string, opcional) - Descrição da coleção para filtrar
- **date** (string, opcional) - "asc" ou "desc" (ordenação por data de criação)
- **order** (string, opcional) - "A-Z" ou "Z-A" (ordenação alfabética)
- **take** (number, opcional) - Quantidade de resultados (padrão: 100)

**Exemplos**:
- `GET /biblio/detailedsearch?collection=Ficção Científica&order=A-Z&take=50`
- `GET /biblio/detailedsearch?date=desc&take=20`
- `GET /biblio/detailedsearch?collection=Romance&order=Z-A&date=asc`

#### Response (200):
```json
{
  "type": "success",
  "message": "Bibliografias encontradas com sucesso!",
  "biblios": [
    {
      "bibid": "number",
      "title": "string",
      "author": "string",
      "biblio_copy": [...],
      "BiblioMedia": {...},
      "...": "outros campos"
    }
  ]
}
```

---

## 6. GET /detail/:bibid

**Nome**: Detalhes Completos da Bibliografia

**Endpoint**: `GET /biblio/detail/:bibid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Apenas autenticação (sem verificação de flag específica)

**Função**: Retorna todos os detalhes de uma bibliografia específica, incluindo campos MARC com descrições.

### Controller: DetailBiblioController
**Arquivo**: `src/controllers/Biblio/Biblio/DetailBiblioController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Extrai `bibid` dos parâmetros da URL
3. Chama o serviço DetailBiblioService
4. Retorna status 200 com dados completos (biblio, descrições dos subcampos, coleção)

### Service: DetailBiblioService
**Arquivo**: `src/services/Biblio/Biblio/DetailBiblioService.ts`

#### Lógica do Service:

**1. Busca Bibliografia**:
```typescript
const biblio = await prisma.biblio.findFirst({
  where: { bibid: bibid },
  include: {
    biblio_field: true,    // Campos MARC
    BiblioMedia: true,     // Mídias
    BiblioRank: true,      // Rankings/avaliações
  }
});
```

**2. Busca Descrição da Coleção**:
```typescript
const collection = await prisma.collectionDM.findFirst({
  where: { code: biblio.collection_cd },
  select: { description: true }
});
```

**3. Busca Descrições dos Subcampos MARC**:
```typescript
// Para cada campo MARC da bibliografia
const subfieldsDescriptions = await Promise.all(
  biblio.biblio_field.map(async (value) => {
    const subfieldDescription = await prisma.usmarcSubfieldDM.findFirst({
      where: {
        tag: value.tag,
        subfield_cd: value.subfield_cd
      },
      select: { description: true }
    });
    return subfieldDescription?.description || "Descrição não encontrada";
  })
);
```

**Retorna**:
- `biblio` - Dados completos da bibliografia
- `subfieldsDescriptions` - Array com descrições legíveis dos campos MARC
- `collection` - Descrição da coleção

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **bibid** (number) - ID da bibliografia na URL

#### Response (200):
```json
{
  "type": "success",
  "message": "Bibliografia encontrada com sucesso!",
  "biblio": {
    "bibid": "number",
    "title": "string",
    "author": "string",
    "call_nmbr1": "string",
    "biblio_field": [
      {
        "fieldid": "number",
        "tag": "number",
        "subfield_cd": "string",
        "field_data": "string"
      }
    ],
    "BiblioMedia": {...},
    "BiblioRank": {...},
    "...": "outros campos"
  },
  "subfieldsDescriptions": [
    "Título principal",
    "Autor principal",
    "..."
  ],
  "collection": {
    "description": "string"
  }
}
```

---

## 7. PATCH /edit/:bibid

**Nome**: Editar Bibliografia

**Endpoint**: `PATCH /biblio/edit/:bibid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `catalog_flg = true` (catalogação)

**Função**: Atualiza informações de uma bibliografia e seus campos MARC.

### Controller: EditBiblioController
**Arquivo**: `src/controllers/Biblio/Biblio/EditBiblioController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `catalog_flg`
3. Extrai `bibid` dos parâmetros da URL
4. Extrai dados do body e separa em dois objetos:
   - `editBiblioData` - Dados básicos da bibliografia
   - `biblioFields` - Campos MARC (values, indexes, tags, subfields, fieldIds)
5. Adiciona apenas campos fornecidos aos objetos
6. Chama o serviço EditBiblioService
7. Retorna status 201 com dados atualizados

### Service: EditBiblioService
**Arquivo**: `src/services/Biblio/Biblio/EditBiblioService.ts`

#### Lógica do Service:
1. Verifica se a bibliografia existe
2. Se foi alterado `title`, verifica unicidade
3. Atualiza dados básicos da bibliografia
4. Se `biblioFields` fornecido:
   - Deleta campos MARC antigos
   - Cria novos campos MARC
5. Retorna bibliografia atualizada

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **bibid** (number) - ID da bibliografia na URL

#### Request Body:
```json
{
  "title": "string (opcional)",
  "author": "string (opcional)",
  "call_nmbr1": "string (opcional)",
  "call_nmbr2": "string (opcional)",
  "call_nmbr3": "string (opcional)",
  "material_cd": "number (opcional)",
  "collection_cd": "number (opcional)",
  "title_remainder": "string (opcional)",
  "responsibility_stmt": "string (opcional)",
  "topic1": "string (opcional)",
  "topic2": "string (opcional)",
  "topic3": "string (opcional)",
  "topic4": "string (opcional)",
  "topic5": "string (opcional)",
  "opac_flg": "boolean (opcional)",
  "values": ["string"] (opcional),
  "indexes": ["string"] (opcional),
  "tags": [number] (opcional),
  "subfields": ["string"] (opcional),
  "fieldIds": [number] (opcional)
}
```

#### Response (201):
```json
{
  "type": "success",
  "message": "Bibliografia atualizada com sucesso!",
  "editedBibliography": {
    "bibid": "number",
    "title": "string",
    "author": "string",
    "...": "campos atualizados"
  }
}
```

---

## 8. PATCH /updateimage/:bibid

**Nome**: Atualizar Imagem da Bibliografia

**Endpoint**: `PATCH /biblio/updateimage/:bibid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `catalog_flg = true` (catalogação)

**Função**: Faz upload e atualiza a capa/imagem da bibliografia.

### Controller: UpdateImageController
**Arquivo**: `src/controllers/Biblio/Biblio/UpdateImageController.ts`

#### Lógica do Controller:
1. Aplica middleware `upload.single('image_file')` antes do controller
2. Valida autenticação através do middleware isAuthenticated
3. Verifica se o usuário possui permissão `catalog_flg`
4. Extrai `bibid` dos parâmetros da URL
5. Verifica se arquivo foi enviado (`req.file`)
6. Extrai nome do arquivo gerado pelo Multer
7. Valida que imagem foi enviada
8. Chama o serviço UpdateImageService
9. Retorna status 201 confirmando upload

### Service: UpdateImageService
**Arquivo**: `src/services/Biblio/Biblio/UpdateImageService.ts`

#### Lógica do Service:
1. Verifica se a bibliografia existe
2. Atualiza campo `image_file` com nome do arquivo
3. Retorna bibliografia atualizada

**Nota**: O Multer já salvou a imagem em `src/public/assets/imgs/biblio/` antes do service ser chamado.

**Pacotes utilizados**: express, prisma/client, multer (via helper)

#### Request Parameters:
- **bibid** (number) - ID da bibliografia na URL

#### Request Body (multipart/form-data):
- **image_file** (file) - Arquivo de imagem (.png, .jpg, .jpeg)

#### Response (201):
```json
{
  "type": "success",
  "message": "Imagem da bibliografia cadastrada com sucesso!",
  "addedImage": {
    "bibid": "number",
    "image_file": "string (nome do arquivo salvo)",
    "...": "outros campos"
  }
}
```

---

## 9. DELETE /delete/:bibid

**Nome**: Deletar Bibliografia

**Endpoint**: `DELETE /biblio/delete/:bibid`

**Autenticação**: Requerida (Token JWT)

**Permissões**: Usuários com `catalog_flg = true` (catalogação)

**Função**: Remove permanentemente uma bibliografia do sistema.

### Controller: DeleteBiblioController
**Arquivo**: `src/controllers/Biblio/Biblio/DeleteBiblioController.ts`

#### Lógica do Controller:
1. Valida autenticação através do middleware isAuthenticated
2. Verifica se o usuário possui permissão `catalog_flg`
3. Extrai `bibid` dos parâmetros da URL
4. Chama o serviço DeleteBiblioService
5. Retorna status 201 confirmando exclusão

### Service: DeleteBiblioService
**Arquivo**: `src/services/Biblio/Biblio/DeleteBiblioService.ts`

#### Lógica do Service:
1. Verifica se a bibliografia existe
2. Verifica se não há cópias emprestadas (proteção)
3. Deleta campos MARC relacionados (cascade)
4. Deleta BiblioMedia relacionado
5. Deleta o registro da bibliografia
6. Retorna confirmação

**Pacotes utilizados**: express, prisma/client

#### Request Parameters:
- **bibid** (number) - ID da bibliografia na URL

#### Response (201):
```json
{
  "type": "success",
  "message": "Bibliografia deletada com sucesso!"
}
```

---

## Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida (GET, operações de leitura)
- **201 Created**: Recurso criado/atualizado com sucesso (POST, PATCH, DELETE)
- **401 Unauthorized**: Usuário não autenticado
- **422 Unprocessable Entity**: Erro de validação ou lógica de negócio
- **500 Internal Server Error**: Erro interno do servidor

---

## Mensagens de Erro Comuns

### Autenticação e Permissões
- `"Usuário não autenticado!"` - Token não fornecido
- `"Usuário não tem permissão!"` - Usuário não possui flag `catalog_flg`

### Validação de Campos (Register)
- `"Escolha uma das opções de materiais!"` - Campo material_cd obrigatório
- `"Escolha uma das opções de coleções!"` - Campo collection_cd obrigatório
- `"Informe o número de chamada (call number)!"` - Campo call_nmbr1 obrigatório
- `"Informe o título!"` - Campo title obrigatório
- `"Informe o nome do autor!"` - Campo author obrigatório
- `"Os seguintes campos obrigatórios estão vazios: {lista}"` - Campos MARC obrigatórios faltando

### Lógica de Negócio
- `"O título já está cadastrado!"` - Título duplicado
- `"Bibliografia não encontrada!"` - bibid não existe
- `"Coleção não encontrada!"` - Coleção inexistente
- `"Método de busca inválido!"` - method deve ser válido
- `"Nenhuma bibliografia encontrada com os filtros informados."` - Busca sem resultados
- `"Nenhuma imagem enviada!"` - Upload sem arquivo
- `"Por favor, envie apenas jpg ou png"` - Formato de imagem inválido

---

## Estrutura de Permissões (Flags)

| Flag | Descrição | Rotas que Requerem |
|------|-----------|-------------------|
| `catalog_flg` | Catalogação | register, edit, updateimage, delete |

**Rotas sem flag específica**:
- `viewbiblios`, `search`, `randomsearch`, `detailedsearch`, `detail` - Qualquer usuário autenticado

---

## Tabela Resumo das Rotas

| Método | Rota | Permissão | Função |
|--------|------|-----------|---------|
| POST | /register | catalog_flg | Criar nova bibliografia |
| GET | /viewbiblios | Autenticado | Listar todas bibliografias |
| GET | /search | Autenticado | Buscar (título/autor/coleção/barcode) |
| GET | /randomsearch | Autenticado | Coleções aleatórias (carrossel) |
| GET | /detailedsearch | Autenticado | Busca com filtros avançados |
| GET | /detail/:bibid | Autenticado | Detalhes completos + MARC |
| PATCH | /edit/:bibid | catalog_flg | Editar dados e campos MARC |
| PATCH | /updateimage/:bibid | catalog_flg | Upload de capa |
| DELETE | /delete/:bibid | catalog_flg | Deletar bibliografia |

---

## Relacionamentos do Modelo Biblio

```
Biblio
  ├─ material_cd (FK para MaterialDM)
  ├─ collection_cd (FK para CollectionDM)
  ├─ biblio_field (1:N para BiblioField - campos MARC)
  ├─ biblio_copy (1:N para BiblioCopy - cópias físicas)
  ├─ BiblioMedia (1:1 para BiblioMedia - URLs de mídia)
  ├─ BiblioRank (1:N para BiblioRank - avaliações)
  └─ last_change_userid (FK para Staff)
```

---

## Campos MARC Detalhados

### Tabela usmarcSubfieldDM
Armazena definições de subcampos MARC com descrições:
- **tag** - Tag MARC (ex: 245)
- **subfield_cd** - Código do subcampo (ex: 'a')
- **description** - Descrição legível (ex: "Título principal")

### Fluxo de Catalogação MARC

**No Registro**:
1. Frontend envia objeto `values` com campos MARC: `{"245a": "Título", "100a": "Autor"}`
2. Backend extrai campos principais de valores MARC se não fornecidos diretamente
3. Valida campos obrigatórios usando `requiredFlgs`
4. Cria registros em `BiblioField` com tag, subfield_cd e field_data

**No Detalhamento**:
1. Backend busca campos MARC da bibliografia
2. Para cada campo, busca descrição em `usmarcSubfieldDM`
3. Retorna campos com descrições legíveis

---

## Upload de Imagens

### Configuração
- **Pasta de destino**: `src/public/assets/imgs/biblio/`
- **Formatos aceitos**: .png, .jpg, .jpeg
- **Nome do arquivo**: Gerado automaticamente (random + timestamp + extensão)
- **Campo no formulário**: `image_file`
- **Tipo de requisição**: `multipart/form-data`

### Acesso Público
Imagens ficam acessíveis via:
```
http://localhost:{PORT}/{nome_do_arquivo}.jpg
```

---

## Casos de Uso Comuns

### 1. Catalogar Novo Livro
```
POST /biblio/register
{
  "title": "Dom Casmurro",
  "author": "Machado de Assis",
  "call_nmbr1": "869.3",
  "material_cd": 1,
  "collection_cd": 2,
  "values": {
    "245a": "Dom Casmurro",
    "100a": "Machado de Assis",
    "260a": "Rio de Janeiro",
    "260b": "Garnier",
    "260c": "1899"
  },
  "indexes": ["245a", "100a", "260a", "260b", "260c"],
  "tags": [245, 100, 260, 260, 260],
  "subfields": ["a", "a", "a", "b", "c"]
}
```

### 2. Buscar Livro por Título
```
GET /biblio/search?method=title&data=Dom Casmurro&limit=10
```

### 3. Listar Coleções para Carrossel
```
GET /biblio/randomsearch?method=collection&number=5
```

### 4. Busca Avançada
```
GET /biblio/detailedsearch?collection=Literatura Brasileira&order=A-Z&date=desc&take=50
```

### 5. Ver Detalhes com Campos MARC
```
GET /biblio/detail/123
```

---

## Segurança

### Validação de Unicidade
- `title` único no sistema (evita cadastros duplicados)

### Validação de Relacionamentos
- Verifica existência de `material_cd` e `collection_cd`
- Impede exclusão se há cópias emprestadas

### Upload Seguro
- Validação de extensão de arquivo
- Nome de arquivo gerado (evita override)
- Armazenamento em pasta específica

### Auditoria
- Campo `last_change_userid` rastreia alterações
- Registra quem criou/editou cada bibliografia

### Campos Obrigatórios MARC
- Sistema valida campos marcados como obrigatórios
- Retorna lista detalhada de campos faltantes

---

## Observações Importantes

1. **Extração Inteligente**: Sistema tenta extrair título, autor e call_nmbr1 dos campos MARC se não fornecidos diretamente

2. **Transações**: Registro usa transação Prisma para garantir atomicidade (biblio + biblioField + biblioMedia criados juntos)

3. **Busca Flexível**: 4 métodos de busca (título, autor, coleção, barcode) para diferentes necessidades

4. **Busca Aleatória Inteligente**: Garante que coleções aleatórias tenham pelo menos 15 bibliografias

5. **Descrições MARC**: Sistema traduz códigos MARC em descrições legíveis para o usuário

6. **BiblioMedia**: Criado automaticamente para todas bibliografias (para suportar URLs futuras)

7. **Permissões Separadas**: Catalogação requer flag específica, mas consultas são públicas (autenticadas)

8. **Múltiplas Ordenações**: Busca detalhada suporta ordenação alfabética E cronológica simultaneamente

---

**Desenvolvido por**: Caahmos  
**Versão**: 1.0.0  
**Tecnologias**: Node.js, Express, TypeScript, Prisma, Multer, MARC Cataloging
