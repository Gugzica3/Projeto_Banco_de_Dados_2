# 📋 COLA RÁPIDA - MINI-STEAM
## Resumo Ultra-Compacto para Consulta Rápida

---

## 🎯 CONCEITO PRINCIPAL

**Persistência Poliglota** = Usar diferentes bancos de dados para diferentes tipos de dados na mesma aplicação.

---

## 🗄️ OS 3 BANCOS

| Banco | Tipo | Porta | Para quê? | Por quê? |
|-------|------|-------|-----------|----------|
| **PostgreSQL** | Relacional | 5432 | Usuários + Bibliotecas | ACID, Foreign Keys, Transações |
| **MongoDB** | Documentos | 27017 | Catálogo de Jogos | Esquema Flexível, Dados Aninhados |
| **Neo4j** | Grafos | 7687/7474 | Rede Social | Queries de Grafo, Recomendações |

---

## 🏗️ ARQUITETURA

```
Python (S1 - Simulador)
    ↓ HTTP REST
Node.js (S2 - 3 Microsserviços)
    ├─ servico-usuarios :3001 → PostgreSQL
    ├─ servico-catalogo :3002 → MongoDB
    └─ servico-social   :3003 → Neo4j
```

---

## 💎 CONCEITOS-CHAVE

### ACID (PostgreSQL)
- **A**tomic: Tudo ou nada
- **C**onsistent: Sempre válido
- **I**solated: Transações não interferem
- **D**urable: Gravado é permanente

### Integridade Referencial
```sql
FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
```
→ Biblioteca sempre tem usuário válido

### Schema Flexível (MongoDB)
- Jogo AAA: muitos campos (DLCs, mods, multiplayer)
- Jogo indie: poucos campos (nome, preço)
- **MongoDB**: cada documento diferente, sem desperdício

### Grafos (Neo4j)
- Relacionamentos = "cidadãos de primeira classe"
- Amigos, propriedades, recomendações
- Performance: O(k) vs O(n²) no SQL

---

## 📝 QUERIES ESSENCIAIS

### PostgreSQL (SQL)

```sql
-- Listar biblioteca de usuário
SELECT b.id_jogo, b.preco_pago, b.tempo_jogado
FROM bibliotecas b
WHERE b.id_usuario = 'uuid-aqui';

-- Estatísticas de usuário
SELECT COUNT(*) as total_jogos, SUM(preco_pago) as total_gasto
FROM bibliotecas
WHERE id_usuario = 'uuid-aqui';

-- Ranking de usuários
SELECT u.nome, COUNT(b.id) as jogos
FROM usuarios u
LEFT JOIN bibliotecas b ON u.id = b.id_usuario
GROUP BY u.nome
ORDER BY jogos DESC;
```

### MongoDB (JavaScript)

```javascript
// Buscar jogo específico
db.games.findOne({ gameId: "the-witcher-3" })

// Filtrar por tags e preço
db.games.find({ 
  tags: "RPG", 
  preco: { $lt: 50 } 
})

// Contar jogos
db.games.countDocuments()

// Busca full-text
db.games.find({ 
  $text: { $search: "mundo aberto" } 
})
```

### Neo4j (Cypher)

```cypher
-- Recomendação básica
MATCH (eu:User {userId: '123'})
      -[:FRIENDS_WITH]-(amigo)
      -[:OWNS]->(jogo)
WHERE NOT (eu)-[:OWNS]->(jogo)
RETURN jogo.name, count(amigo) AS qtd
ORDER BY qtd DESC
LIMIT 10

-- Amigos de amigos
MATCH (eu:User {userId: '123'})
      -[:FRIENDS_WITH*2]-(amigoDoAmigo)
WHERE eu <> amigoDoAmigo
RETURN DISTINCT amigoDoAmigo.name

-- Jogos mais populares
MATCH (u:User)-[:OWNS]->(g:Game)
RETURN g.name, count(u) AS donos
ORDER BY donos DESC
```

---

## 🐳 COMANDOS DOCKER

```bash
# Iniciar tudo
docker-compose up -d --build

# Status
docker-compose ps

# Logs
docker-compose logs -f servico-usuarios

# Parar (mantém dados)
docker-compose down

# Parar + deletar dados
docker-compose down -v

# Reiniciar serviço
docker-compose restart servico-catalogo
```

---

## 🔌 VERIFICAÇÃO DOS BANCOS

### PostgreSQL
```bash
docker exec -it ministeam-postgres psql -U ministeam -d ministeam_db

# Dentro do psql:
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM bibliotecas;
\q
```

### MongoDB
```bash
docker exec -it ministeam-mongodb mongosh -u ministeam -p ministeam123

# Dentro do mongosh:
use ministeam_catalog
db.games.countDocuments()
exit
```

### Neo4j
- Browser: http://localhost:7474
- User: `neo4j` / Pass: `ministeam123`
- Query: `MATCH (n) RETURN count(n)`

---

## 🚀 EXECUTAR PROJETO

```bash
# 1. Limpar
cd DbProject
docker-compose down -v

# 2. Iniciar serviços
docker-compose up -d --build
# Aguardar 30 segundos

# 3. Executar simulador
cd servico-s1
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 simulator.py

# 4. Ver resultado
cat s1_verification_log.json
```

---

## 📊 MODELAGEM

### PostgreSQL
```sql
usuarios (id, nome, email, senha_hash, data_criacao)
bibliotecas (id, id_usuario, id_jogo, preco_pago, tempo_jogado)
```

### MongoDB
```json
{
  "gameId": "...",
  "nome": "...",
  "preco": 89.99,
  "tags": ["RPG", "..."],
  "especificacoes": { ... },
  "dlcs": [ ... ]
}
```

### Neo4j
```cypher
(:User {userId, name})
(:Game {gameId, name})
(:User)-[:FRIENDS_WITH {since}]->(:User)
(:User)-[:OWNS {hoursPlayed}]->(:Game)
```

---

## 🎓 JUSTIFICATIVAS RÁPIDAS

### Por que PostgreSQL?
- ✅ ACID (transações seguras)
- ✅ Foreign Keys (integridade)
- ✅ Dados estruturados (usuário sempre igual)

### Por que MongoDB?
- ✅ Esquema flexível (jogos diferentes)
- ✅ Dados aninhados (specs, DLCs)
- ✅ 1 query = documento completo

### Por que Neo4j?
- ✅ Relacionamentos diretos
- ✅ Queries de grafo rápidas (O(k))
- ✅ Recomendações naturais

---

## ⚡ DICAS PARA PROVA

### Sempre mencionar:
1. **Trade-offs** (vantagens E desvantagens)
2. **Exemplos práticos** do projeto
3. **Justificativas técnicas** específicas

### Erros comuns:
- ❌ "NoSQL não tem queries" (ERRADO! Tem!)
- ❌ "Microsserviços sempre são melhores" (Têm trade-offs!)
- ❌ Confundir MongoDB (docs) com Neo4j (grafo)

### Respostas modelo:
- "Depende do caso de uso..."
- "PostgreSQL porque precisa de ACID para..."
- "MongoDB porque o esquema é flexível e..."
- "Neo4j porque queries de grafo são O(k)..."

---

## 📌 ATALHOS IMPORTANTES

| Serviço | URL/Porta |
|---------|-----------|
| Usuários API | http://localhost:3001 |
| Catálogo API | http://localhost:3002 |
| Social API | http://localhost:3003 |
| Neo4j Browser | http://localhost:7474 |
| PostgreSQL | localhost:5432 |
| MongoDB | localhost:27017 |

**Credenciais:**
- PostgreSQL: `ministeam` / `ministeam123`
- MongoDB: `ministeam` / `ministeam123`
- Neo4j: `neo4j` / `ministeam123`

---

## 🎯 RESUMO EM 10 PALAVRAS

**Persistência Poliglota: Banco certo para dado certo, otimizando tudo.**

---

## ✅ CHECKLIST PRÉ-PROVA

- [ ] Sei explicar Persistência Poliglota
- [ ] Sei explicar ACID (4 propriedades)
- [ ] Sei justificar os 3 bancos escolhidos
- [ ] Sei escrever query SQL básica
- [ ] Sei escrever query MongoDB básica
- [ ] Sei escrever query Cypher básica
- [ ] Sei executar o projeto do zero
- [ ] Sei verificar dados nos 3 bancos
- [ ] Entendo arquitetura de microsserviços
- [ ] Conheço trade-offs de cada decisão

---

**BOA SORTE! 🚀**
