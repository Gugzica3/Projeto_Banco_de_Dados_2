# 📊 DIAGRAMAS VISUAIS - MINI-STEAM
## Representações Visuais da Arquitetura e Fluxos

---

## 🏗️ ARQUITETURA COMPLETA DO SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAMADA DE SIMULAÇÃO                         │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  S1 - Simulador Cliente (Python)                            │   │
│  │  📍 Localização: servico-s1/simulator.py                    │   │
│  │                                                               │   │
│  │  Funções:                                                     │   │
│  │  • Gera 10 usuários fictícios                                │   │
│  │  • Cria 20 jogos no catálogo                                 │   │
│  │  • Sincroniza dados com Neo4j                                │   │
│  │  • Simula 50 amizades                                        │   │
│  │  • Simula 100 compras                                        │   │
│  │  • Gera s1_verification_log.json                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                 │                                    │
│                                 │ HTTP REST                          │
│                                 │                                    │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CAMADA DE MICROSSERVIÇOS                       │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  Microsserviço 1 │  │  Microsserviço 2 │  │ Microsserviço 3 │  │
│  │                  │  │                  │  │                 │  │
│  │  servico-usuarios│  │  servico-catalogo│  │ servico-social  │  │
│  │  🚪 Porta: 3001  │  │  🚪 Porta: 3002  │  │ 🚪 Porta: 3003  │  │
│  │  📦 Node.js      │  │  📦 Node.js      │  │ 📦 Node.js      │  │
│  │                  │  │                  │  │                 │  │
│  │  APIs:           │  │  APIs:           │  │ APIs:           │  │
│  │  POST /users     │  │  POST /catalog   │  │ POST /users/:id │  │
│  │  GET /users/:id  │  │  GET /catalog    │  │      /friends   │  │
│  │  GET /users/:id  │  │  GET /catalog    │  │ GET /users/:id  │  │
│  │      /library    │  │      /:gameId    │  │     /friends    │  │
│  │  POST /users/:id │  │                  │  │ GET /users/:id  │  │
│  │       /library   │  │                  │  │     /recommend  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬────────┘  │
│           │                     │                      │            │
└───────────┼─────────────────────┼──────────────────────┼────────────┘
            │                     │                      │
            │                     │                      │
            ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE PERSISTÊNCIA                       │
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │   PostgreSQL     │  │     MongoDB      │  │     Neo4j       │  │
│  │   (Relacional)   │  │   (Documentos)   │  │    (Grafos)     │  │
│  │                  │  │                  │  │                 │  │
│  │  🚪 Porta: 5432  │  │  🚪 Porta: 27017 │  │ 🚪 Porta: 7687  │  │
│  │  🌐 Interface:   │  │  🌐 Interface:   │  │ 🌐 Browser:7474 │  │
│  │     psql         │  │     mongosh      │  │                 │  │
│  │                  │  │                  │  │                 │  │
│  │  Armazena:       │  │  Armazena:       │  │ Armazena:       │  │
│  │  • usuarios      │  │  • games         │  │ • User nodes    │  │
│  │  • bibliotecas   │  │                  │  │ • Game nodes    │  │
│  │                  │  │                  │  │ • FRIENDS_WITH  │  │
│  │  Volume:         │  │  Volume:         │  │ • OWNS          │  │
│  │  postgres_data   │  │  mongodb_data    │  │ Volume:         │  │
│  │                  │  │                  │  │ neo4j_data      │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

Rede Docker: ministeam-network (bridge)
```

---

## 📊 MODELO DE DADOS - POSTGRESQL

```
┌─────────────────────────────────────────────────────────────┐
│                     Tabela: usuarios                        │
├──────────────────┬──────────────┬────────────────────────────┤
│ Campo            │ Tipo         │ Constraints               │
├──────────────────┼──────────────┼────────────────────────────┤
│ id               │ UUID         │ PRIMARY KEY               │
│ nome             │ VARCHAR(100) │ NOT NULL                  │
│ email            │ VARCHAR(255) │ NOT NULL, UNIQUE          │
│ senha_hash       │ VARCHAR(255) │ NOT NULL                  │
│ data_criacao     │ TIMESTAMP    │ DEFAULT CURRENT_TIMESTAMP │
│ ultimo_acesso    │ TIMESTAMP    │                           │
│ ativo            │ BOOLEAN      │ DEFAULT TRUE              │
└──────────────────┴──────────────┴────────────────────────────┘
                              │
                              │ 1:N (one-to-many)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Tabela: bibliotecas                       │
├──────────────────┬──────────────┬────────────────────────────┤
│ Campo            │ Tipo         │ Constraints               │
├──────────────────┼──────────────┼────────────────────────────┤
│ id               │ UUID         │ PRIMARY KEY               │
│ id_usuario       │ UUID         │ FK → usuarios.id          │
│ id_jogo          │ VARCHAR(50)  │ (Referência ao MongoDB)   │
│ data_aquisicao   │ TIMESTAMP    │ DEFAULT CURRENT_TIMESTAMP │
│ preco_pago       │ DECIMAL(10,2)│                           │
│ tempo_jogado     │ INTEGER      │ DEFAULT 0 (minutos)       │
└──────────────────┴──────────────┴────────────────────────────┘

CONSTRAINT: UNIQUE (id_usuario, id_jogo)
            ↳ Usuário não pode ter mesmo jogo duplicado

ÍNDICES:
- idx_usuarios_email ON usuarios(email)
- idx_bibliotecas_usuario ON bibliotecas(id_usuario)
- idx_bibliotecas_jogo ON bibliotecas(id_jogo)

VIEW: estatisticas_usuario
SELECT u.nome, COUNT(b.id) as total_jogos, 
       SUM(b.tempo_jogado) as tempo_total,
       SUM(b.preco_pago) as valor_investido
FROM usuarios u LEFT JOIN bibliotecas b ON u.id = b.id_usuario
GROUP BY u.nome
```

---

## 📄 MODELO DE DADOS - MONGODB

```
Collection: games

┌─────────────────────────────────────────────────────────────────┐
│  Documento de Jogo (Estrutura Flexível)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  {                                                              │
│    "_id": ObjectId("..."),           // ID do MongoDB          │
│    "gameId": "the-witcher-3",        // ID único (string)      │
│    "nome": "The Witcher 3",                                    │
│    "descricao": "RPG de mundo aberto...",                      │
│    "preco": 89.99,                                             │
│    "desenvolvedora": "CD Projekt RED",                         │
│                                                                 │
│    "tags": [                          // Array de strings      │
│      "RPG",                                                     │
│      "Mundo Aberto",                                           │
│      "Fantasia"                                                │
│    ],                                                           │
│                                                                 │
│    "especificacoes": {                // Objeto aninhado       │
│      "minimo": {                                               │
│        "so": "Windows 7",                                      │
│        "processador": "Intel i5",                              │
│        "memoria": "6 GB RAM"                                   │
│      },                                                         │
│      "recomendado": {                                          │
│        "so": "Windows 10",                                     │
│        "processador": "Intel i7",                              │
│        "memoria": "8 GB RAM"                                   │
│      }                                                          │
│    },                                                           │
│                                                                 │
│    "dlcs": [                          // Array de objetos      │
│      {                                                          │
│        "nome": "Hearts of Stone",                              │
│        "preco": 29.99                                          │
│      },                                                         │
│      {                                                          │
│        "nome": "Blood and Wine",                               │
│        "preco": 39.99                                          │
│      }                                                          │
│    ],                                                           │
│                                                                 │
│    "avaliacao": {                                              │
│      "media": 4.8,                                             │
│      "total_votos": 125430                                     │
│    },                                                           │
│                                                                 │
│    "classificacao_etaria": "18",                               │
│    "ativo": true                                               │
│  }                                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

ÍNDICES:
- { "gameId": 1 } UNIQUE
- { "nome": "text", "descricao": "text" }  // Full-text search
- { "tags": 1 }
- { "preco": 1 }

NOTA: Cada documento pode ter campos diferentes!
      Jogo indie simples: só nome + preço
      Jogo AAA: todos campos acima + mais
```

---

## 🕸️ MODELO DE DADOS - NEO4J

```
                    Nodos e Relacionamentos

        ┌─────────────┐                    ┌─────────────┐
        │    User     │                    │    Game     │
        ├─────────────┤                    ├─────────────┤
        │ userId      │                    │ gameId      │
        │ name        │                    │ name        │
        └──────┬──────┘                    └──────┬──────┘
               │                                  │
               │                                  │
               │ [:FRIENDS_WITH]                 │
               │ {since: datetime}               │
               │                                  │
    ┌──────────▼──────────┐                     │
    │                     │                      │
    │  User1 ◄──────────► User2                 │
    │                     │                      │
    │  (bidirecional)     │                      │
    └─────────────────────┘                      │
                                                 │
                                                 │
                      [:OWNS]                   │
                      {acquiredAt: datetime}    │
                      {hoursPlayed: float}      │
                                                 │
                   ┌──────────────────────┐      │
                   │                      │      │
            User ──┴───────► Game        │◄──────┘
                   │                      │
                   │   (unidirecional)    │
                   └──────────────────────┘


EXEMPLO VISUAL DE GRAFO:

              João
               │
   FRIENDS_WITH│
               │
              ▼
            Maria ─────OWNS────→ Witcher3
              │                     ▲
   FRIENDS_WITH│                    │
              │                     │OWNS
              ▼                     │
            Pedro ──────────────────┘


QUERIES COMUNS:

1. Amigos diretos (1-hop):
   MATCH (João)-[:FRIENDS_WITH]-(amigo)
   
2. Amigos de amigos (2-hops):
   MATCH (João)-[:FRIENDS_WITH*2]-(amigoDoAmigo)
   
3. Recomendação:
   MATCH (João)-[:FRIENDS_WITH]-(amigo)-[:OWNS]->(jogo)
   WHERE NOT (João)-[:OWNS]->(jogo)
   RETURN jogo
```

---

## 🔄 FLUXO: COMPRA DE JOGO

```
Usuário: João Silva (id: abc-123)
Jogo: The Witcher 3 (gameId: the-witcher-3)
Preço: R$ 89.99

┌─────────────────────────────────────────────────────────────────┐
│ PASSO 1: Cliente (Front-end/Simulador) faz requisição          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ POST http://localhost:3001
                              │      /users/abc-123/library
                              │ Body: {
                              │   "id_jogo": "the-witcher-3",
                              │   "preco_pago": 89.99
                              │ }
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 2: servico-usuarios (Node.js)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 2A. Valida se jogo existe
                              │     GET http://servico-catalogo:3002
                              │         /catalog/the-witcher-3
                              ▼
                    ┌─────────────────┐
                    │ MongoDB         │
                    │ games collection│
                    │ ✓ Jogo existe   │
                    └─────────────────┘
                              │
                              │ 2B. Insere na biblioteca
                              ▼
                    ┌─────────────────────────────┐
                    │ PostgreSQL                  │
                    │ INSERT INTO bibliotecas (   │
                    │   id_usuario,               │
                    │   id_jogo,                  │
                    │   preco_pago                │
                    │ ) VALUES (                  │
                    │   'abc-123',                │
                    │   'the-witcher-3',          │
                    │   89.99                     │
                    │ )                           │
                    │                             │
                    │ ✓ COMMIT                    │
                    │ ✓ Trigger atualiza          │
                    │   usuarios.ultimo_acesso    │
                    └─────────────────────────────┘
                              │
                              │ 2C. Resposta ao cliente
                              │     201 Created
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 3: Cliente sincroniza com Neo4j                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ POST http://localhost:3003
                              │      /users/abc-123/games
                              │ Body: {
                              │   "gameId": "the-witcher-3",
                              │   "hoursPlayed": 0
                              │ }
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 4: servico-social (Node.js)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 4A. Cria relacionamento
                              ▼
                    ┌─────────────────────────────┐
                    │ Neo4j                       │
                    │ MATCH (u:User {             │
                    │   userId: 'abc-123'         │
                    │ })                          │
                    │ MATCH (g:Game {             │
                    │   gameId: 'the-witcher-3'   │
                    │ })                          │
                    │ MERGE (u)-[r:OWNS]->(g)     │
                    │ SET r.acquiredAt = now(),   │
                    │     r.hoursPlayed = 0       │
                    │                             │
                    │ ✓ Relacionamento criado     │
                    └─────────────────────────────┘
                              │
                              │ 4B. Resposta ao cliente
                              │     200 OK
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ RESULTADO FINAL                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ PostgreSQL:                                                     │
│   usuarios: [João | joao@email.com | ...]                     │
│   bibliotecas: [João | the-witcher-3 | R$89.99 | 0 min]       │
│                                                                 │
│ MongoDB:                                                        │
│   games: [{gameId: "the-witcher-3", nome: "...", ...}]        │
│                                                                 │
│ Neo4j:                                                          │
│   (João)-[:OWNS {acquiredAt: ..., hoursPlayed: 0}]            │
│         ->(Witcher3)                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤝 FLUXO: ADICIONAR AMIGO

```
Usuário: João (id: abc-123)
Amigo: Maria (id: def-456)

┌─────────────────────────────────────────────────────────────────┐
│ PASSO 1: Cliente faz requisição                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ POST http://localhost:3003
                              │      /users/abc-123/friends
                              │ Body: {
                              │   "friendId": "def-456"
                              │ }
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 2: servico-social (Node.js)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Cria relacionamento bidirecional
                              ▼
                    ┌─────────────────────────────┐
                    │ Neo4j                       │
                    │                             │
                    │ MATCH (u1:User {            │
                    │   userId: 'abc-123'         │
                    │ })                          │
                    │ MATCH (u2:User {            │
                    │   userId: 'def-456'         │
                    │ })                          │
                    │ WHERE u1 <> u2              │
                    │ MERGE (u1)-[r:FRIENDS_WITH] │
                    │           {since: now()}    │
                    │           -(u2)             │
                    │                             │
                    │ Resultado:                  │
                    │  (João)◄──────────►(Maria)  │
                    │    FRIENDS_WITH             │
                    │                             │
                    └─────────────────────────────┘
                              │
                              │ 200 OK
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ RESULTADO: Grafo atualizado                                    │
│                                                                 │
│     João ◄──────FRIENDS_WITH──────► Maria                      │
│      │                               │                          │
│      │                               │                          │
│      ├─OWNS→ Witcher3                ├─OWNS→ Cyberpunk         │
│      │                               │                          │
│      └─OWNS→ Stardew                 └─OWNS→ Witcher3          │
│                                                                 │
│ Agora João pode receber recomendações baseadas nos jogos       │
│ que Maria possui!                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 FLUXO: RECOMENDAÇÃO DE JOGOS

```
Usuário: João (tem: Stardew, Witcher3)
Quer: Recomendações

┌─────────────────────────────────────────────────────────────────┐
│ PASSO 1: Cliente solicita recomendações                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ GET http://localhost:3003
                              │     /users/abc-123/recommendations
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 2: servico-social executa query Cypher                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────────────┐
                    │ Neo4j - Query de Grafo      │
                    │                             │
                    │ Estrutura do Grafo:         │
                    │                             │
                    │     Pedro                   │
                    │      │                      │
                    │      │ OWNS                 │
                    │      ▼                      │
                    │  Cyberpunk ◄── OWNS ─ Ana   │
                    │      ▲                  │   │
                    │      │                  │   │
                    │      │ OWNS       OWNS  │   │
                    │      │                  ▼   │
                    │    Maria ─ FRIENDS ─► João  │
                    │      │                  │   │
                    │      │ OWNS       OWNS  │   │
                    │      ▼                  ▼   │
                    │   Hades           Witcher3  │
                    │                        │    │
                    │                  OWNS  │    │
                    │                        ▼    │
                    │                    Stardew  │
                    │                             │
                    │ Query Cypher:               │
                    │ MATCH (eu:User {            │
                    │   userId: 'abc-123'         │
                    │ })-[:FRIENDS_WITH]-(amigo)  │
                    │  -[owns:OWNS]->(jogo)       │
                    │ WHERE NOT (eu)-[:OWNS]      │
                    │           ->(jogo)          │
                    │   AND owns.hoursPlayed > 10 │
                    │ RETURN jogo.name,           │
                    │   count(amigo) AS qtd       │
                    │ ORDER BY qtd DESC           │
                    │                             │
                    └─────────────────────────────┘
                              │
                              │ Resultado:
                              │ [
                              │   {name: "Cyberpunk", qtd: 2},
                              │   {name: "Hades", qtd: 1}
                              │ ]
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PASSO 3: Enriquecer com dados do MongoDB                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Para cada jogo recomendado:
                              │ GET /catalog/cyberpunk-2077
                              │ GET /catalog/hades
                              ▼
                    ┌─────────────────────────────┐
                    │ MongoDB                     │
                    │ db.games.findOne({          │
                    │   gameId: "cyberpunk-2077"  │
                    │ })                          │
                    │                             │
                    │ Retorna: nome, preço,       │
                    │          descrição, etc     │
                    └─────────────────────────────┘
                              │
                              │ 200 OK
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ RESULTADO FINAL: Recomendações Personalizadas                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [                                                               │
│   {                                                             │
│     "gameId": "cyberpunk-2077",                                │
│     "nome": "Cyberpunk 2077",                                  │
│     "preco": 199.99,                                           │
│     "amigosQueJogam": ["Maria", "Pedro"],                      │
│     "razao": "2 amigos possuem e jogaram >10h"                 │
│   },                                                            │
│   {                                                             │
│     "gameId": "hades",                                         │
│     "nome": "Hades",                                           │
│     "preco": 49.99,                                            │
│     "amigosQueJogam": ["Maria"],                               │
│     "razao": "1 amigo possui e jogou >10h"                     │
│   }                                                             │
│ ]                                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🐳 INFRAESTRUTURA DOCKER

```
┌─────────────────────────────────────────────────────────────────┐
│                      docker-compose.yml                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  services:                                                      │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐    │
│    │  postgres:                                           │    │
│    │    image: postgres:15-alpine                         │    │
│    │    ports: 5432:5432                                  │    │
│    │    volumes:                                          │    │
│    │      - postgres_data:/var/lib/postgresql/data       │    │
│    │      - ./init-scripts/postgres:/docker-entrypoint.. │    │
│    │    healthcheck: pg_isready                           │    │
│    └─────────────────────────────────────────────────────┘    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐    │
│    │  mongodb:                                            │    │
│    │    image: mongo:7.0                                  │    │
│    │    ports: 27017:27017                                │    │
│    │    volumes:                                          │    │
│    │      - mongodb_data:/data/db                         │    │
│    │      - ./init-scripts/mongodb:/docker-entrypoint..  │    │
│    │    healthcheck: mongosh ping                         │    │
│    └─────────────────────────────────────────────────────┘    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐    │
│    │  neo4j:                                              │    │
│    │    image: neo4j:5.14-community                       │    │
│    │    ports: 7474:7474, 7687:7687                       │    │
│    │    volumes:                                          │    │
│    │      - neo4j_data:/data                              │    │
│    │    healthcheck: cypher-shell RETURN 1                │    │
│    └─────────────────────────────────────────────────────┘    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐    │
│    │  servico-usuarios:                                   │    │
│    │    build: ./servico-usuarios                         │    │
│    │    ports: 3001:3001                                  │    │
│    │    depends_on:                                       │    │
│    │      postgres: {condition: service_healthy}          │    │
│    └─────────────────────────────────────────────────────┘    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐    │
│    │  servico-catalogo:                                   │    │
│    │    build: ./servico-catalogo                         │    │
│    │    ports: 3002:3002                                  │    │
│    │    depends_on:                                       │    │
│    │      mongodb: {condition: service_healthy}           │    │
│    └─────────────────────────────────────────────────────┘    │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐    │
│    │  servico-social:                                     │    │
│    │    build: ./servico-social                           │    │
│    │    ports: 3003:3003                                  │    │
│    │    depends_on:                                       │    │
│    │      neo4j: {condition: service_healthy}             │    │
│    └─────────────────────────────────────────────────────┘    │
│                                                                 │
│  volumes:                                                       │
│    postgres_data:   # Persistência de dados                    │
│    mongodb_data:                                               │
│    neo4j_data:                                                 │
│                                                                 │
│  networks:                                                      │
│    ministeam-network:  # Rede interna para comunicação        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

CICLO DE VIDA:

1. docker-compose up -d --build
   └─► Cria rede ministeam-network
   └─► Cria volumes persistentes
   └─► Inicia bancos de dados
   └─► Aguarda healthchecks
   └─► Inicia microsserviços
   └─► Sistema pronto para uso

2. docker-compose down
   └─► Para containers
   └─► Remove containers
   └─► Mantém volumes (dados preservados)

3. docker-compose down -v
   └─► Para containers
   └─► Remove containers
   └─► DELETA volumes (reset completo!)
```

---

## 📊 COMPARAÇÃO: QUANDO USAR CADA BANCO

```
┌────────────────────────────────────────────────────────────────────┐
│                    MATRIZ DE DECISÃO                               │
├────────────────┬──────────────┬──────────────┬─────────────────────┤
│ Característica │ PostgreSQL   │ MongoDB      │ Neo4j               │
├────────────────┼──────────────┼──────────────┼─────────────────────┤
│ Tipo de Dados  │ Estruturados │ Semi-        │ Altamente           │
│                │ e fixos      │ estruturados │ conectados          │
├────────────────┼──────────────┼──────────────┼─────────────────────┤
│ Transações     │ ACID forte   │ ACID (v4.0+) │ ACID                │
│                │ ✅✅✅       │ ✅✅         │ ✅✅                │
├────────────────┼──────────────┼──────────────┼─────────────────────┤
│ Flexibilidade  │ Baixa        │ Alta         │ Média               │
│                │ (schema fixo)│ (schema free)│ (nodos + edges)     │
├────────────────┼──────────────┼──────────────┼─────────────────────┤
│ Relacionamentos│ JOINs        │ Embeddings   │ Nativo              │
│                │ (complexos)  │ ou refs      │ (O(k) performance)  │
├────────────────┼──────────────┼──────────────┼─────────────────────┤
│ Consultas de   │ ⚠️ Lento     │ ⚠️ Muito     │ ✅ Extremamente    │
│ Grafo          │ (self-joins) │ lento        │ rápido              │
├────────────────┼──────────────┼──────────────┼─────────────────────┤
│ Escalabilidade │ Vertical     │ Horizontal   │ Horizontal          │
│                │ (maior srv)  │ (sharding)   │ (clustering)        │
├────────────────┼──────────────┼──────────────┼─────────────────────┤
│ Uso no Projeto │ Usuários +   │ Catálogo de  │ Rede social +       │
│                │ Bibliotecas  │ Jogos        │ Recomendações       │
└────────────────┴──────────────┴──────────────┴─────────────────────┘

REGRAS DE OURO:

✅ Use PostgreSQL quando:
   • Precisa de ACID forte (compras, pagamentos)
   • Dados têm estrutura fixa (usuário sempre tem email)
   • Precisa de integridade referencial (foreign keys)
   • Exemplo: Sistemas bancários, e-commerce, ERPs

✅ Use MongoDB quando:
   • Schema varia muito entre documentos
   • Tem dados aninhados complexos (JSON)
   • Prioriza leitura sobre escrita
   • Exemplo: Catálogos de produtos, CMS, logs

✅ Use Neo4j quando:
   • Dados são altamente conectados
   • Precisa fazer queries de relacionamento
   • Recomendações baseadas em grafo social
   • Exemplo: Redes sociais, detecção de fraude, rotas
```

---

## 🎓 RESUMO VISUAL FINAL

```
╔══════════════════════════════════════════════════════════════════╗
║               MINI-STEAM: PERSISTÊNCIA POLIGLOTA                 ║
╚══════════════════════════════════════════════════════════════════╝

    🎯 CONCEITO CENTRAL
    ────────────────────
    Usar o banco de dados CERTO para o tipo de dado CERTO

    
    📊 OS 3 PILARES
    ───────────────
    
    PostgreSQL          MongoDB             Neo4j
    (Relacional)        (Documentos)        (Grafos)
         │                   │                  │
         │                   │                  │
         ▼                   ▼                  ▼
    TRANSAÇÕES         FLEXIBILIDADE      RELACIONAMENTOS
      ACID                SCHEMA           COMPLEXOS
         │                   │                  │
         │                   │                  │
         ▼                   ▼                  ▼
    Usuários +         Catálogo de         Rede Social +
    Bibliotecas           Jogos           Recomendações
    

    🔄 FLUXO DE DADOS
    ─────────────────
    
    1. Usuário compra jogo
       └─► PostgreSQL: Registra compra (ACID)
       └─► Neo4j: Relacionamento OWNS (Recomendações)
    
    2. Usuário adiciona amigo
       └─► Neo4j: FRIENDS_WITH (Grafo social)
    
    3. Sistema recomenda jogos
       └─► Neo4j: Query de grafo (amigos → jogos)
       └─► MongoDB: Busca detalhes (catálogo)
    

    ✨ VANTAGENS
    ────────────
    ✅ Performance otimizada por caso de uso
    ✅ Escalabilidade independente
    ✅ Tecnologia certa para cada problema
    ✅ Isolamento de falhas
    

    ⚠️ DESAFIOS
    ───────────
    ❌ Maior complexidade
    ❌ Consistência eventual
    ❌ Mais infraestrutura
    ❌ Sincronização manual


╔══════════════════════════════════════════════════════════════════╗
║  MENSAGEM FINAL: Não existe banco de dados perfeito para tudo!  ║
║  A arte está em escolher o certo para cada situação. 🎨         ║
╚══════════════════════════════════════════════════════════════════╝
```

---

**FIM DOS DIAGRAMAS VISUAIS** 📊✨

Para mais detalhes, consulte:
- **GUIA_DE_ESTUDOS.md** - Material completo
- **COLA_RAPIDA.md** - Referência rápida
- **PERGUNTAS_E_RESPOSTAS.md** - 50+ Q&As
