# Mini-Steam: Plataforma de Distribuição de Jogos
## Projeto de Persistência Poliglota

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)
[![Neo4j](https://img.shields.io/badge/Neo4j-5.14-cyan.svg)](https://neo4j.com/)

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Justificativas Técnicas](#justificativas-técnicas)
4. [Modelagem de Dados](#modelagem-de-dados)
5. [APIs e Microsserviços](#apis-e-microsserviços)
6. [Como Executar o Projeto](#como-executar-o-projeto)
7. [Estrutura do Repositório](#estrutura-do-repositório)
8. [Verificação e Testes](#verificação-e-testes)

---

## 🎯 Visão Geral

**Mini-Steam** é uma plataforma simplificada de distribuição de jogos que demonstra o conceito de **Persistência Poliglota** através do uso estratégico de três bancos de dados diferentes, cada um escolhido pela natureza específica dos dados que armazena.

### Tema Escolhido
Uma loja digital de jogos inspirada na Steam, com funcionalidades de:
- 👤 **Gerenciamento de Usuários e Bibliotecas**
- 🎮 **Catálogo de Jogos**
- 👥 **Rede Social e Sistema de Recomendações**

### Objetivo Acadêmico
Este projeto atende aos requisitos de estudo de **armazenamento poliglota**, demonstrando como diferentes tipos de bancos de dados podem coexistir em uma arquitetura de microsserviços, cada um otimizado para seu caso de uso específico.

---

## 🏗️ Arquitetura do Sistema

### Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    S1 (Cliente/Simulador)                    │
│              Gera dados e faz requisições REST               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  S2 (Backend - Microsserviços)               │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Serviço de  │  │  Serviço de  │  │  Serviço     │      │
│  │  Usuários    │  │  Catálogo    │  │  Social      │      │
│  │  (Port 3001) │  │  (Port 3002) │  │  (Port 3003) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ PostgreSQL   │  │   MongoDB    │  │    Neo4j     │
  │   (RDB)      │  │  (Document)  │  │   (Graph)    │
  │  Port 5432   │  │  Port 27017  │  │  Port 7687   │
  └──────────────┘  └──────────────┘  └──────────────┘
```

### Definição dos Serviços

#### **S1 - Simulador Cliente**
- **Função**: Gera dados fictícios e simula requisições
- **Responsabilidades**:
  - Criar 10 usuários
  - Criar 20 jogos no catálogo
  - Simular 50 pedidos de amizade
  - Simular 100 compras de jogos
  - Salvar log de verificação local

#### **S2 - Backend (Microsserviços)**

**Microsserviço 1: servico-usuarios**
- **Porta**: 3001
- **Banco**: PostgreSQL
- **Responsabilidade**: Gerencia usuários e bibliotecas de jogos

**Microsserviço 2: servico-catalogo**
- **Porta**: 3002
- **Banco**: MongoDB
- **Responsabilidade**: Gerencia o catálogo de jogos

**Microsserviço 3: servico-social**
- **Porta**: 3003
- **Banco**: Neo4j
- **Responsabilidade**: Gerencia rede social e recomendações

---

## 🔍 Justificativas Técnicas

### 1️⃣ PostgreSQL (Banco Relacional) - Usuários e Bibliotecas

#### Justificativa Técnica

O **PostgreSQL** foi escolhido para armazenar dados de **Usuários** e **Bibliotecas** devido às seguintes características críticas:

**a) Propriedades ACID**
- **Atomicidade**: Quando um usuário adquire um jogo, a transação deve ser atômica. Se qualquer etapa falhar (validação, inserção, confirmação), toda a operação é revertida.
- **Consistência**: Garante que o banco nunca esteja em estado inconsistente, essencial para dados financeiros (compras).
- **Isolamento**: Múltiplas compras simultâneas não interferem entre si.
- **Durabilidade**: Uma vez confirmada, a compra é permanente e sobrevive a falhas.

**b) Integridade Referencial**
```sql
CONSTRAINT fk_usuario 
    FOREIGN KEY (id_usuario) 
    REFERENCES usuarios(id) 
    ON DELETE CASCADE
```
As chaves estrangeiras garantem que:
- Não existam bibliotecas sem usuário válido
- Cascatas automáticas mantêm consistência
- Constraints evitam duplicação (um usuário não pode ter o mesmo jogo duas vezes)

**c) Dados Estruturados e Previsíveis**
- Esquema de autenticação (email, senha_hash) é fixo e bem definido
- Índices em email permitem login O(log n)
- Estrutura relacional é ideal para consultas como "quantos jogos o usuário X possui?"

**d) Transações Complexas**
Operações como "comprar jogo" podem envolver:
1. Validar saldo/permissão
2. Inserir na biblioteca
3. Atualizar estatísticas
4. Registrar log de auditoria

PostgreSQL gerencia isso atomicamente com `BEGIN`, `COMMIT`, `ROLLBACK`.

**e) Conformidade e Auditoria**
- Dados de usuários estão sujeitos a LGPD/GDPR
- PostgreSQL oferece:
  - Logging detalhado
  - Backup point-in-time
  - Replicação para alta disponibilidade

---

### 2️⃣ MongoDB (Document Store) - Catálogo de Jogos

#### Justificativa Técnica

O **MongoDB** foi selecionado para o **Catálogo de Jogos** devido à natureza variável e complexa das informações de cada jogo:

**a) Esquema Flexível (Schema-less)**

Cada jogo tem metadados únicos:
- Jogos AAA: `dlcs`, `requisitos_sistema`, `achievements`, `multiplayer_info`
- Jogos indie: apenas informações básicas
- Jogos VR: campos específicos como `vr_platforms`, `comfort_rating`

Em um banco relacional, isso exigiria:
- Múltiplas tabelas com muitos campos NULL
- Estruturas EAV (Entity-Attribute-Value) complexas
- JOINs custosos para reconstruir um jogo completo

MongoDB permite que cada documento tenha sua própria estrutura sem desperdício.

**b) Dados Aninhados e Arrays**

Exemplo de estrutura natural em MongoDB:
```json
{
  "nome": "The Witcher 3",
  "tags": ["RPG", "Mundo Aberto", "Fantasia"],
  "especificacoes": {
    "minimo": { "cpu": "i5", "ram": "6GB" },
    "recomendado": { "cpu": "i7", "ram": "8GB" }
  },
  "dlcs": [
    { "nome": "Hearts of Stone", "preco": 29.99 },
    { "nome": "Blood and Wine", "preco": 39.99 }
  ]
}
```

Em SQL, isso exigiria 4-5 tabelas relacionadas com múltiplos JOINs.

**c) Performance de Leitura**

Uma página de loja precisa de **todas** as informações de um jogo:
- MongoDB: `db.games.findOne({ gameId: "..." })` → **1 operação**, documento completo
- PostgreSQL: JOIN entre 5+ tabelas → **operação complexa**, múltiplos I/Os

Para catálogos com milhões de produtos, isso é crítico.

**d) Escalabilidade Horizontal (Sharding)**

À medida que o catálogo cresce (10.000+ jogos), MongoDB permite:
- Sharding por `gameId` ou `genero`
- Distribuição automática entre servidores
- Queries paralelas em múltiplos shards

**e) Indexação Avançada**

MongoDB suporta:
- **Índices de texto**: Busca full-text em descrições
  ```javascript
  db.games.createIndex({ "nome": "text", "descricao": "text" })
  ```
- **Índices em arrays**: Buscar por tags
  ```javascript
  db.games.find({ "tags": "RPG" }) // Usa índice mesmo sendo array
  ```
- **Índices em campos aninhados**: 
  ```javascript
  db.games.createIndex({ "especificacoes.minimo.ram": 1 })
  ```

---

### 3️⃣ Neo4j (Graph Database) - Rede Social e Recomendações

#### Justificativa Técnica

O **Neo4j** foi escolhido para **Rede Social** e **Sistema de Recomendações** devido à natureza altamente conectada dos dados:

**a) Modelagem Natural de Relacionamentos**

Em redes sociais, **relacionamentos são dados de primeira classe**, não tabelas de junção:

```cypher
(:User)-[:FRIENDS_WITH]->(:User)
(:User)-[:OWNS]->(:Game)
```

Isso torna o modelo conceitual **idêntico** ao modelo físico, eliminando impedância.

**b) Eficiência em Traversals de Grafos**

**Exemplo 1: Recomendações**
```cypher
MATCH (me:User {userId: '123'})-[:FRIENDS_WITH]-(friend)-[:OWNS]->(game)
WHERE NOT (me)-[:OWNS]->(game)
RETURN game
```

- **Neo4j**: O(k) onde k = número de relacionamentos (índices de adjacência nativos)
- **SQL**: O(n²) ou pior (self-joins recursivos)

**Performance Comparativa:**
| Operação | PostgreSQL (SQL) | Neo4j (Cypher) |
|----------|------------------|----------------|
| "Amigos de um usuário" | JOIN simples | Traversal O(k) |
| "Amigos de amigos" | Self-JOIN recursivo | 2-hop traversal |
| "Jogos que amigos jogam" | 3+ JOINs | Path query |

**Exemplo 2: Amigos de Amigos (2-hops)**
```cypher
MATCH (me:User {userId: '123'})-[:FRIENDS_WITH*2]-(friend_of_friend)
WHERE me <> friend_of_friend
RETURN DISTINCT friend_of_friend
```

SQL equivalente exigiria CTEs recursivas complexas.

**c) Linguagem Cypher Declarativa**

Consultas complexas são expressas intuitivamente:

```cypher
// Recomendar jogos que meus amigos jogaram muito
MATCH (me:User {userId: '123'})-[:FRIENDS_WITH]-(friend)-[owns:OWNS]->(game)
WHERE owns.hoursPlayed > 50 AND NOT (me)-[:OWNS]->(game)
RETURN game.name, avg(owns.hoursPlayed) as avgHours
ORDER BY avgHours DESC
```

Isso é **muito mais legível** que o SQL equivalente.

**d) Algoritmos de Grafos Nativos**

Neo4j oferece bibliotecas otimizadas:
- **PageRank**: Encontrar usuários influentes
- **Community Detection**: Agrupar usuários por interesses
- **Shortest Path**: Conexões entre usuários
- **Collaborative Filtering**: Recomendações avançadas

**e) Performance em Escala**

Para redes com milhões de usuários:
- **Neo4j**: Performance constante O(k) em queries de relacionamento
- **PostgreSQL**: Degrada para O(n²) ou O(n³) em JOINs recursivos

**Exemplo Prático:**
- 1 milhão de usuários
- Média de 100 amigos cada
- Query: "Jogos que amigos de amigos jogam"
  - Neo4j: ~10ms (traversal de 2-hops)
  - PostgreSQL: ~5000ms (self-joins recursivos)

---

## 📊 Modelagem de Dados

### PostgreSQL - Schema Relacional

```sql
-- Tabela de Usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Bibliotecas
CREATE TABLE bibliotecas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    id_jogo VARCHAR(50) NOT NULL,
    data_aquisicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preco_pago DECIMAL(10, 2),
    tempo_jogado INTEGER DEFAULT 0,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT unique_usuario_jogo UNIQUE (id_usuario, id_jogo)
);
```

### MongoDB - Documento de Jogo

```json
{
  "_id": "game_001",
  "gameId": "the-witcher-3",
  "nome": "The Witcher 3: Wild Hunt",
  "descricao": "RPG de mundo aberto épico",
  "preco": 89.99,
  "desenvolvedora": "CD Projekt RED",
  "tags": ["RPG", "Mundo Aberto", "Fantasia"],
  "especificacoes": {
    "minimo": {
      "so": "Windows 7",
      "processador": "Intel i5",
      "memoria": "6 GB RAM"
    },
    "recomendado": {
      "so": "Windows 10",
      "processador": "Intel i7",
      "memoria": "8 GB RAM"
    }
  },
  "avaliacao": {
    "media": 4.8,
    "total_votos": 125430
  }
}
```

### Neo4j - Modelo de Grafo

**Nodos:**
```cypher
(:User {userId: string, name: string})
(:Game {gameId: string, name: string})
```

**Relacionamentos:**
```cypher
(:User)-[:FRIENDS_WITH {since: datetime}]->(:User)
(:User)-[:OWNS {acquiredAt: datetime, hoursPlayed: float}]->(:Game)
```

**Query de Recomendação:**
```cypher
MATCH (me:User {userId: '123'})-[:FRIENDS_WITH]-(friend)-[:OWNS]->(game)
WHERE NOT (me)-[:OWNS]->(game)
RETURN game.name, count(friend) AS friendsWhoOwn
ORDER BY friendsWhoOwn DESC
LIMIT 10
```

---

## 🔌 APIs e Microsserviços

### Microsserviço de Usuários (Port 3001)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/users` | Criar novo usuário |
| GET | `/users/:id` | Buscar usuário |
| GET | `/users/:id/library` | Listar biblioteca |
| POST | `/users/:id/library` | Adicionar jogo (compra) |

### Microsserviço de Catálogo (Port 3002)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/catalog` | Adicionar jogo ao catálogo |
| GET | `/catalog` | Listar jogos (com filtros) |
| GET | `/catalog/:gameId` | Detalhes do jogo |

### Microsserviço Social (Port 3003)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/users/:id/friends` | Adicionar amigo |
| GET | `/users/:id/friends` | Listar amigos |
| GET | `/users/:id/recommendations` | Obter recomendações |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Docker** e **Docker Compose** instalados
- **Node.js 18+** (para executar S1 localmente)
- **Git** para clonar o repositório

### Passos de Execução

#### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/mini-steam.git
cd mini-steam
```

#### 2. Iniciar os Bancos de Dados e Microsserviços (S2)

```bash
# Inicia todos os containers (bancos + microsserviços)
docker-compose up -d

# Verificar status dos containers
docker-compose ps

# Visualizar logs (opcional)
docker-compose logs -f
```

**Aguarde ~30 segundos** para que todos os serviços estejam prontos.

#### 3. Verificar Conectividade

```bash
# Teste de saúde dos microsserviços
curl http://localhost:3001/health  # Usuários
curl http://localhost:3002/health  # Catálogo
curl http://localhost:3003/health  # Social
```

#### 4. Executar o Simulador S1

```bash
cd servico-s1
npm install
npm start
```

O simulador irá:
1. ✅ Criar 10 usuários
2. ✅ Criar 20 jogos no catálogo
3. ✅ Sincronizar dados com Neo4j
4. ✅ Criar 50 amizades
5. ✅ Simular 100 compras
6. ✅ Consultar recomendações
7. ✅ Salvar `s1_verification_log.json`

#### 5. Verificar Resultados

```bash
# Ver log de verificação
cat servico-s1/s1_verification_log.json

# Acessar Neo4j Browser (interface web)
# URL: http://localhost:7474
# Usuário: neo4j
# Senha: ministeam123
```

#### 6. Parar o Projeto

```bash
# Parar todos os containers
docker-compose down

# Parar E remover volumes (limpa dados)
docker-compose down -v
```

---

## 📁 Estrutura do Repositório

```
mini-steam/
├── docker-compose.yml           # Orquestração de todos os serviços
├── README.md                    # Este arquivo
│
├── init-scripts/                # Scripts de inicialização dos bancos
│   ├── postgres/
│   │   └── 01-init-db.sql
│   └── mongodb/
│       └── 01-init-db.js
│
├── servico-usuarios/            # Microsserviço 1 (PostgreSQL)
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── .env
│
├── servico-catalogo/            # Microsserviço 2 (MongoDB)
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── .env
│
├── servico-social/              # Microsserviço 3 (Neo4j)
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── .env
│
└── servico-s1/                  # Cliente Simulador
    ├── package.json
    ├── simulator.js
    └── s1_verification_log.json  # Gerado após execução
```

---

## ✅ Verificação e Testes

### Verificação Manual

#### 1. PostgreSQL

```bash
# Conectar ao PostgreSQL
docker exec -it ministeam-postgres psql -U ministeam -d ministeam_db

# Consultas de verificação
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM bibliotecas;
SELECT * FROM estatisticas_usuario LIMIT 5;
```

#### 2. MongoDB

```bash
# Conectar ao MongoDB
docker exec -it ministeam-mongodb mongosh -u ministeam -p ministeam123

# Consultas de verificação
use ministeam_catalog
db.games.countDocuments()
db.games.find().limit(3)
```

#### 3. Neo4j

Acesse http://localhost:7474 e execute:

```cypher
// Contar usuários e jogos
MATCH (u:User) RETURN count(u) AS totalUsuarios
MATCH (g:Game) RETURN count(g) AS totalJogos

// Visualizar rede social
MATCH path = (:User)-[:FRIENDS_WITH]-(:User)
RETURN path
LIMIT 50

// Ver recomendações de um usuário
MATCH (me:User)-[:FRIENDS_WITH]-(friend)-[:OWNS]->(game)
WHERE NOT (me)-[:OWNS]->(game)
RETURN game.name, count(friend) AS friendsWhoOwn
ORDER BY friendsWhoOwn DESC
LIMIT 10
```

### Arquivo de Verificação (s1_verification_log.json)

Após executar S1, o arquivo contém:
```json
{
  "timestamp": "2025-11-03T...",
  "summary": {
    "totalRequests": 180,
    "successfulRequests": 175,
    "failedRequests": 5
  },
  "operations": [
    {
      "timestamp": "...",
      "type": "CREATE_USER",
      "endpoint": "/users",
      "request": { "nome": "João Silva", ... },
      "response": { "success": true, "data": {...} },
      "status": "SUCCESS"
    }
  ]
}
```

---

## 🎓 Conclusão Acadêmica

Este projeto demonstra com sucesso o conceito de **Persistência Poliglota**, onde:

1. **PostgreSQL** gerencia dados críticos transacionais (usuários, compras)
2. **MongoDB** oferece flexibilidade para catálogos complexos
3. **Neo4j** otimiza consultas de relacionamento (rede social, recomendações)

Cada banco foi escolhido **estrategicamente** baseado nas características dos dados e nos requisitos de acesso, demonstrando que **não existe um banco de dados único ideal** - a escolha correta depende do caso de uso específico.

---

## 👨‍💻 Autores

Gustavo Bertoluzzi Cardoso R.a 22.123.016-2
Isabella Vieira Silva Rosseto R.a 22.222.036-0
Humberto de Oliveira Pellegrini R.a 22.224.019-4
---

## 📚 Referências

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Neo4j Developer Guide](https://neo4j.com/developer/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Martin Fowler - Polyglot Persistence](https://martinfowler.com/bliki/PolyglotPersistence.html)
