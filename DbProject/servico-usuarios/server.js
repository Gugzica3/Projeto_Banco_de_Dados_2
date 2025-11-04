
// ============================================
// servico-usuarios/server.js
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'ministeam',
  password: process.env.DB_PASSWORD || 'ministeam123',
  database: process.env.DB_NAME || 'ministeam_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err.stack);
  } else {
    console.log('✓ Conectado ao PostgreSQL com sucesso');
    release();
  }
});

// ============================================
// ROTAS
// ============================================

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'servico-usuarios' });
});

// 1. Criar Usuário
app.post('/users', async (req, res) => {
  const { nome, email, senha } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({
      success: false,
      error: 'Nome, email e senha são obrigatórios'
    });
  }
  
  try {
    // Hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);
    
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, nome, email, data_criacao`,
      [nome, email, senha_hash]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // Constraint violation (email duplicado)
      return res.status(409).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }
    
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar usuário'
    });
  }
});

// 2. Buscar Usuário por ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT id, nome, email, data_criacao, ultimo_acesso, ativo FROM usuarios WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuário'
    });
  }
});

// 3. Listar Todos os Usuários
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nome, email FROM usuarios WHERE ativo = true ORDER BY nome'
    );
    
    res.json({
      success: true,
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar usuários'
    });
  }
});

// 4. Listar Biblioteca do Usuário
app.get('/users/:id/library', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT id, id_jogo, data_aquisicao, preco_pago, tempo_jogado 
       FROM bibliotecas 
       WHERE id_usuario = $1 
       ORDER BY data_aquisicao DESC`,
      [id]
    );
    
    res.json({
      success: true,
      userId: id,
      totalJogos: result.rows.length,
      jogos: result.rows
    });
  } catch (error) {
    console.error('Erro ao listar biblioteca:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar biblioteca'
    });
  }
});

// 5. Adicionar Jogo à Biblioteca (Compra)
app.post('/users/:id/library', async (req, res) => {
  const { id } = req.params;
  const { id_jogo, preco_pago } = req.body;
  
  if (!id_jogo || preco_pago === undefined) {
    return res.status(400).json({
      success: false,
      error: 'id_jogo e preco_pago são obrigatórios'
    });
  }
  
  try {
    // Verifica se usuário existe
    const userCheck = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    // Adiciona à biblioteca
    const result = await pool.query(
      `INSERT INTO bibliotecas (id_usuario, id_jogo, preco_pago) 
       VALUES ($1, $2, $3) 
       RETURNING id, id_usuario, id_jogo, data_aquisicao, preco_pago`,
      [id, id_jogo, preco_pago]
    );
    
    res.status(201).json({
      success: true,
      message: 'Jogo adicionado à biblioteca com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // Usuário já possui o jogo
      return res.status(409).json({
        success: false,
        error: 'Usuário já possui este jogo'
      });
    }
    
    console.error('Erro ao adicionar jogo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar jogo à biblioteca'
    });
  }
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`╔════════════════════════════════════════════════╗`);
  console.log(`║  Serviço de Usuários iniciado na porta ${PORT}   ║`);
  console.log(`╚════════════════════════════════════════════════╝`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, encerrando...');
  await pool.end();
  process.exit(0);
});
