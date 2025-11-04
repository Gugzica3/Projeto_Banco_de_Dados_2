// ============================================
// MINI-STEAM: Serviço de Catálogo (MongoDB)
// Port: 3002
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://ministeam:ministeam123@localhost:27017/ministeam_catalog?authSource=admin';
const client = new MongoClient(MONGO_URI);

let db;
let gamesCollection;

// Conectar ao MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('ministeam_catalog');
    gamesCollection = db.collection('games');
    
    // Criar índices se não existirem
    await gamesCollection.createIndex({ gameId: 1 }, { unique: true });
    await gamesCollection.createIndex({ nome: "text", descricao: "text" });
    await gamesCollection.createIndex({ tags: 1 });
    await gamesCollection.createIndex({ "avaliacao.media": -1 });
    
    console.log('✓ Conectado ao MongoDB com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

// ============================================
// ROTAS
// ============================================

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'servico-catalogo' });
});

// 1. Listar Catálogo (com filtros e paginação)
app.get('/catalog', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genero,
      tag,
      busca,
      precoMin,
      precoMax,
      sort = 'nome'
    } = req.query;

    // Construir query de filtros
    const query = { ativo: true };
    
    if (genero) {
      query.generos = genero;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (busca) {
      query.$text = { $search: busca };
    }
    
    if (precoMin || precoMax) {
      query.preco = {};
      if (precoMin) query.preco.$gte = parseFloat(precoMin);
      if (precoMax) query.preco.$lte = parseFloat(precoMax);
    }

    // Construir opções de ordenação
    const sortOptions = {};
    if (sort === 'preco_asc') sortOptions.preco = 1;
    else if (sort === 'preco_desc') sortOptions.preco = -1;
    else if (sort === 'avaliacao') sortOptions['avaliacao.media'] = -1;
    else sortOptions.nome = 1;

    // Paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Executar query
    const [games, total] = await Promise.all([
      gamesCollection
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .project({
          gameId: 1,
          nome: 1,
          descricao: 1,
          preco: 1,
          desconto: 1,
          tags: 1,
          generos: 1,
          'avaliacao.media': 1,
          'avaliacao.total_votos': 1,
          'midia.imagem_capa': 1
        })
        .toArray(),
      gamesCollection.countDocuments(query)
    ]);

    res.json({
      success: true,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      data: games
    });
  } catch (error) {
    console.error('Erro ao listar catálogo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar catálogo'
    });
  }
});

// 2. Buscar Detalhes de um Jogo
app.get('/catalog/:gameId', async (req, res) => {
  const { gameId } = req.params;
  
  try {
    const game = await gamesCollection.findOne({ gameId });
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Jogo não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar jogo'
    });
  }
});

// 3. Adicionar Jogo ao Catálogo
app.post('/catalog', async (req, res) => {
  const jogoData = req.body;
  
  // Validação básica
  if (!jogoData.gameId || !jogoData.nome || !jogoData.preco || !jogoData.desenvolvedora) {
    return res.status(400).json({
      success: false,
      error: 'gameId, nome, preco e desenvolvedora são obrigatórios'
    });
  }
  
  try {
    // Adiciona metadados automáticos
    const jogoCompleto = {
      ...jogoData,
      data_adicao_catalogo: new Date(),
      ultima_atualizacao: new Date(),
      ativo: true,
      // Define valores padrão para avaliação se não fornecido
      avaliacao: jogoData.avaliacao || {
        media: 0,
        total_votos: 0
      }
    };
    
    const result = await gamesCollection.insertOne(jogoCompleto);
    
    res.status(201).json({
      success: true,
      message: 'Jogo adicionado ao catálogo com sucesso',
      data: {
        _id: result.insertedId,
        gameId: jogoData.gameId,
        nome: jogoData.nome,
        data_adicao: jogoCompleto.data_adicao_catalogo
      }
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({
        success: false,
        error: 'Jogo com este gameId já existe no catálogo'
      });
    }
    
    console.error('Erro ao adicionar jogo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar jogo ao catálogo'
    });
  }
});

// 4. Atualizar Jogo
app.patch('/catalog/:gameId', async (req, res) => {
  const { gameId } = req.params;
  const updates = req.body;
  
  // Remove campos que não devem ser atualizados diretamente
  delete updates.gameId;
  delete updates._id;
  delete updates.data_adicao_catalogo;
  
  try {
    // Adiciona timestamp de atualização
    updates.ultima_atualizacao = new Date();
    
    const result = await gamesCollection.updateOne(
      { gameId },
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Jogo não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Jogo atualizado com sucesso',
      modificado: result.modifiedCount > 0
    });
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar jogo'
    });
  }
});

// 5. Buscar Jogos por IDs (útil para S1)
app.post('/catalog/batch', async (req, res) => {
  const { gameIds } = req.body;
  
  if (!Array.isArray(gameIds)) {
    return res.status(400).json({
      success: false,
      error: 'gameIds deve ser um array'
    });
  }
  
  try {
    const games = await gamesCollection
      .find({ gameId: { $in: gameIds } })
      .toArray();
    
    res.json({
      success: true,
      total: games.length,
      data: games
    });
  } catch (error) {
    console.error('Erro ao buscar jogos em lote:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar jogos'
    });
  }
});

// 6. Buscar Jogos por Desenvolvedora
app.get('/catalog/developer/:developer', async (req, res) => {
  const { developer } = req.params;
  
  try {
    const games = await gamesCollection
      .find({ desenvolvedora: developer, ativo: true })
      .sort({ nome: 1 })
      .toArray();
    
    res.json({
      success: true,
      desenvolvedora: developer,
      total: games.length,
      data: games
    });
  } catch (error) {
    console.error('Erro ao buscar jogos por desenvolvedora:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar jogos'
    });
  }
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================

async function startServer() {
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`╔════════════════════════════════════════════════╗`);
    console.log(`║  Serviço de Catálogo iniciado na porta ${PORT}   ║`);
    console.log(`╚════════════════════════════════════════════════╝`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, encerrando...');
  await client.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recebido, encerrando...');
  await client.close();
  process.exit(0);
});

// Iniciar servidor
startServer().catch(console.error);
