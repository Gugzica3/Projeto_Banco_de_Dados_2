# 📚 GUIA DE ESTUDOS COMPLETO - MINI-STEAM
## Material de Preparação para Prova - Banco de Dados 2

---

## 🎯 RESUMO EXECUTIVO - LEIA ISTO PRIMEIRO!

### O que é este projeto?
Uma **plataforma simplificada de distribuição de jogos** (tipo Steam) que demonstra **Persistência Poliglota** - o uso de múltiplos tipos de bancos de dados em uma mesma aplicação.

### Conceito Central: Persistência Poliglota
**Definição**: Usar diferentes bancos de dados para diferentes tipos de dados na mesma aplicação, escolhendo cada um baseado em suas características específicas.

**Por que usar?**
- Não existe "um banco de dados perfeito para tudo"
- Cada tipo de dado tem necessidades diferentes
- Performance otimizada para cada caso de uso
- Escalabilidade específica para cada domínio

### Os 3 Bancos de Dados do Projeto

| Banco | Tipo | Usado Para | Por Quê? |
|-------|------|-----------|----------|
| **PostgreSQL** | Relacional (SQL) | Usuários e Bibliotecas | Transações ACID, Integridade Referencial |
| **MongoDB** | Documentos (NoSQL) | Catálogo de Jogos | Esquema Flexível, Dados Aninhados |
| **Neo4j** | Grafos (NoSQL) | Rede Social | Relacionamentos Complexos, Recomendações |

---

## 📖 PARTE 1: CONCEITOS FUNDAMENTAIS

### 1.1 O que é ACID? (PostgreSQL)

**ACID** são as propriedades que garantem confiabilidade em transações:

#### **A - Atomicidade**
- **Definição**: Transação é "tudo ou nada"
- **Exemplo prático**: Quando um usuário compra um jogo:
  ```
  1. Validar que o jogo existe ✓
  2. Verificar se usuário já possui ✓
  3. Inserir na biblioteca ✓
  4. Atualizar último acesso ✓
  ```
  Se QUALQUER passo falhar → TODA operação é cancelada (rollback)
  
- **Por que é importante?**: Evita dados inconsistentes (ex: desconto do saldo sem adicionar o jogo)

#### **C - Consistência**
- **Definição**: Banco sempre em estado válido
- **Exemplo**: Constraints garantem que:
  - Email é único (não pode ter dois usuários com mesmo email)
  - Email tem formato válido (@dominio.com)
  - Usuário não pode ter mesmo jogo duas vezes (UNIQUE constraint)
  
#### **I - Isolamento**
- **Definição**: Transações simultâneas não interferem entre si
- **Exemplo**: 100 usuários comprando jogos ao mesmo tempo não causam conflitos
  
#### **D - Durabilidade**
- **Definição**: Dado gravado é permanente (sobrevive a crashes)
- **Exemplo**: Compra confirmada permanece mesmo se servidor reiniciar

### 1.2 Integridade Referencial (PostgreSQL)

**O que é?** Garantir que relacionamentos entre tabelas sejam válidos.

**Exemplo no código:**
```sql
CONSTRAINT fk_usuario 
    FOREIGN KEY (id_usuario) 
    REFERENCES usuarios(id) 
    ON DELETE CASCADE
```

**O que isso faz?**
- `FOREIGN KEY`: Garante que `id_usuario` sempre aponte para um usuário real
- `ON DELETE CASCADE`: Se deletar usuário, deleta automaticamente sua biblioteca
- **Impossível** ter biblioteca sem usuário válido

**Por que é importante?**
- ✅ Previne órfãos (dados sem referência)
- ✅ Mantém consistência automática
- ✅ Evita bugs de dados inválidos

### 1.3 Schema Flexível (MongoDB)

**Problema com SQL tradicional:**
- Todos registros têm mesmos campos
- Campos vazios → muito desperdício (NULLs)
- Adicionar campo novo → alterar toda tabela

**Solução MongoDB:**
Cada documento (registro) pode ter estrutura diferente!

**Exemplo Real:**

```json
// Jogo AAA (complexo)
{
  "gameId": "cyberpunk-2077",
  "nome": "Cyberpunk 2077",
  "preco": 199.99,
  "dlcs": [
    {"nome": "Phantom Liberty", "preco": 99.99}
  ],
  "requisitos": {
    "minimo": {"cpu": "i5", "ram": "8GB"},
    "recomendado": {"cpu": "i7", "ram": "16GB"}
  },
  "achievements": 150,
  "multiplayer": {"modos": ["PvP", "Co-op"]}
}

// Jogo Indie (simples)
{
  "gameId": "stardew-valley",
  "nome": "Stardew Valley",
  "preco": 24.99
  // Sem DLCs, sem multiplayer, sem achievements
}
```

**Vantagens:**
- ✅ Sem desperdício (só campos necessários)
- ✅ Fácil evoluir (adiciona campos sem migração)
- ✅ 1 query busca documento completo (sem JOINs)

### 1.4 Bancos de Grafos (Neo4j)

**Diferença fundamental:** Relacionamentos são "cidadãos de primeira classe"

**SQL tradicional:**
```sql
-- Tabela de junção (relação é apenas linha em tabela)
CREATE TABLE amizades (
  usuario1_id UUID,
  usuario2_id UUID
);
```

**Neo4j (Cypher):**
```cypher
// Relação é objeto visual e direto
(João)-[:FRIENDS_WITH]->(Maria)
```

**Queries de Grafo - Exemplos:**

#### Query 1: Jogos que meus amigos jogam (mas eu não)
```cypher
MATCH (eu:User {userId: '123'})-[:FRIENDS_WITH]-(amigo)-[:OWNS]->(jogo)
WHERE NOT (eu)-[:OWNS]->(jogo)
RETURN jogo.name, count(amigo) AS quantosAmigos
ORDER BY quantosAmigos DESC
```

**Em português:**
1. Pegue EU
2. Pegue meus AMIGOS
3. Pegue JOGOS que meus amigos POSSUEM
4. FILTRE: apenas jogos que EU NÃO possuo
5. CONTE quantos amigos têm cada jogo
6. ORDENE por popularidade

**Equivalente SQL:**
```sql
-- Muito mais complexo e lento!
SELECT j.nome, COUNT(DISTINCT a.id_usuario) as quantos_amigos
FROM jogos j
JOIN bibliotecas b ON j.id = b.id_jogo
JOIN amizades a ON b.id_usuario IN (a.usuario1_id, a.usuario2_id)
WHERE a.usuario1_id = '123' OR a.usuario2_id = '123'
  AND NOT EXISTS (
    SELECT 1 FROM bibliotecas b2 
    WHERE b2.id_usuario = '123' AND b2.id_jogo = j.id
  )
GROUP BY j.nome
ORDER BY quantos_amigos DESC;
```

**Performance:**
- **Neo4j**: O(k) onde k = número de relacionamentos diretos
- **SQL**: O(n²) com self-joins recursivos

---

## 📐 PARTE 2: ARQUITETURA DO SISTEMA

### 2.1 Visão Geral

```
┌─────────────────────────────────────────┐
│  S1: Simulador (Python)                 │
│  - Gera dados fictícios                 │
│  - Simula requisições REST              │
└──────────────┬──────────────────────────┘
               │ HTTP REST
               ▼
┌─────────────────────────────────────────┐
│  S2: Backend (3 Microsserviços Node.js) │
│                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │Usuários  │ │Catálogo  │ │Social    ││
│  │:3001     │ │:3002     │ │:3003     ││
│  └────┬─────┘ └────┬─────┘ └────┬─────┘│
└───────┼────────────┼────────────┼───────┘
        │            │            │
        ▼            ▼            ▼
   PostgreSQL     MongoDB       Neo4j
```

### 2.2 Detalhamento dos Serviços

#### **S1 - Simulador Cliente (Python)**

**O que faz?**
1. Cria 10 usuários
2. Cria 20 jogos no catálogo
3. Sincroniza dados com Neo4j
4. Cria 50 amizades aleatórias
5. Simula 100 compras de jogos
6. Gera `s1_verification_log.json`

**Por que Python?**
- Script de teste/simulação
- Biblioteca `requests` para HTTP
- Geração de dados fictícios com `random`

**Arquivo principal:** `servico-s1/simulator.py`

#### **S2 - Backend (Microsserviços Node.js)**

**Microsserviço 1: servico-usuarios (Porta 3001)**
- **Banco:** PostgreSQL
- **Responsabilidade:** CRUD de usuários e bibliotecas
- **APIs principais:**
  - `POST /users` - Criar usuário
  - `GET /users/:id` - Buscar usuário
  - `GET /users/:id/library` - Ver biblioteca
  - `POST /users/:id/library` - Adicionar jogo (compra)

**Microsserviço 2: servico-catalogo (Porta 3002)**
- **Banco:** MongoDB
- **Responsabilidade:** Gerenciar catálogo de jogos
- **APIs principais:**
  - `POST /catalog` - Adicionar jogo
  - `GET /catalog` - Listar jogos
  - `GET /catalog/:gameId` - Detalhes do jogo

**Microsserviço 3: servico-social (Porta 3003)**
- **Banco:** Neo4j
- **Responsabilidade:** Rede social e recomendações
- **APIs principais:**
  - `POST /users/:id/friends` - Adicionar amigo
  - `GET /users/:id/friends` - Listar amigos
  - `GET /users/:id/recommendations` - Recomendações

### 2.3 Por que Microsserviços?

**Vantagens:**
1. **Isolamento**: Falha em um serviço não derruba outros
2. **Escalabilidade Independente**: Catálogo pode ter 10 servidores, usuários apenas 2
3. **Tecnologia Específica**: Cada serviço usa banco ideal para seus dados
4. **Desenvolvimento Paralelo**: Times diferentes podem trabalhar em cada serviço

**Desvantagens (aceitas no projeto):**
- Complexidade de comunicação
- Múltiplas requisições para operações completas
- Consistência eventual (não imediata)

---

## 🗄️ PARTE 3: MODELAGEM DE DADOS DETALHADA

### 3.1 PostgreSQL - Modelo Relacional

#### Schema Completo:

```sql
-- TABELA: usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- TABELA: bibliotecas
CREATE TABLE bibliotecas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    id_jogo VARCHAR(50) NOT NULL,  -- Referência ao MongoDB
    data_aquisicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preco_pago DECIMAL(10, 2),
    tempo_jogado INTEGER DEFAULT 0,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE (id_usuario, id_jogo)  -- Um usuário não pode ter jogo duplicado
);
```

#### Índices Criados:

```sql
-- Performance em login
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Performance em listagem de biblioteca
CREATE INDEX idx_bibliotecas_usuario ON bibliotecas(id_usuario);

-- Performance em queries de jogo específico
CREATE INDEX idx_bibliotecas_jogo ON bibliotecas(id_jogo);
```

**Por que esses índices?**
- Sem índice em `email`: Login O(n) - linear search
- Com índice em `email`: Login O(log n) - busca binária
- Índice em `id_usuario`: Listar biblioteca instantânea

#### View de Estatísticas:

```sql
CREATE VIEW estatisticas_usuario AS
SELECT 
    u.id,
    u.nome,
    COUNT(b.id) as total_jogos,
    SUM(b.tempo_jogado) as tempo_total_minutos,
    SUM(b.preco_pago) as valor_total_investido
FROM usuarios u
LEFT JOIN bibliotecas b ON u.id = b.id_usuario
GROUP BY u.id, u.nome;
```

**O que faz?**
- Agrega dados de bibliotecas por usuário
- `LEFT JOIN`: Inclui usuários sem jogos
- Calcula: quantos jogos, tempo total, dinheiro gasto

**Uso:**
```sql
SELECT * FROM estatisticas_usuario WHERE nome = 'João Silva';
```

#### Trigger Automático:

```sql
-- Atualiza ultimo_acesso quando usuário compra jogo
CREATE TRIGGER trigger_ultimo_acesso
AFTER INSERT ON bibliotecas
FOR EACH ROW
EXECUTE FUNCTION atualizar_ultimo_acesso();
```

**O que faz?**
- Automaticamente atualiza `ultimo_acesso` em `usuarios`
- Executado TODA vez que inserir em `bibliotecas`
- **Vantagem:** Lógica no banco (não depende da aplicação)

### 3.2 MongoDB - Modelo de Documentos

#### Estrutura de Documento de Jogo:

```json
{
  "_id": ObjectId("..."),
  "gameId": "the-witcher-3",  // ID único (string)
  "nome": "The Witcher 3: Wild Hunt",
  "descricao": "RPG de mundo aberto épico baseado nos livros de Andrzej Sapkowski",
  "preco": 89.99,
  "desenvolvedora": "CD Projekt RED",
  "publicadora": "CD Projekt",
  
  // Arrays de strings
  "tags": ["RPG", "Mundo Aberto", "Fantasia", "Medieval"],
  "generos": ["Action RPG", "Adventure"],
  
  // Objetos aninhados
  "especificacoes": {
    "minimo": {
      "so": "Windows 7 64-bit",
      "processador": "Intel Core i5-2500K 3.3GHz",
      "memoria": "6 GB RAM",
      "placa_video": "NVIDIA GTX 660",
      "armazenamento": "50 GB"
    },
    "recomendado": {
      "so": "Windows 10 64-bit",
      "processador": "Intel Core i7-3770 3.4GHz",
      "memoria": "8 GB RAM",
      "placa_video": "NVIDIA GTX 770",
      "armazenamento": "50 GB SSD"
    }
  },
  
  // Array de objetos (DLCs)
  "dlcs": [
    {
      "nome": "Hearts of Stone",
      "preco": 29.99,
      "data_lancamento": "2015-10-13"
    },
    {
      "nome": "Blood and Wine",
      "preco": 39.99,
      "data_lancamento": "2016-05-31"
    }
  ],
  
  // Mídia
  "midia": {
    "imagem_capa": "https://cdn.ministeam.com/games/the-witcher-3/cover.jpg",
    "trailer": "https://youtube.com/...",
    "screenshots": [
      "https://cdn.ministeam.com/games/the-witcher-3/ss1.jpg",
      "https://cdn.ministeam.com/games/the-witcher-3/ss2.jpg"
    ]
  },
  
  // Avaliações
  "avaliacao": {
    "media": 4.8,
    "total_votos": 125430,
    "distribuicao": {
      "5_estrelas": 98500,
      "4_estrelas": 20000,
      "3_estrelas": 5000,
      "2_estrelas": 1500,
      "1_estrela": 430
    }
  },
  
  "classificacao_etaria": "18",
  "data_lancamento": "2015-05-19",
  "ativo": true
}
```

#### Índices no MongoDB:

```javascript
// Busca por gameId (único)
db.games.createIndex({ "gameId": 1 }, { unique: true })

// Busca full-text em nome e descrição
db.games.createIndex({ 
  "nome": "text", 
  "descricao": "text" 
})

// Filtro por tags
db.games.createIndex({ "tags": 1 })

// Filtro por preço
db.games.createIndex({ "preco": 1 })
```

#### Queries Comuns:

```javascript
// Buscar jogo específico
db.games.findOne({ gameId: "the-witcher-3" })

// Buscar jogos RPG abaixo de R$ 50
db.games.find({ 
  tags: "RPG", 
  preco: { $lt: 50 } 
})

// Busca full-text
db.games.find({ 
  $text: { $search: "mundo aberto fantasia" } 
})

// Jogos com DLCs
db.games.find({ 
  "dlcs.0": { $exists: true } 
})
```

### 3.3 Neo4j - Modelo de Grafos

#### Nodos (Entidades):

```cypher
// Nodo de Usuário
(:User {
  userId: "uuid-123",
  name: "João Silva"
})

// Nodo de Jogo
(:Game {
  gameId: "the-witcher-3",
  name: "The Witcher 3"
})
```

#### Relacionamentos (Edges):

```cypher
// Amizade (bidirecional)
(:User {userId: "123"})-[:FRIENDS_WITH {since: datetime()}]->(:User {userId: "456"})

// Propriedade de jogo
(:User {userId: "123"})-[:OWNS {
  acquiredAt: datetime(),
  hoursPlayed: 45.5,
  lastPlayed: datetime()
}]->(:Game {gameId: "the-witcher-3"})
```

#### Queries Avançadas:

**1. Recomendação Básica** (jogos que amigos possuem)
```cypher
MATCH (eu:User {userId: '123'})
      -[:FRIENDS_WITH]-(amigo)
      -[:OWNS]->(jogo)
WHERE NOT (eu)-[:OWNS]->(jogo)
RETURN jogo.name, count(amigo) AS amigosQueTemOJogo
ORDER BY amigosQueTemOJogo DESC
LIMIT 10
```

**2. Amigos de Amigos** (2-hops)
```cypher
MATCH (eu:User {userId: '123'})
      -[:FRIENDS_WITH*2]-(amigoDoAmigo)
WHERE eu <> amigoDoAmigo
  AND NOT (eu)-[:FRIENDS_WITH]-(amigoDoAmigo)
RETURN DISTINCT amigoDoAmigo.name
```

**3. Caminho Mais Curto** entre dois usuários
```cypher
MATCH path = shortestPath(
  (user1:User {userId: '123'})
  -[:FRIENDS_WITH*]-(user2:User {userId: '789'})
)
RETURN path, length(path)
```

**4. Usuários Mais Influentes** (mais amigos)
```cypher
MATCH (u:User)-[r:FRIENDS_WITH]-()
RETURN u.name, count(r) AS numeroDeAmigos
ORDER BY numeroDeAmigos DESC
LIMIT 10
```

**5. Jogos Populares na Rede**
```cypher
MATCH (u:User)-[:OWNS]->(g:Game)
RETURN g.name, count(u) AS totalDonos
ORDER BY totalDonos DESC
LIMIT 10
```

---

## 🔧 PARTE 4: COMO FUNCIONA NA PRÁTICA

### 4.1 Fluxo Completo: Compra de Jogo

**Cenário:** João Silva compra "The Witcher 3"

#### Passo 1: Usuário clica em "Comprar" no front-end

```javascript
// Requisição HTTP
POST http://localhost:3001/users/{joaoId}/library
Body: {
  "id_jogo": "the-witcher-3",
  "preco_pago": 89.99
}
```

#### Passo 2: Microsserviço de Usuários (PostgreSQL)

```javascript
// servico-usuarios/server.js
app.post('/users/:id/library', async (req, res) => {
  const { id } = req.params;
  const { id_jogo, preco_pago } = req.body;
  
  try {
    // Verifica se jogo existe no catálogo
    const catalogResponse = await fetch(
      `http://servico-catalogo:3002/catalog/${id_jogo}`
    );
    
    if (!catalogResponse.ok) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }
    
    // Insere na biblioteca (PostgreSQL)
    const result = await pool.query(
      `INSERT INTO bibliotecas (id_usuario, id_jogo, preco_pago) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [id, id_jogo, preco_pago]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
    
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Você já possui este jogo' });
    }
    res.status(500).json({ error: 'Erro ao processar compra' });
  }
});
```

**O que acontece no PostgreSQL:**
1. ✅ Valida se usuário existe (FOREIGN KEY)
2. ✅ Verifica se jogo já está na biblioteca (UNIQUE constraint)
3. ✅ Insere registro em `bibliotecas`
4. ✅ Trigger atualiza `ultimo_acesso` em `usuarios`
5. ✅ Commit da transação (ACID)

#### Passo 3: Sincronização com Neo4j

```javascript
// Cliente (simulador S1) faz segunda requisição
POST http://localhost:3003/users/{joaoId}/games
Body: {
  "gameId": "the-witcher-3",
  "hoursPlayed": 0
}
```

```javascript
// servico-social/server.js
app.post('/users/:id/games', async (req, res) => {
  const { id } = req.params;
  const { gameId, hoursPlayed } = req.body;
  
  const session = driver.session();
  try {
    await session.run(
      `MATCH (u:User {userId: $userId}), (g:Game {gameId: $gameId})
       MERGE (u)-[r:OWNS]->(g)
       SET r.acquiredAt = datetime(),
           r.hoursPlayed = $hours`,
      { userId: id, gameId, hours: hoursPlayed || 0 }
    );
    
    res.json({ success: true });
  } finally {
    await session.close();
  }
});
```

**O que acontece no Neo4j:**
1. ✅ Encontra nodo User
2. ✅ Encontra nodo Game
3. ✅ Cria relacionamento OWNS (ou atualiza se existir)
4. ✅ Adiciona propriedades ao relacionamento

#### Resultado Final:

**PostgreSQL:**
```
usuarios: [João Silva | joao@email.com | ...]
bibliotecas: [João Silva | the-witcher-3 | R$ 89.99 | 0 min]
```

**Neo4j:**
```
(João)-[:OWNS {acquiredAt: 2025-11-19, hoursPlayed: 0}]->(Witcher3)
```

### 4.2 Fluxo Completo: Adicionar Amigo

**Cenário:** João envia pedido de amizade para Maria

```javascript
POST http://localhost:3003/users/{joaoId}/friends
Body: { "friendId": "{mariaId}" }
```

```cypher
// Query Neo4j executada
MATCH (u1:User {userId: $userId}), (u2:User {userId: $friendId})
WHERE u1 <> u2
MERGE (u1)-[:FRIENDS_WITH {since: datetime()}]-(u2)
```

**MERGE vs CREATE:**
- `CREATE`: Sempre cria novo (pode duplicar)
- `MERGE`: Cria se não existe, senão não faz nada (idempotente)

### 4.3 Fluxo Completo: Ver Recomendações

**Cenário:** João quer ver jogos recomendados

```javascript
GET http://localhost:3003/users/{joaoId}/recommendations
```

```cypher
// Query executada
MATCH (eu:User {userId: $userId})
      -[:FRIENDS_WITH]-(amigo)
      -[owns:OWNS]->(jogo)
WHERE NOT (eu)-[:OWNS]->(jogo)
  AND owns.hoursPlayed > 10
RETURN jogo.gameId, 
       jogo.name, 
       count(DISTINCT amigo) AS amigosQueJogam,
       avg(owns.hoursPlayed) AS horasMedias
ORDER BY amigosQueJogam DESC, horasMedias DESC
LIMIT 10
```

**Lógica:**
1. Pega jogos que AMIGOS de João possuem
2. FILTRA: jogos que João NÃO possui
3. FILTRA: apenas se amigo jogou mais de 10 horas (indica que gostou)
4. AGRUPA: conta quantos amigos têm o jogo
5. ORDENA: por popularidade + horas jogadas

---

## 🐳 PARTE 5: DOCKER E INFRAESTRUTURA

### 5.1 O que é Docker?

**Definição Simples:** Empacota aplicação + dependências em "container" isolado

**Analogia:** Container = apartamento mobilado
- Tem tudo que precisa
- Funciona igual em qualquer prédio (servidor)
- Isolado de outros apartamentos

### 5.2 Docker Compose

**O que é?** Ferramenta para definir e rodar múltiplos containers juntos

**Arquivo:** `docker-compose.yml`

#### Estrutura do Nosso Compose:

```yaml
services:
  # 3 Bancos de Dados
  postgres:      # PostgreSQL para usuários
  mongodb:       # MongoDB para catálogo
  neo4j:         # Neo4j para rede social
  
  # 3 Microsserviços
  servico-usuarios:  # Node.js conecta PostgreSQL
  servico-catalogo:  # Node.js conecta MongoDB
  servico-social:    # Node.js conecta Neo4j

networks:
  ministeam-network:  # Rede interna para comunicação

volumes:
  postgres_data:      # Persistência do PostgreSQL
  mongodb_data:       # Persistência do MongoDB
  neo4j_data:         # Persistência do Neo4j
```

### 5.3 Healthchecks

**O que são?** Testes automáticos para ver se serviço está funcionando

**Exemplo - PostgreSQL:**
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ministeam -d ministeam_db"]
  interval: 10s     # Testa a cada 10 segundos
  timeout: 5s       # Máximo 5 segundos para responder
  retries: 5        # Tenta 5 vezes antes de desistir
```

**Por que importante?**
- Microsserviços dependem dos bancos
- `depends_on: condition: service_healthy` espera banco estar pronto
- Evita erros de "conexão recusada"

### 5.4 Volumes Persistentes

**Problema:** Container deletado = dados perdidos

**Solução:** Volumes Docker (storage externo ao container)

```yaml
volumes:
  postgres_data:
    driver: local   # Armazenado no host
```

**Comandos importantes:**
```bash
# Ver volumes
docker volume ls

# Deletar volumes (CUIDADO: perde todos dados!)
docker-compose down -v

# Parar sem deletar dados
docker-compose down
```

### 5.5 Comandos Docker Essenciais

```bash
# Iniciar tudo
docker-compose up -d --build

# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f servico-usuarios

# Parar tudo
docker-compose down

# Parar e deletar dados
docker-compose down -v

# Reiniciar um serviço específico
docker-compose restart servico-catalogo

# Entrar em container (debug)
docker exec -it ministeam-postgres bash

# Ver logs de erro
docker-compose logs --tail=50 servico-social
```

---

## 🧪 PARTE 6: TESTES E VERIFICAÇÃO

### 6.1 Como Executar o Projeto

**Passo 1: Limpar ambiente anterior**
```bash
cd DbProject
docker-compose down -v
```

**Passo 2: Iniciar serviços**
```bash
docker-compose up -d --build
# Aguardar ~30 segundos para healthchecks
docker-compose ps  # Verificar se todos estão "healthy"
```

**Passo 3: Executar simulador**
```bash
cd servico-s1
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python3 simulator.py
```

**O que o simulador faz:**
1. Cria 10 usuários
2. Cria 20 jogos
3. Sincroniza com Neo4j
4. Cria 50 amizades
5. Simula 100 compras
6. Gera log de verificação

### 6.2 Verificação Manual - PostgreSQL

```bash
# Conectar ao PostgreSQL
docker exec -it ministeam-postgres psql -U ministeam -d ministeam_db

# Queries de verificação
SELECT COUNT(*) FROM usuarios;
-- Deve retornar: 10

SELECT COUNT(*) FROM bibliotecas;
-- Deve retornar: ~80-100 (depende de duplicatas evitadas)

SELECT * FROM estatisticas_usuario;
-- Ver quantos jogos cada usuário tem

SELECT u.nome, COUNT(b.id) as total_jogos
FROM usuarios u
LEFT JOIN bibliotecas b ON u.id = b.id_usuario
GROUP BY u.nome
ORDER BY total_jogos DESC;
-- Ver ranking de usuários por jogos possuídos

-- Sair
\q
```

### 6.3 Verificação Manual - MongoDB

```bash
# Conectar ao MongoDB
docker exec -it ministeam-mongodb mongosh -u ministeam -p ministeam123

# Selecionar database
use ministeam_catalog

# Contar jogos
db.games.countDocuments()
// Deve retornar: 20

// Ver todos jogos
db.games.find().pretty()

// Jogos RPG
db.games.find({ tags: "RPG" }).pretty()

// Jogos baratos
db.games.find({ preco: { $lt: 50 } }, { nome: 1, preco: 1 })

// Busca de texto
db.games.find({ $text: { $search: "mundo aberto" } })

// Sair
exit
```

### 6.4 Verificação Manual - Neo4j

**Opção 1: Neo4j Browser (Recomendado)**
- Abrir: http://localhost:7474
- Usuário: `neo4j`
- Senha: `ministeam123`

**Queries para executar:**

```cypher
// 1. Contar usuários e jogos
MATCH (u:User) RETURN count(u) AS totalUsuarios
// Deve retornar: 10

MATCH (g:Game) RETURN count(g) AS totalJogos
// Deve retornar: 20

// 2. Visualizar rede de amizades
MATCH path = (u1:User)-[:FRIENDS_WITH]-(u2:User)
RETURN path
LIMIT 50
// Clique em "Graph" para ver visualização

// 3. Visualizar propriedades de jogos
MATCH path = (u:User)-[:OWNS]->(g:Game)
RETURN path
LIMIT 50

// 4. Usuários mais populares (mais amigos)
MATCH (u:User)-[r:FRIENDS_WITH]-()
RETURN u.name, count(r) AS amigos
ORDER BY amigos DESC

// 5. Jogos mais populares
MATCH (u:User)-[:OWNS]->(g:Game)
RETURN g.name, count(u) AS donos
ORDER BY donos DESC

// 6. Recomendações para um usuário específico
MATCH (eu:User {name: "João Silva"})
      -[:FRIENDS_WITH]-(amigo)
      -[:OWNS]->(jogo)
WHERE NOT (eu)-[:OWNS]->(jogo)
RETURN jogo.name, count(amigo) AS popularidade
ORDER BY popularidade DESC
```

**Opção 2: CLI Cypher-shell**
```bash
docker exec -it ministeam-neo4j cypher-shell -u neo4j -p ministeam123
# Executar queries Cypher acima
```

### 6.5 Arquivo de Verificação S1

**Localização:** `servico-s1/s1_verification_log.json`

**Estrutura:**
```json
{
  "timestamp": "2025-11-19T...",
  "summary": {
    "totalRequests": 289,
    "successfulRequests": 285,
    "failedRequests": 4
  },
  "operations": [
    {
      "timestamp": "...",
      "type": "CREATE_USER",
      "endpoint": "/users",
      "request": {"nome": "João Silva", ...},
      "response": {"success": true, ...},
      "status": "SUCCESS",
      "statusCode": 201
    }
  ]
}
```

**Como interpretar:**
- ✅ `successfulRequests` alto = sistema funcionando
- ⚠️ `failedRequests` baixo = algumas duplicatas (normal na 2ª execução)
- ❌ `failedRequests` alto = problema nos serviços

---

## 💡 PARTE 7: PERGUNTAS E RESPOSTAS COMUNS

### Q1: Por que usar PostgreSQL para usuários?

**R:** Três razões principais:
1. **ACID**: Compras precisam ser transações seguras (tudo ou nada)
2. **Integridade Referencial**: Foreign keys garantem consistência (biblioteca sempre tem usuário válido)
3. **Auditoria**: Dados de usuários são regulados (LGPD), PostgreSQL oferece logging robusto

**Contra-exemplo:** MongoDB não garante transações multi-documento (antes da v4.0)

### Q2: Por que usar MongoDB para catálogo?

**R:** Três razões principais:
1. **Esquema Flexível**: Cada jogo tem metadados diferentes (DLCs, mods, multiplayer)
2. **Performance de Leitura**: 1 query busca documento completo (sem JOINs)
3. **Escalabilidade**: Sharding facilita crescimento para milhões de jogos

**Contra-exemplo:** SQL exigiria múltiplas tabelas e JOINs complexos para reconstruir um jogo

### Q3: Por que usar Neo4j para rede social?

**R:** Três razões principais:
1. **Modelagem Natural**: Amizades são relacionamentos de primeira classe
2. **Performance em Grafos**: Queries de "amigos de amigos" são O(k) vs O(n²) no SQL
3. **Algoritmos Nativos**: PageRank, Community Detection, Shortest Path

**Contra-exemplo:** SQL com tabela de amizades precisa de self-joins recursivos (muito lento)

### Q4: O que acontece se um microsserviço cair?

**R:** Depende do serviço:
- **servico-usuarios** cai → Não pode criar usuários nem comprar jogos (mas pode navegar catálogo)
- **servico-catalogo** cai → Não pode ver detalhes de jogos (mas usuários continuam logados)
- **servico-social** cai → Não pode adicionar amigos (mas resto funciona)

**Vantagem:** Falha isolada, não derruba tudo (diferente de monolito)

### Q5: Como funciona a consistência entre bancos?

**R:** **Consistência Eventual**
- PostgreSQL e Neo4j têm dados duplicados (userId)
- Sincronização manual via API calls
- **Risco:** Se requisição falhar, dados ficam dessincronizados
- **Solução em produção:** Message queues (RabbitMQ, Kafka) com retries

### Q6: Por que 3 microsserviços e não 1?

**R:** Vantagens de separação:
1. **Escalabilidade Independente**: Catálogo tem mais requisições → pode ter mais instâncias
2. **Tecnologia Apropriada**: Cada banco especializado em seu domínio
3. **Desenvolvimento Paralelo**: Times diferentes podem trabalhar simultaneamente
4. **Isolamento de Falhas**: Crash em um não afeta outros

**Desvantagem:** Mais complexidade (comunicação HTTP, consistência eventual)

### Q7: O que são os scripts de init?

**R:** Scripts executados automaticamente quando container sobe pela primeira vez:
- **PostgreSQL**: `init-scripts/postgres/01-init-db.sql` - Cria tabelas, índices, views
- **MongoDB**: `init-scripts/mongodb/01-init-db.js` - Cria collections e índices

**Importante:** Só rodam na primeira vez! Para re-executar → `docker-compose down -v`

### Q8: Por que Python para S1 e Node.js para S2?

**R:** 
- **Python (S1)**: Ideal para scripts, manipulação de dados, bibliotecas de teste
- **Node.js (S2)**: Ideal para APIs REST, alta concorrência (event loop), ecosistema npm

**Não há problema em misturar linguagens em microsserviços!**

### Q9: O que é o erro "409 Conflict"?

**R:** Significa "recurso já existe":
- **Usuário**: Email já cadastrado (UNIQUE constraint)
- **Jogo**: gameId duplicado
- **Biblioteca**: Usuário já possui o jogo

**Isso é comportamento CORRETO!** Não é bug.

**Solução:** Limpar bancos com `docker-compose down -v` antes de rodar simulador novamente

### Q10: Como debugar erros?

**R:** Passo a passo:
1. Ver logs dos containers:
   ```bash
   docker-compose logs -f servico-usuarios
   ```

2. Verificar se bancos estão healthy:
   ```bash
   docker-compose ps
   ```

3. Conectar manualmente aos bancos (ver seção 6.2-6.4)

4. Verificar conectividade de rede:
   ```bash
   docker network inspect ministeam-network
   ```

5. Reiniciar serviço específico:
   ```bash
   docker-compose restart servico-catalogo
   ```

---

## 🎓 PARTE 8: CONCEITOS AVANÇADOS

### 8.1 CAP Theorem

**Definição:** Impossível ter simultaneamente:
- **C**onsistency (Consistência)
- **A**vailability (Disponibilidade)
- **P**artition Tolerance (Tolerância a Partições)

**Trade-offs no projeto:**
| Banco | Escolha CAP | Explicação |
|-------|-------------|------------|
| PostgreSQL | CP | Prioriza consistência sobre disponibilidade (pausa em caso de partição) |
| MongoDB | AP (config) | Pode ser configurado como CP ou AP (no projeto: configuração padrão) |
| Neo4j | CP | Prioriza consistência em cluster |

### 8.2 Sharding vs Replication

**Replication (Replicação):**
- Cópias idênticas do banco em múltiplos servidores
- **Vantagem:** Alta disponibilidade (se um cair, outros continuam)
- **Desvantagem:** Todos servidores têm todos dados (não escala storage)

**Sharding (Fragmentação):**
- Dados divididos entre servidores (ex: A-M no servidor1, N-Z no servidor2)
- **Vantagem:** Escala storage (cada servidor tem parte dos dados)
- **Desvantagem:** Queries podem precisar consultar múltiplos shards

**MongoDB** suporta ambos nativamente.

### 8.3 ACID vs BASE

**ACID** (Bancos SQL tradicionais):
- **A**tomic, **C**onsistent, **I**solated, **D**urable
- Forte consistência, transações garantidas

**BASE** (Bancos NoSQL):
- **B**asically **A**vailable, **S**oft state, **E**ventually consistent
- Disponibilidade prioritária, consistência eventual

**No projeto:**
- PostgreSQL → ACID
- MongoDB/Neo4j → Podem ser configurados para ACID ou BASE

### 8.4 Índices - Deep Dive

**Como funcionam?**
- B-Tree (PostgreSQL): Árvore balanceada, busca O(log n)
- Hash (MongoDB): Tabela hash, busca O(1) mas sem range queries
- Graph indices (Neo4j): Adjacency lists nativos

**Quando criar índice?**
✅ Sim:
- Campos em WHERE clauses frequentes
- Campos em JOIN conditions
- Campos em ORDER BY

❌ Não:
- Tabelas pequenas (< 1000 registros)
- Campos raramente consultados
- Campos com baixa cardinalidade (ex: boolean)

**Custo de índices:**
- Espaço em disco
- Lentidão em INSERT/UPDATE/DELETE

### 8.5 Normalização vs Denormalização

**Normalização (SQL):**
- Dividir dados em múltiplas tabelas relacionadas
- Evita duplicação
- Requer JOINs

**Exemplo:**
```sql
-- Normalizado (3NF)
usuarios (id, nome)
telefones (id, usuario_id, numero)

-- Denormalizado
usuarios (id, nome, telefone1, telefone2, telefone3)
```

**Denormalização (NoSQL):**
- Duplicar dados para performance
- Evita JOINs
- Precisa manter múltiplas cópias sincronizadas

**Exemplo MongoDB:**
```json
// Denormalizado (comum)
{
  "nome": "João",
  "endereco": {
    "rua": "...",
    "cidade": "..."
  }
}

// Normalizado (raro no MongoDB)
Usuario: { "nome": "João", "endereco_id": "abc" }
Endereco: { "_id": "abc", "rua": "...", "cidade": "..." }
```

**No projeto:**
- PostgreSQL → Normalizado (usuarios + bibliotecas separados)
- MongoDB → Denormalizado (jogo tem tudo embutido)
- Neo4j → Ambos (nodos pequenos, relacionamentos ricos)

---

## 📝 PARTE 9: CHECKLIST PARA PROVA

### ✅ Conceitos que você DEVE saber explicar:

- [ ] **Persistência Poliglota** - O que é, por que usar
- [ ] **ACID** - Todas 4 propriedades + exemplos
- [ ] **Integridade Referencial** - Foreign keys, cascatas
- [ ] **Esquema Flexível** - Vantagens do MongoDB vs SQL rígido
- [ ] **Banco de Grafos** - Por que Neo4j para redes sociais
- [ ] **Microsserviços** - Vantagens e desvantagens
- [ ] **Docker Compose** - O que faz, por que usar
- [ ] **Índices** - O que são, quando usar
- [ ] **Transações** - Commit, rollback, isolamento
- [ ] **CAP Theorem** - Consistência vs Disponibilidade

### ✅ Queries que você DEVE saber escrever:

**SQL (PostgreSQL):**
- [ ] SELECT com JOIN entre usuarios e bibliotecas
- [ ] INSERT com RETURNING
- [ ] SELECT com agregação (COUNT, SUM, AVG)
- [ ] Query com WHERE e ORDER BY

**MongoDB:**
- [ ] find() com filtros
- [ ] find() com $lt, $gt (comparações)
- [ ] Busca em arrays (tags)
- [ ] Busca em campos aninhados

**Cypher (Neo4j):**
- [ ] MATCH simples (1-hop)
- [ ] MATCH com 2-hops (amigos de amigos)
- [ ] WHERE com filtros
- [ ] RETURN com agregação (count, avg)
- [ ] Query de recomendação

### ✅ Comandos que você DEVE saber executar:

**Docker:**
- [ ] `docker-compose up -d --build`
- [ ] `docker-compose down -v`
- [ ] `docker-compose ps`
- [ ] `docker-compose logs -f <serviço>`

**PostgreSQL:**
- [ ] Conectar via docker exec
- [ ] SELECT com JOINs
- [ ] Ver estrutura de tabela (\d usuarios)

**MongoDB:**
- [ ] Conectar via mongosh
- [ ] use <database>
- [ ] db.collection.find()
- [ ] db.collection.countDocuments()

**Neo4j:**
- [ ] Abrir Browser (http://localhost:7474)
- [ ] Executar queries Cypher
- [ ] Visualizar grafos

### ✅ Arquivos que você DEVE conhecer:

- [ ] `docker-compose.yml` - Orquestração
- [ ] `init-scripts/postgres/01-init-db.sql` - Schema SQL
- [ ] `servico-usuarios/server.js` - API de usuários
- [ ] `servico-s1/simulator.py` - Simulador Python

---

## 🚀 PARTE 10: DICAS FINAIS

### Dia da Prova:

1. **Leia o README.md original do projeto** - Tem detalhes técnicos completos
2. **Execute o projeto uma vez** - Fixar comandos e fluxo
3. **Pratique queries** - SQL, MongoDB, Cypher
4. **Entenda PORQUÊS** - Não decore, entenda as justificativas
5. **Revise CAP e ACID** - Conceitos teóricos sempre caem

### Possíveis Perguntas da Prova:

#### Teóricas:
- "Explique o que é Persistência Poliglota"
- "Por que usar PostgreSQL para usuários?"
- "Quais as vantagens de Neo4j sobre SQL para grafos?"
- "O que é ACID? Dê exemplo de cada propriedade"
- "Explique integridade referencial com exemplo"

#### Práticas:
- "Escreva query SQL para listar jogos de um usuário"
- "Escreva query MongoDB para buscar jogos RPG abaixo de R$ 50"
- "Escreva query Cypher para recomendar jogos"
- "Explique o que faz este código: [trecho do server.js]"
- "Como você executaria este projeto do zero?"

### Pontos de Atenção:

⚠️ **Erros comuns:**
- Confundir MongoDB (documentos) com Neo4j (grafos)
- Achar que NoSQL = sem consultas (tem queries!)
- Esquecer que MongoDB também suporta transações (v4.0+)
- Pensar que microsserviços sempre são melhores (têm trade-offs)

✅ **Respostas boas incluem:**
- Exemplos práticos do projeto
- Trade-offs (vantagens E desvantagens)
- Contexto ("depende do caso de uso...")
- Justificativas técnicas específicas

---

## 📚 REFERÊNCIAS E ESTUDO ADICIONAL

### Documentações Oficiais:
- PostgreSQL: https://www.postgresql.org/docs/
- MongoDB: https://docs.mongodb.com/
- Neo4j: https://neo4j.com/docs/
- Docker: https://docs.docker.com/

### Conceitos Importantes:
- Martin Fowler - Polyglot Persistence: https://martinfowler.com/bliki/PolyglotPersistence.html
- CAP Theorem: https://en.wikipedia.org/wiki/CAP_theorem
- ACID vs BASE: https://www.johndcook.com/blog/2009/07/06/brewer-cap-theorem-base/

### Tutoriais Práticos:
- SQL Tutorial: https://www.w3schools.com/sql/
- MongoDB University: https://university.mongodb.com/
- Neo4j Graph Academy: https://neo4j.com/graphacademy/

---

## ✨ BOA SORTE NA PROVA! ✨

**Resumindo tudo em 3 frases:**
1. **Persistência Poliglota** = usar banco certo para dado certo
2. **PostgreSQL** (SQL) = transações seguras | **MongoDB** (Docs) = flexível | **Neo4j** (Grafo) = relacionamentos
3. **Microsserviços** = serviços independentes que conversam via API

**Você consegue!** 🎓🚀
