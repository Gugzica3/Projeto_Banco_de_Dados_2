# ❓ PERGUNTAS E RESPOSTAS - PREPARAÇÃO PARA PROVA
## 50 Perguntas Mais Comuns sobre o Projeto Mini-Steam

---

## 📚 CATEGORIA 1: CONCEITOS FUNDAMENTAIS

### P1: O que é Persistência Poliglota?
**R:** É o uso de diferentes tipos de bancos de dados dentro da mesma aplicação, escolhendo cada um baseado nas características específicas dos dados que ele irá armazenar. No Mini-Steam, usamos PostgreSQL para dados transacionais, MongoDB para catálogos flexíveis e Neo4j para relacionamentos em grafo.

### P2: Explique cada letra do ACID
**R:**
- **A (Atomicidade)**: Transação é "tudo ou nada". Se qualquer parte falhar, toda operação é revertida (rollback).
- **C (Consistência)**: Banco sempre em estado válido, respeitando todas as constraints e regras.
- **I (Isolamento)**: Transações simultâneas não interferem entre si, como se fossem sequenciais.
- **D (Durabilidade)**: Dados confirmados são permanentes, sobrevivem a crashes do sistema.

### P3: Por que não usar apenas um banco de dados?
**R:** Porque diferentes tipos de dados têm necessidades diferentes:
- Usuários precisam de transações ACID
- Catálogo precisa de flexibilidade
- Rede social precisa de queries de grafo eficientes
Usar um banco só forçaria compromissos que prejudicariam performance ou funcionalidade.

### P4: O que é um microsserviço?
**R:** É uma arquitetura onde a aplicação é dividida em serviços pequenos e independentes, cada um responsável por uma funcionalidade específica, comunicando-se via APIs (geralmente REST). No projeto: 3 microsserviços (usuários, catálogo, social).

### P5: Qual a diferença entre SQL e NoSQL?
**R:**
- **SQL (Relacional)**: Schema fixo, tabelas relacionadas, transações ACID, queries com JOINs. Ex: PostgreSQL
- **NoSQL**: Schema flexível ou nenhum, diversos modelos (documentos, grafos, chave-valor), escalabilidade horizontal. Ex: MongoDB, Neo4j

---

## 🗄️ CATEGORIA 2: POSTGRESQL

### P6: Por que usar PostgreSQL para usuários?
**R:** Três razões principais:
1. **ACID**: Compras de jogos precisam ser transações seguras
2. **Integridade Referencial**: Foreign keys garantem que bibliotecas sempre tenham usuário válido
3. **Estrutura Previsível**: Dados de usuário (nome, email, senha) sempre têm mesma estrutura

### P7: O que é uma Foreign Key?
**R:** É uma constraint que garante integridade referencial. No projeto:
```sql
FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
```
Isso garante que `id_usuario` em `bibliotecas` sempre aponte para um usuário real. Se deletar usuário, suas bibliotecas são automaticamente deletadas (CASCADE).

### P8: O que é o ON DELETE CASCADE?
**R:** Define o que acontece quando registro referenciado é deletado. CASCADE significa "deletar em cascata" - se deletar usuário, todas suas bibliotecas são automaticamente deletadas também. Alternativas: SET NULL, RESTRICT (impede deleção).

### P9: Para que servem os índices?
**R:** Aceleram buscas específicas. Sem índice em `email`, login precisa varrer toda tabela O(n). Com índice, busca é O(log n) usando estrutura de árvore. Trade-off: índices ocupam espaço e tornam INSERT/UPDATE mais lentos.

### P10: O que é a VIEW estatisticas_usuario?
**R:** É uma "tabela virtual" - resultado de query salvo como objeto reutilizável:
```sql
CREATE VIEW estatisticas_usuario AS
SELECT u.id, u.nome, COUNT(b.id) as total_jogos, ...
FROM usuarios u LEFT JOIN bibliotecas b ...
```
Posso consultar como tabela: `SELECT * FROM estatisticas_usuario`

### P11: O que faz o TRIGGER no projeto?
**R:** Atualiza automaticamente `ultimo_acesso` em `usuarios` toda vez que inserir em `bibliotecas`. É código SQL executado automaticamente em resposta a eventos (INSERT, UPDATE, DELETE).

### P12: Por que usar UUID em vez de INT?
**R:**
- **UUID**: Único globalmente, pode gerar em qualquer lugar, não revela quantidade de registros
- **INT**: Sequencial, mais compacto, mas precisa de controle centralizado
Projeto usa UUID para segurança e distribuição.

---

## 📄 CATEGORIA 3: MONGODB

### P13: Por que usar MongoDB para catálogo?
**R:** Três razões:
1. **Schema Flexível**: Jogo AAA tem DLCs/mods, jogo indie só tem nome/preço
2. **Dados Aninhados**: Especificações, mídia, avaliações - tudo em um documento
3. **Performance de Leitura**: 1 query busca jogo completo (sem JOINs)

### P14: O que é um documento no MongoDB?
**R:** É equivalente a um "registro" em SQL, mas em formato JSON. Pode ter campos diferentes de outros documentos na mesma collection (tabela). Exemplo:
```json
{
  "_id": ObjectId("..."),
  "gameId": "witcher-3",
  "nome": "The Witcher 3",
  "preco": 89.99,
  "dlcs": [...]
}
```

### P15: Como funciona o esquema flexível?
**R:** Diferente de SQL onde todas linhas têm mesmas colunas, no MongoDB cada documento pode ter campos diferentes:
- Jogo A: tem campo `dlcs`
- Jogo B: não tem campo `dlcs`
Ambos na mesma collection, sem problema! Sem desperdício de campos NULL.

### P16: O que são dados aninhados?
**R:** Objetos dentro de objetos:
```json
{
  "nome": "Jogo",
  "especificacoes": {
    "minimo": {
      "cpu": "i5",
      "ram": "8GB"
    },
    "recomendado": {
      "cpu": "i7",
      "ram": "16GB"
    }
  }
}
```
Em SQL, isso exigiria 3 tabelas + JOINs.

### P17: Como buscar em arrays no MongoDB?
**R:** Busca direta:
```javascript
// Buscar jogos com tag "RPG"
db.games.find({ tags: "RPG" })

// Buscar jogos com múltiplas tags
db.games.find({ tags: { $all: ["RPG", "Mundo Aberto"] } })
```

### P18: O que é $lt, $gt no MongoDB?
**R:** Operadores de comparação:
- `$lt`: less than (menor que)
- `$gt`: greater than (maior que)
- `$lte`: less than or equal
- `$gte`: greater than or equal

Exemplo: `db.games.find({ preco: { $lt: 50 } })`

### P19: MongoDB tem transações?
**R:** Sim! Desde versão 4.0, MongoDB suporta transações ACID multi-documento. Antes disso, apenas operações em documento único eram atômicas.

---

## 🕸️ CATEGORIA 4: NEO4J

### P20: Por que usar Neo4j para rede social?
**R:** Três razões:
1. **Modelagem Natural**: Amizades são relacionamentos de primeira classe, não tabelas de junção
2. **Performance**: Queries de grafo são O(k) vs O(n²) no SQL
3. **Queries Intuitivas**: Cypher expressa relacionamentos de forma visual e declarativa

### P21: O que é um nodo no Neo4j?
**R:** É uma entidade (objeto). No projeto:
```cypher
(:User {userId: "123", name: "João"})
(:Game {gameId: "witcher-3", name: "The Witcher 3"})
```
Equivalente a "linha em tabela" no SQL, mas com foco em relacionamentos.

### P22: O que é um relacionamento (edge)?
**R:** É a conexão entre nodos, com tipo e propriedades:
```cypher
(João)-[:FRIENDS_WITH {since: "2025-01-01"}]->(Maria)
(João)-[:OWNS {hoursPlayed: 45}]->(Witcher3)
```
Em SQL, seria linha em tabela de junção - no Neo4j, é cidadão de primeira classe.

### P23: O que é Cypher?
**R:** É a linguagem de query do Neo4j, declarativa e visual:
```cypher
MATCH (eu:User)-[:FRIENDS_WITH]-(amigo)-[:OWNS]->(jogo)
WHERE NOT (eu)-[:OWNS]->(jogo)
RETURN jogo
```
Lê quase como português: "Pegue EU, meus AMIGOS, JOGOS que eles POSSUEM, que EU NÃO possuo"

### P24: O que é um "hop" em grafo?
**R:** É um nível de relacionamento:
- **1-hop**: Direto (meus amigos)
- **2-hops**: Indireto (amigos de meus amigos)
- **n-hops**: `[:FRIENDS_WITH*n]` no Cypher

### P25: Como funciona recomendação em grafo?
**R:** Query Cypher:
```cypher
MATCH (eu)-[:FRIENDS_WITH]-(amigo)-[:OWNS]->(jogo)
WHERE NOT (eu)-[:OWNS]->(jogo)
RETURN jogo, count(amigo) AS popularidade
ORDER BY popularidade DESC
```
Lógica: jogos que meus amigos têm, mas eu não, ordenados por quantos amigos têm.

### P26: Neo4j vs SQL para grafos - qual diferença de performance?
**R:**
- **Neo4j**: O(k) onde k = número de relacionamentos diretos (índices de adjacência nativos)
- **SQL**: O(n²) com self-joins recursivos
Para "amigos de amigos" com milhões de usuários, Neo4j é 100-1000x mais rápido.

### P27: O que é MERGE vs CREATE no Neo4j?
**R:**
- **CREATE**: Sempre cria novo (pode duplicar)
- **MERGE**: Cria se não existe, senão não faz nada (idempotente)
Projeto usa MERGE para evitar amizades duplicadas.

---

## 🏗️ CATEGORIA 5: ARQUITETURA

### P28: Quais os 3 microsserviços e suas funções?
**R:**
1. **servico-usuarios** (3001): Gerencia usuários e bibliotecas → PostgreSQL
2. **servico-catalogo** (3002): Gerencia catálogo de jogos → MongoDB
3. **servico-social** (3003): Gerencia rede social e recomendações → Neo4j

### P29: Como microsserviços se comunicam?
**R:** Via HTTP REST APIs. Exemplo: serviço de usuários chama serviço de catálogo para validar se jogo existe antes de adicionar à biblioteca:
```javascript
const response = await fetch('http://servico-catalogo:3002/catalog/${gameId}');
```

### P30: Vantagens dos microsserviços?
**R:**
- ✅ Escalabilidade independente
- ✅ Tecnologias diferentes por serviço
- ✅ Isolamento de falhas
- ✅ Desenvolvimento paralelo

### P31: Desvantagens dos microsserviços?
**R:**
- ❌ Complexidade de comunicação
- ❌ Consistência eventual (não imediata)
- ❌ Mais infraestrutura (mais servidores)
- ❌ Debugging mais difícil

### P32: O que é o S1 (simulador)?
**R:** Script Python que gera dados fictícios e testa o sistema:
1. Cria 10 usuários
2. Cria 20 jogos
3. Sincroniza com Neo4j
4. Cria 50 amizades
5. Simula 100 compras
6. Gera log de verificação

### P33: Por que Python para S1 e Node.js para S2?
**R:**
- **Python**: Ideal para scripts, manipulação de dados, geração de testes
- **Node.js**: Ideal para APIs REST, alta concorrência (event loop)
Microsserviços permitem usar linguagem ideal para cada caso!

---

## 🐳 CATEGORIA 6: DOCKER

### P34: O que é Docker?
**R:** Plataforma de containerização - empacota aplicação + dependências em container isolado que roda igual em qualquer servidor. Analogia: container = apartamento mobilado que funciona em qualquer prédio.

### P35: O que é Docker Compose?
**R:** Ferramenta para definir e rodar múltiplos containers juntos. Arquivo `docker-compose.yml` especifica todos serviços (bancos + microsserviços) e suas configurações.

### P36: O que são volumes Docker?
**R:** Storage persistente fora do container. Sem volume, dados são perdidos quando container é deletado. Com volume, dados sobrevivem:
```yaml
volumes:
  postgres_data:
    driver: local
```

### P37: O que é healthcheck?
**R:** Teste automático para verificar se serviço está funcionando:
```yaml
healthcheck:
  test: ["CMD", "pg_isready -U ministeam"]
  interval: 10s
```
Microsserviços esperam bancos estarem "healthy" antes de iniciar.

### P38: O que faz docker-compose down -v?
**R:**
- `docker-compose down`: Para e remove containers (mantém volumes/dados)
- `docker-compose down -v`: Para, remove containers E deleta volumes (perde todos dados!)
Use `-v` para "reset completo" do sistema.

---

## 🔧 CATEGORIA 7: OPERAÇÕES PRÁTICAS

### P39: Como executar o projeto do zero?
**R:**
```bash
cd DbProject
docker-compose down -v          # Limpar
docker-compose up -d --build    # Iniciar
# Aguardar 30s
cd servico-s1
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 simulator.py
```

### P40: Como verificar se PostgreSQL tem dados?
**R:**
```bash
docker exec -it ministeam-postgres psql -U ministeam -d ministeam_db
SELECT COUNT(*) FROM usuarios;    # Deve ser 10
SELECT COUNT(*) FROM bibliotecas; # Deve ser ~80-100
\q
```

### P41: Como verificar MongoDB?
**R:**
```bash
docker exec -it ministeam-mongodb mongosh -u ministeam -p ministeam123
use ministeam_catalog
db.games.countDocuments()  // Deve ser 20
exit
```

### P42: Como verificar Neo4j?
**R:** Abrir browser: http://localhost:7474
- User: `neo4j` / Password: `ministeam123`
- Query: `MATCH (n) RETURN count(n)` → Deve ser 30 (10 users + 20 games)

### P43: O que é o erro "409 Conflict"?
**R:** Significa "recurso já existe". Exemplos:
- Email duplicado (UNIQUE constraint)
- Usuário já possui o jogo
- Amizade já existe
**Não é bug!** É comportamento correto do sistema. Solução: `docker-compose down -v` para limpar.

### P44: Como ver logs de erro?
**R:**
```bash
# Ver logs de serviço específico
docker-compose logs -f servico-usuarios

# Ver últimas 50 linhas de todos serviços
docker-compose logs --tail=50

# Ver só erros (grep)
docker-compose logs | grep -i error
```

---

## 🎓 CATEGORIA 8: CONCEITOS AVANÇADOS

### P45: O que é CAP Theorem?
**R:** Teorema que diz: banco distribuído só pode ter 2 de 3:
- **C**onsistency (Consistência): Todos veem mesmos dados
- **A**vailability (Disponibilidade): Sempre responde
- **P**artition Tolerance (Tolerância a Partições): Funciona com falha de rede

PostgreSQL → CP | MongoDB → AP (config) | Neo4j → CP

### P46: O que é Sharding?
**R:** Dividir dados entre múltiplos servidores. Exemplo:
- Servidor 1: Jogos A-M
- Servidor 2: Jogos N-Z
**Vantagem**: Escala storage. **Desvantagem**: Queries podem precisar múltiplos servidores.

### P47: O que é Replication?
**R:** Copiar dados para múltiplos servidores (todos têm tudo).
**Vantagem**: Alta disponibilidade. **Desvantagem**: Não escala storage.

### P48: O que é normalização?
**R:** Dividir dados em múltiplas tabelas relacionadas para evitar duplicação. Exemplo:
```sql
-- Normalizado
usuarios (id, nome)
telefones (id, usuario_id, numero)

-- Denormalizado
usuarios (id, nome, telefone1, telefone2)
```
SQL → normalizado | MongoDB → denormalizado

### P49: O que é consistência eventual?
**R:** Em sistemas distribuídos, dados podem ficar temporariamente diferentes, mas eventualmente convergem. No projeto: PostgreSQL e Neo4j têm dados duplicados (userId) sincronizados via API - se API falhar, ficam dessincronizados temporariamente.

### P50: ACID vs BASE - qual diferença?
**R:**
- **ACID**: Consistência forte, transações garantidas (SQL tradicional)
- **BASE**: Basically Available, Soft state, Eventually consistent - prioriza disponibilidade (NoSQL)
PostgreSQL → ACID | MongoDB/Neo4j → podem ser ACID ou BASE

---

## 🎯 PERGUNTAS BÔNUS - APLICAÇÃO PRÁTICA

### B1: Como adicionar um novo campo em jogo (ex: idiomas)?
**MongoDB:** Simplesmente adicionar em novos documentos:
```javascript
db.games.insertOne({
  gameId: "novo-jogo",
  nome: "...",
  idiomas: ["Português", "Inglês"]  // Campo novo!
})
```
**Sem migração!** Jogos antigos não precisam ter esse campo.

### B2: Como fazer query de "jogos que amigos de amigos jogam"?
**Cypher:**
```cypher
MATCH (eu:User {userId: '123'})
      -[:FRIENDS_WITH*2]-(amigoDoAmigo)
      -[:OWNS]->(jogo)
WHERE NOT (eu)-[:OWNS]->(jogo)
RETURN DISTINCT jogo.name
```

### B3: Como calcular dinheiro total gasto por usuário?
**SQL:**
```sql
SELECT SUM(preco_pago) as total_gasto
FROM bibliotecas
WHERE id_usuario = 'uuid-aqui';
```
Ou usar VIEW: `SELECT * FROM estatisticas_usuario WHERE id = 'uuid'`

### B4: Como buscar jogos baratos com boa avaliação?
**MongoDB:**
```javascript
db.games.find({
  preco: { $lt: 50 },
  "avaliacao.media": { $gte: 4.5 }
})
```

### B5: Como encontrar usuário mais popular (mais amigos)?
**Cypher:**
```cypher
MATCH (u:User)-[r:FRIENDS_WITH]-()
RETURN u.name, count(r) AS num_amigos
ORDER BY num_amigos DESC
LIMIT 1
```

---

## ✨ DICAS FINAIS

### Como estudar com essas perguntas:
1. **Primeira leitura**: Leia todas perguntas e respostas
2. **Segunda passada**: Tente responder sozinho, depois confira
3. **Terceira passada**: Explique em voz alta como se estivesse ensinando
4. **Prática**: Execute queries no sistema real

### Sinais de que você está pronto:
- ✅ Consegue responder 80%+ das perguntas sem consultar
- ✅ Consegue explicar "por quês" (não só "o quês")
- ✅ Consegue escrever queries básicas dos 3 bancos
- ✅ Consegue executar o projeto do zero

### Última dica:
**Entenda, não decore!** Na prova, se esquecer algo específico, use lógica:
- "PostgreSQL porque precisa de transações..."
- "MongoDB porque esquema é flexível..."
- "Neo4j porque queries de grafo são mais rápidas..."

---

**BOA PROVA! 🎓🚀**
