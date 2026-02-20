# Documentação do Servidor - Library Management API

## Visão Geral
Esta documentação descreve a arquitetura e configuração do servidor da API de gerenciamento de biblioteca. O servidor foi desenvolvido com Node.js, Express, TypeScript e implementa WebSocket (Socket.IO) para comunicação em tempo real, além de integração com WhatsApp.

---

## Pacotes Utilizados

### Dependências Principais
- **express** (v4.21.0) - Framework web para Node.js
- **dotenv** (v16.4.5) - Gerenciamento de variáveis de ambiente
- **cors** (v2.8.5) - Habilitação de Cross-Origin Resource Sharing
- **@prisma/client** (v5.20.0) - ORM para interação com banco de dados
- **socket.io** (v4.8.1) - Comunicação bidirecional em tempo real via WebSocket
- **swagger-ui-express** (v5.0.1) - Documentação interativa da API
- **node-cron** (v4.2.0) - Agendamento de tarefas (cron jobs)
- **date-fns** (v4.1.0) - Biblioteca de manipulação de datas
- **@wppconnect-team/wppconnect** (v1.37.8) - Integração com WhatsApp
- **bcryptjs** (v2.4.3) - Criptografia de senhas
- **jsonwebtoken** (v9.0.2) - Autenticação JWT
- **multer** (v1.4.5-lts.1) - Upload de arquivos
- **nodemailer** (v7.0.5) - Envio de e-mails
- **ts-node-dev** (v2.0.0) - Ferramenta de desenvolvimento TypeScript

### DevDependencies
- **typescript** (v5.6.2) - Superset JavaScript com tipagem estática
- **@types/express** - Tipos TypeScript para Express
- **@types/cors** - Tipos TypeScript para CORS
- **@types/jsonwebtoken** - Tipos TypeScript para JWT
- **@types/multer** - Tipos TypeScript para Multer
- **@types/nodemailer** - Tipos TypeScript para Nodemailer
- **@types/swagger-ui-express** - Tipos TypeScript para Swagger
- **prisma** (v5.20.0) - CLI do Prisma ORM

---

## Estrutura de Arquivos

```
src/
├── index.ts                    # Ponto de entrada do servidor
├── server.ts                   # Configuração principal do servidor
├── whatsappClient.ts           # Cliente WhatsApp
├── routes/                     # Definições de rotas
├── controllers/                # Controllers das rotas
├── services/                   # Lógica de negócio
├── middlewares/                # Middlewares (autenticação, etc)
├── utils/                      # Utilitários (cron jobs, etc)
├── helpers/                    # Funções auxiliares
├── model/                      # Modelos de dados (DTOs)
├── prisma/                     # Configuração do Prisma
└── public/                     # Arquivos estáticos
    └── assets/                 # Assets públicos
```

---

## Arquivo: index.ts

**Localização**: `src/index.ts`

**Função**: Ponto de entrada principal da aplicação. Inicializa o servidor HTTP, configura Socket.IO e gerencia conexões em tempo real.

### Lógica de Implementação

#### 1. Inicialização do Servidor
```typescript
const app = new Server().app;
const server = http.createServer(app);
```
- Cria instância da classe `Server`
- Cria servidor HTTP usando o app Express

#### 2. Configuração do Socket.IO
```typescript
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
```
- Inicializa Socket.IO com suporte a CORS
- Permite comunicação em tempo real com o frontend
- Origem configurada: `http://localhost:5173` (frontend)

#### 3. Gerenciamento de Conexões WebSocket

**Eventos Emitidos pelo Servidor:**
- `whatsapp-status` - Status atual do WhatsApp (conectado, desconectado, etc)
- `whatsapp-qr` - QR Code para autenticação do WhatsApp
- `whatsapp-info` - Informações gerais do WhatsApp
- `whatsapp-error` - Erros relacionados ao WhatsApp

**Eventos Recebidos do Cliente:**
- `request-whatsapp-state` - Cliente solicita estado atual do WhatsApp
- `start-whatsapp` - Cliente solicita inicialização do WhatsApp
- `disconnect` - Cliente desconecta do Socket

#### 4. Lógica de Conexão Socket

**On Connection:**
1. Cliente se conecta ao servidor
2. Servidor registra ID do cliente no console
3. Servidor envia estado atual do WhatsApp imediatamente
4. Se houver QR Code disponível, envia para o cliente

**On 'request-whatsapp-state':**
1. Cliente solicita estado atual
2. Servidor busca status via `getWhatsappStatus()`
3. Envia status e QR Code (se disponível) para o cliente

**On 'start-whatsapp':**
1. Cliente solicita início do WhatsApp
2. Verifica se WhatsApp já está rodando via `hasWhatsappClient()`
3. Se já estiver rodando, notifica cliente
4. Caso contrário, inicia WhatsApp via `startWhatsapp()`

**On 'disconnect':**
1. Registra desconexão do cliente no console

#### 5. Inicialização do Servidor
```typescript
server.listen(process.env.PORT, () => {
  console.log("O servidor está rodando!");
  console.log(`http://localhost:${process.env.PORT}`);
});
```
- Inicia servidor na porta definida em variável de ambiente
- Exibe mensagem de confirmação no console

**Pacotes utilizados**: dotenv, express (via Server), http, socket.io, whatsappClient

---

## Arquivo: server.ts

**Localização**: `src/server.ts`

**Função**: Classe principal que configura o servidor Express, middlewares, rotas e documentação.

### Classe: Server

#### Constructor
```typescript
constructor() {
  this.configServer();
  this.configRoutes();
  startWhatsapp();
}
```

**Lógica**:
1. Configura o servidor (body parser e CORS)
2. Configura todas as rotas da aplicação
3. Inicia o cliente WhatsApp automaticamente

### Métodos da Classe

#### 1. configServer()
**Função**: Configura middlewares básicos do servidor

**Lógica**:
- Chama `configBodyParser()` para configurar parsers de requisição
- Chama `configCors()` para habilitar CORS

#### 2. configBodyParser()
**Função**: Configura parsers para requisições HTTP

**Lógica**:
1. `express.json()` - Parser para requisições JSON
2. `express.urlencoded({ extended: true })` - Parser para dados URL-encoded
3. `express.static(path.resolve("src", "public", "assets"))` - Servir arquivos estáticos

**Pacotes utilizados**: express, path (node:path)

#### 3. configCors()
**Função**: Configura CORS (Cross-Origin Resource Sharing)

**Lógica**:
```typescript
this.app.use(cors({ 
  credentials: true, 
  origin: "http://localhost:5173" 
}));
```
- Permite credenciais (cookies, headers de autenticação)
- Restringe acesso apenas à origem `http://localhost:5173`

**Pacotes utilizados**: cors

#### 4. configRoutes()
**Função**: Registra todas as rotas da aplicação

**Lógica**: Monta rotas com seus respectivos prefixos

**Rotas Configuradas:**

| Prefixo | Classe de Rotas | Descrição |
|---------|----------------|-----------|
| `/staff` | StaffRoutes | Gerenciamento de equipe/funcionários |
| `/member` | MemberRoutes | Gerenciamento de membros/usuários |
| `/biblio` | BiblioRoutes | Gerenciamento de bibliografia/livros |
| `/bibliocopy` | BiblioCopyRoutes | Gerenciamento de cópias de livros |
| `/bibliohist` | BiblioHistRoutes | Histórico de empréstimos |
| `/bibliorank` | BiblioRankRoutes | Ranking de livros |
| `/checkprivs` | CheckoutPrivsRoutes | Privilégios de empréstimo |
| `/material` | MaterialRoutes | Tipos de materiais |
| `/collection` | CollectionRoutes | Coleções de livros |
| `/mbrclassifydm` | MemberClassifyDMRoutes | Classificação de membros |
| `/mbrfieldsdm` | MemberFieldsDMRoutes | Campos customizados de membros |
| `/mbraccount` | MemberAccountRoutes | Contas de membros |
| `/biblioreports` | BiblioReportsRoutes | Relatórios de bibliografia |
| `/marc` | MarcRoutes | Registros MARC (catalogação) |
| `/whatsapp` | WhatsappRoutes | Gerenciamento WhatsApp |
| `/api-docs` | Swagger UI | Documentação interativa da API |

**Pacotes utilizados**: express, classes de rotas customizadas

#### 5. documentation()
**Função**: Configura documentação Swagger da API

**Lógica**:
```typescript
this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```
- Carrega arquivo `swagger.json`
- Disponibiliza documentação em `/api-docs`
- Interface interativa para testar endpoints

**Pacotes utilizados**: swagger-ui-express

**Acesso**: `http://localhost:{PORT}/api-docs`

---

## Arquivo: whatsappClient.ts

**Localização**: `src/whatsappClient.ts`

**Função**: Gerencia a conexão com WhatsApp usando WPPConnect e comunica status via Socket.IO.

### Interface: WhatsappState
```typescript
interface WhatsappState {
  client: any | null;
  lastStatus: string | null;
  lastQr: string | null;
}
```

**Descrição**: Armazena estado global do WhatsApp na aplicação.

### Função: startWhatsapp()

**Tipo**: Assíncrona

**Função**: Inicializa a sessão do WhatsApp com suporte a QR Code

**Lógica de Implementação**:

#### 1. Criação da Sessão
```typescript
const wpp = await wppconnect.create({
  session: "biblioteca",
  autoClose: 0,
  catchQR: (qr) => {...},
  statusFind: (status) => {...},
  headless: true,
  puppeteerOptions: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});
```

**Configurações**:
- `session`: Nome da sessão ("biblioteca")
- `autoClose`: 0 (não fecha automaticamente)
- `headless`: true (roda sem interface gráfica)
- `puppeteerOptions`: Configurações do navegador headless

#### 2. Callback catchQR
**Função**: Captura QR Code gerado para autenticação

**Lógica**:
1. Armazena QR Code em `whatsappState.lastQr`
2. Exibe mensagem no console
3. Emite evento `whatsapp-qr` para clientes Socket.IO com QR Code
4. Emite evento `whatsapp-status` com status "notLogged"

#### 3. Callback statusFind
**Função**: Monitora mudanças de status do WhatsApp

**Status Possíveis**:
- `inChat` - WhatsApp conectado ✅
- `isLogged` - WhatsApp conectado ✅
- `notLogged` - Aguardando login 📲
- `qrReadSuccess` - QR Code lido com sucesso 📱
- `qrReadFail` - Falha ao ler QR Code ❌
- `disconnectedMobile` - Dispositivo desconectado ❌

**Lógica**:
1. Armazena status em `whatsappState.lastStatus`
2. Converte status em mensagem amigável
3. Exibe no console
4. Emite evento `whatsapp-status` para clientes Socket.IO

#### 4. Armazenamento do Cliente
```typescript
whatsappState.client = wpp;
```
- Armazena instância do cliente WhatsApp globalmente

#### 5. Tratamento de Erros
- Captura erros durante inicialização
- Exibe erro no console
- Emite evento `whatsapp-error` para clientes

**Retorno**: Instância do cliente WhatsApp

**Pacotes utilizados**: @wppconnect-team/wppconnect, socket.io (via import de index)

### Função: getWhatsappStatus()

**Tipo**: Síncrona

**Função**: Retorna estado atual do WhatsApp

**Lógica**:
1. Busca último status armazenado
2. Converte em mensagem amigável
3. Retorna objeto com:
   - `status` - Status atual
   - `qr` - QR Code (se disponível)
   - `connected` - Boolean indicando conexão
   - `message` - Mensagem descritiva

**Retorno**:
```typescript
{
  status: string | null,
  qr: string | null,
  connected: boolean,
  message: string
}
```

### Função: hasWhatsappClient()

**Tipo**: Síncrona

**Função**: Verifica se cliente WhatsApp já foi inicializado

**Lógica**: Retorna `true` se `whatsappState.client !== null`

**Retorno**: boolean

### Função: getClient()

**Tipo**: Síncrona

**Função**: Retorna instância do cliente WhatsApp

**Lógica**:
1. Verifica se cliente existe
2. Se não existir, lança erro
3. Caso contrário, retorna cliente

**Retorno**: Instância do cliente WhatsApp

**Erro**: `"WhatsApp não está pronto ainda!"` se cliente não existe

---

## Arquivo: BlockOverdueMembers.ts

**Localização**: `src/utils/BlockOverdueMembers.ts`

**Função**: Cron job que bloqueia automaticamente membros com empréstimos atrasados.

### Função: blockOverdueMembers()

**Tipo**: Assíncrona

**Função**: Identifica e bloqueia membros com empréstimos vencidos

**Lógica de Implementação**:

#### 1. Definir Data Atual
```typescript
const today = startOfDay(new Date());
```
- Usa `date-fns` para obter início do dia (00:00:00)

#### 2. Buscar Empréstimos Atrasados
```typescript
const overdueLoans = await prisma.biblioStatusHist.findMany({
  where: {
    due_back_dt: { lt: today },
    returned_at: null,
    status_cd: "out",
  },
  select: {
    mbrid: true,
    due_back_dt: true,
    biblio: { select: { material_cd: true } },
    member: { select: { classification: true } },
  },
});
```

**Critérios**:
- Data de devolução (`due_back_dt`) anterior a hoje
- Ainda não devolvido (`returned_at: null`)
- Status é "out" (emprestado)

**Dados Retornados**:
- ID do membro
- Data de devolução prevista
- Código do material
- Classificação do membro

#### 3. Identificar Membros para Bloquear
```typescript
const mbridToBlock = new Set<number>();

for (const loan of overdueLoans) {
  // Busca privilégios de empréstimo
  const checkoutPriv = await prisma.checkoutPrivs.findFirst({
    where: {
      classification: member.classification,
      material_cd: biblio.material_cd,
    },
    select: { grace_period_days: true },
  });

  // Calcula limite com período de graça
  const grace = checkoutPriv?.grace_period_days ?? 0;
  const graceLimit = addDays(due_back_dt, grace);

  // Se passou do período de graça, adiciona à lista
  if (isAfter(today, graceLimit)) {
    mbridToBlock.add(mbrid);
  }
}
```

**Lógica**:
1. Para cada empréstimo atrasado
2. Busca período de graça (grace_period_days) baseado em:
   - Classificação do membro
   - Tipo de material
3. Calcula data limite: data de devolução + período de graça
4. Se hoje ultrapassou o limite de graça, adiciona membro ao Set

#### 4. Bloquear Membros
```typescript
if (mbridToBlock.size > 0) {
  await prisma.member.updateMany({
    where: {
      mbrid: { in: Array.from(mbridToBlock) },
    },
    data: {
      isBlocked: true,
    },
  });
  console.log(`Membros bloqueados: ${mbridToBlock.size}`);
} else {
  console.log("Nenhum membro para bloquear hoje.");
}
```

**Lógica**:
1. Se houver membros para bloquear
2. Atualiza campo `isBlocked` para `true`
3. Exibe quantidade de membros bloqueados
4. Caso contrário, exibe mensagem de nenhum bloqueio

#### 5. Tratamento de Erros
- Captura e exibe erros no console
- Não interrompe execução do servidor

**Pacotes utilizados**: node-cron, prisma/client, date-fns

### Agendamento do Cron Job
```typescript
cron.schedule("*/5 * * * * *", async () => {
  console.log("Executando job de bloqueio de membros...");
  await blockOverdueMembers();
});
```

**Frequência**: A cada 5 segundos (`*/5 * * * * *`)

**Nota**: Em produção, considere ajustar para executar menos frequentemente (ex: diariamente).

**Formato Cron**: `segundo minuto hora dia mês dia-da-semana`

---

## Variáveis de Ambiente

**Arquivo**: `.env` (raiz do projeto)

**Variáveis Necessárias**:

```env
# Porta do servidor
PORT=3333

# Secret para JWT
SECRET=sua_chave_secreta_aqui

# Database URL (PostgreSQL, MySQL, SQLite, etc)
DATABASE_URL="postgresql://user:password@localhost:5432/library_db"

# Outras configurações (opcionais)
FRONTEND_URL=http://localhost:5173
```

**Carregamento**: Usando `dotenv.config()` no início de `index.ts` e `server.ts`

---

## Fluxo de Inicialização

1. **Carrega variáveis de ambiente** (`dotenv.config()`)
2. **Cria instância do Server** (classe em `server.ts`)
   - Configura body parser (JSON, URL-encoded, arquivos estáticos)
   - Configura CORS
   - Registra todas as rotas
   - Configura documentação Swagger
   - Inicia WhatsApp automaticamente
3. **Cria servidor HTTP** com app Express
4. **Configura Socket.IO** com CORS
5. **Exporta `io`** para uso em outros módulos
6. **Define listeners do Socket.IO**
   - connection
   - request-whatsapp-state
   - start-whatsapp
   - disconnect
7. **Importa utilitários** (`BlockOverdueMembers`)
   - Inicia cron job automaticamente
8. **Inicia servidor HTTP** na porta configurada

---

## Recursos Principais

### 1. API RESTful
- 15 grupos de rotas diferentes
- Autenticação via JWT
- Validação de permissões
- CRUD completo para todas entidades

### 2. Comunicação em Tempo Real (Socket.IO)
- WebSocket para comunicação bidirecional
- Eventos de status do WhatsApp
- Transmissão de QR Code em tempo real
- Suporte a múltiplos clientes conectados

### 3. Integração WhatsApp
- Conexão via WPPConnect
- Autenticação por QR Code
- Monitoramento de status
- Suporte a headless mode

### 4. Automatização com Cron Jobs
- Bloqueio automático de membros inadimplentes
- Verificação de período de graça
- Logs de execução

### 5. Documentação Automática
- Swagger UI interativa
- Endpoint `/api-docs`
- Testes de API direto no navegador

### 6. Arquivos Estáticos
- Servir assets via Express
- Diretório: `src/public/assets`

---

## Segurança

### 1. CORS Configurado
- Restringe acesso à origem específica
- Permite credenciais (cookies, headers)

### 2. Autenticação JWT
- Middleware `isAuthenticated` protege rotas
- Tokens com informações do usuário e permissões

### 3. Criptografia de Senhas
- Bcrypt com salt rounds configurável
- Senhas nunca expostas nas respostas

### 4. Validação de Permissões
- Diferentes níveis de acesso (admin, circ, catalog, etc)
- Verificação em cada rota protegida

### 5. Variáveis de Ambiente
- Secrets não hardcoded no código
- Arquivo `.env` no `.gitignore`

---

## Endpoints de Saúde e Monitoramento

### Documentação Swagger
- **Endpoint**: `/api-docs`
- **Método**: GET
- **Descrição**: Interface interativa da documentação da API
- **Acesso**: Navegador web

### Arquivos Estáticos
- **Endpoint**: `/` (assets)
- **Método**: GET
- **Descrição**: Servir arquivos do diretório `src/public/assets`

---

## Arquitetura de Comunicação

### Fluxo HTTP (API REST)
```
Cliente → Express Router → Controller → Service → Prisma → Database
                                                           ↓
Cliente ← JSON Response ← Controller ← Service ← Prisma ←
```

### Fluxo WebSocket (Socket.IO)
```
Cliente Frontend ↔ Socket.IO Server ↔ WhatsApp Client
                         ↓
                  Broadcast para todos clientes
```

---

## Tratamento de Erros

### API REST
- **Controller**: Valida dados e autenticação
- **Service**: Lança erros de negócio
- **Controller**: Captura erros e retorna JSON

**Formato de Erro**:
```json
{
  "type": "error",
  "message": "Descrição do erro"
}
```

### Socket.IO
- Eventos específicos de erro (`whatsapp-error`)
- Logs no console do servidor
- Cliente recebe mensagem descritiva

### Cron Jobs
- Erros não interrompem servidor
- Logs no console para debugging
- Próxima execução continua normalmente

---

## Performance e Escalabilidade

### Boas Práticas Implementadas
1. **Conexão única do Prisma** - Reutilização de pool de conexões
2. **Cron jobs eficientes** - Set para evitar duplicatas
3. **Socket.IO otimizado** - Broadcast seletivo
4. **Static files** - Servidos diretamente pelo Express
5. **Async/Await** - Operações não-bloqueantes

### Considerações para Produção
1. Ajustar frequência do cron job (de 5 segundos para diário)
2. Implementar rate limiting
3. Adicionar compression (gzip)
4. Configurar logs estruturados (Winston, Pino)
5. Usar variáveis de ambiente para CORS dinâmico
6. Implementar health check endpoint
7. Adicionar monitoring (Prometheus, Grafana)

---

## Scripts NPM

**Arquivo**: `package.json`

```json
{
  "scripts": {
    "start": "ts-node-dev --transpile-only ./src/index.ts"
  }
}
```

### start
**Comando**: `npm start`

**Função**: Inicia servidor em modo de desenvolvimento

**Comportamento**:
- Compila TypeScript on-the-fly
- Reinicia automaticamente ao detectar mudanças
- Apenas transpila (não faz type checking completo)

---

## Logs do Sistema

### Inicialização
- `"O servidor está rodando!"`
- `"http://localhost:{PORT}"`

### WhatsApp
- `"📱 QR Code gerado! Escaneie no app"`
- `"✅ WhatsApp conectado"`
- `"❌ Erro ao iniciar WhatsApp"`
- `"🎉 Sessão criada com sucesso!"`

### Socket.IO
- `"Cliente conectado: {socket.id}"`
- `"🔁 Cliente pediu estado atual do WhatsApp"`
- `"⚡ Cliente solicitou início do WhatsApp"`
- `"Cliente desconectado: {socket.id}"`

### Cron Jobs
- `"Executando job de bloqueio de membros..."`
- `"Membros bloqueados: {count}"`
- `"Nenhum membro para bloquear hoje."`
- `"Erro ao bloquear membros: {error}"`

---

## Estrutura de URLs Completa

Base URL: `http://localhost:{PORT}`

```
/staff/*                    - Rotas de equipe
/member/*                   - Rotas de membros
/biblio/*                   - Rotas de bibliografia
/bibliocopy/*              - Rotas de cópias de livros
/bibliohist/*              - Rotas de histórico de empréstimos
/bibliorank/*              - Rotas de ranking de livros
/checkprivs/*              - Rotas de privilégios de empréstimo
/material/*                - Rotas de materiais
/collection/*              - Rotas de coleções
/mbrclassifydm/*           - Rotas de classificação de membros
/mbrfieldsdm/*             - Rotas de campos de membros
/mbraccount/*              - Rotas de contas de membros
/biblioreports/*           - Rotas de relatórios
/marc/*                    - Rotas de registros MARC
/whatsapp/*                - Rotas de WhatsApp
/api-docs                  - Documentação Swagger
/{assets}                  - Arquivos estáticos
```

---

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente Frontend                      │
│              (http://localhost:5173)                     │
└─────────────────────────────────────────────────────────┘
           │                              │
           │ HTTP/REST                    │ WebSocket
           ↓                              ↓
┌──────────────────────────────────────────────────────────┐
│                      index.ts                            │
│  ┌──────────────┐              ┌──────────────┐         │
│  │ HTTP Server  │              │  Socket.IO   │         │
│  └──────────────┘              └──────────────┘         │
└──────────────────────────────────────────────────────────┘
           │                              │
           ↓                              ↓
┌──────────────────────┐     ┌────────────────────────┐
│     server.ts        │     │  whatsappClient.ts     │
│ ┌──────────────────┐ │     │                        │
│ │  Express App     │ │     │  WPPConnect Client     │
│ │  - CORS          │ │     │  - QR Code             │
│ │  - Body Parser   │ │     │  - Status Monitor      │
│ │  - Static Files  │ │     └────────────────────────┘
│ │  - 15 Routers    │ │
│ │  - Swagger       │ │
│ └──────────────────┘ │
└──────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│         Routes → Controllers             │
│              ↓                            │
│           Services                        │
│              ↓                            │
│         Prisma ORM                        │
└──────────────────────────────────────────┘
           │
           ↓
┌──────────────────────┐    ┌──────────────────────┐
│      Database        │    │  Utils/Cron Jobs     │
│   (PostgreSQL/etc)   │    │  - BlockOverdue      │
└──────────────────────┘    └──────────────────────┘
```

---

## Observações Importantes

1. **Socket.IO e WhatsApp**: Integração em tempo real permite monitoramento instantâneo da conexão WhatsApp

2. **Cron Job Ativo**: Executado automaticamente ao iniciar servidor (sem necessidade de configuração adicional)

3. **Inicialização Automática do WhatsApp**: WhatsApp tenta conectar automaticamente quando servidor inicia

4. **Express Static**: Assets servidos diretamente do diretório `src/public/assets`

5. **CORS Restrito**: Apenas `http://localhost:5173` tem acesso (ajustar para produção)

6. **TypeScript**: Código completamente tipado para maior segurança

7. **Modularização**: Separação clara entre rotas, controllers, services e models

8. **Documentação Automática**: Swagger gerado a partir de `swagger.json`

---

**Desenvolvido por**: Caahmos  
**Versão**: 1.0.0  
**Tecnologias**: Node.js, Express, TypeScript, Socket.IO, Prisma, WPPConnect, Node-Cron
