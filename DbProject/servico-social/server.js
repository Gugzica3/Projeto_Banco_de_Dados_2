// --- 1. Importações ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

// --- 2. Configuração do App ---
const app = express();
app.use(cors());
app.use(express.json()); // Middleware para ler JSON

const PORT = process.env.PORT || 3003; // [cite: 132]

// --- 3. Conexão com o Neo4j ---
// [cite: 117-121, 133, 134, 135]
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Função para verificar a conexão
const testNeo4jConnection = async () => {
  try {
    await driver.verifyConnectivity();
    console.log('✓ Conectado ao Neo4j com sucesso');
  } catch (error) {
    console.error('✗ Erro ao conectar ao Neo4j:', error);
  }
};

// --- 4. Definição das Rotas (Stubs) ---

// Rota de "saúde" para testes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'servico-social' });
});

// [cite: 124] POST /users (adicionar usuário ao grafo)
app.post('/users', async (req, res) => {
  // Lógica para criar nó (Usuario)
  res.status(201).json({ message: 'Stub: Usuário criado no grafo', data: req.body });
});

// [cite: 125] POST /games (adicionar jogo ao grafo)
app.post('/games', async (req, res) => {
  // Lógica para criar nó (Jogo)
  res.status(201).json({ message: 'Stub: Jogo criado no grafo', data: req.body });
});

// [cite: 126] POST /users/:id/friends (adicionar amizade)
app.post('/users/:id/friends', async (req, res) => {
  const { id } = req.params;
  const { friendId } = req.body;
  // Lógica para criar relação (AMIGO_DE)
  res.status(201).json({ message: `Stub: Amizade criada entre ${id} e ${friendId}` });
});

// [cite: 127] GET /users/:id/friends (listar amigos)
app.get('/users/:id/friends', async (req, res) => {
  const { id } = req.params;
  // Lógica para buscar nós (AMIGO_DE)
  res.status(200).json({ message: `Stub: Listando amigos de ${id}`, data: [] });
});

// [cite: 128] POST /users/:id/games (registrar propriedade)
app.post('/users/:id/games', async (req, res) => {
  const { id } = req.params;
  const { gameId } = req.body;
  // Lógica para criar relação (POSSUI)
  res.status(201).json({ message: `Stub: Usuário ${id} agora possui jogo ${gameId}` });
});

// [cite: 129] GET /users/:id/recommendations (obter recomendações)
app.get('/users/:id/recommendations', async (req, res) => {
  const { id } = req.params;
  // Lógica complexa de recomendação (ex: amigos de amigos que possuem jogos)
  res.status(200).json({ message: `Stub: Recomendações para ${id}`, data: [] });
});

// --- 5. Inicialização do Servidor ---
app.listen(PORT, async () => {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log(`║  Serviço Social iniciado na porta ${PORT}      ║`);
  console.log('╚═══════════════════════════════════════════════╝');
  await testNeo4jConnection();
});

// --- 6. Fechamento Gracioso ---
process.on('SIGINT', async () => {
  console.log('Fechando conexão com o Neo4j...');
  await driver.close();
  process.exit();
});
