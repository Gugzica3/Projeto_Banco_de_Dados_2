// ============================================
// MINI-STEAM: Lógica do Serviço S1 (Simulador)
// ============================================

const axios = require('axios');
const fs = require('fs').promises;

// Configuração dos endpoints dos microsserviços
const ENDPOINTS = {
  usuarios: 'http://localhost:3001',
  catalogo: 'http://localhost:3002',
  social: 'http://localhost:3003'
};

// Log de verificação (requisito do projeto)
const verificationLog = {
  timestamp: new Date().toISOString(),
  summary: {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0
  },
  operations: []
};

// Função auxiliar para registrar operação no log
function logOperation(type, endpoint, request, response, success) {
  verificationLog.totalRequests++;
  if (success) {
    verificationLog.summary.successfulRequests++;
  } else {
    verificationLog.summary.failedRequests++;
  }
  
  verificationLog.operations.push({
    timestamp: new Date().toISOString(),
    type,
    endpoint,
    request,
    response: success ? response.data : response.message,
    status: success ? 'SUCCESS' : 'FAILED',
    statusCode: response.status || null
  });
}

// ============================================
// TIPO 1: CRIAÇÃO DE USUÁRIOS
// ============================================

const USUARIOS_FICTICIOS = [
  { nome: 'João Silva', email: 'joao.silva@email.com', senha: 'senha123' },
  { nome: 'Maria Santos', email: 'maria.santos@email.com', senha: 'senha123' },
  { nome: 'Pedro Costa', email: 'pedro.costa@email.com', senha: 'senha123' },
  { nome: 'Ana Lima', email: 'ana.lima@email.com', senha: 'senha123' },
  { nome: 'Carlos Souza', email: 'carlos.souza@email.com', senha: 'senha123' },
  { nome: 'Beatriz Alves', email: 'beatriz.alves@email.com', senha: 'senha123' },
  { nome: 'Rafael Oliveira', email: 'rafael.oliveira@email.com', senha: 'senha123' },
  { nome: 'Juliana Pereira', email: 'juliana.pereira@email.com', senha: 'senha123' },
  { nome: 'Lucas Rodrigues', email: 'lucas.rodrigues@email.com', senha: 'senha123' },
  { nome: 'Fernanda Martins', email: 'fernanda.martins@email.com', senha: 'senha123' }
];

async function criarUsuarios() {
  console.log('\n=== TIPO 1: Criando Usuários ===');
  const usuariosCriados = [];
  
  for (const usuario of USUARIOS_FICTICIOS) {
    try {
      const response = await axios.post(`${ENDPOINTS.usuarios}/users`, usuario);
      console.log(`✓ Usuário criado: ${usuario.nome} (ID: ${response.data.data.id})`);
      
      usuariosCriados.push({
        ...response.data.data,
        nome: usuario.nome
      });
      
      logOperation('CREATE_USER', '/users', usuario, response, true);
      
      // Aguarda 100ms entre requisições para evitar sobrecarga
      await sleep(100);
    } catch (error) {
      console.error(`✗ Erro ao criar usuário ${usuario.nome}:`, error.message);
      logOperation('CREATE_USER', '/users', usuario, error, false);
    }
  }
  
  return usuariosCriados;
}

// ============================================
// TIPO 2: CRIAÇÃO DE JOGOS NO CATÁLOGO
// ============================================

const JOGOS_FICTICIOS = [
  {
    gameId: 'the-witcher-3',
    nome: 'The Witcher 3: Wild Hunt',
    descricao: 'RPG de mundo aberto épico',
    preco: 89.99,
    desenvolvedora: 'CD Projekt RED',
    tags: ['RPG', 'Mundo Aberto', 'Fantasia'],
    generos: ['Action RPG'],
    classificacao_etaria: '18'
  },
  {
    gameId: 'cyberpunk-2077',
    nome: 'Cyberpunk 2077',
    descricao: 'RPG de ação futurista',
    preco: 199.99,
    desenvolvedora: 'CD Projekt RED',
    tags: ['RPG', 'Cyberpunk', 'Open World'],
    generos: ['Action RPG'],
    classificacao_etaria: '18'
  },
  {
    gameId: 'red-dead-2',
    nome: 'Red Dead Redemption 2',
    descricao: 'Aventura no velho oeste',
    preco: 249.99,
    desenvolvedora: 'Rockstar Games',
    tags: ['Action', 'Adventure', 'Western'],
    generos: ['Action'],
    classificacao_etaria: '18'
  },
  {
    gameId: 'stardew-valley',
    nome: 'Stardew Valley',
    descricao: 'Simulador de fazenda relaxante',
    preco: 24.99,
    desenvolvedora: 'ConcernedApe',
    tags: ['Farming', 'Simulation', 'Indie'],
    generos: ['Simulation'],
    classificacao_etaria: '10'
  },
  {
    gameId: 'hollow-knight',
    nome: 'Hollow Knight',
    descricao: 'Metroidvania desafiador',
    preco: 34.99,
    desenvolvedora: 'Team Cherry',
    tags: ['Metroidvania', 'Indie', 'Platformer'],
    generos: ['Action'],
    classificacao_etaria: '10'
  },
  {
    gameId: 'elden-ring',
    nome: 'Elden Ring',
    descricao: 'RPG de ação souls-like',
    preco: 299.99,
    desenvolvedora: 'FromSoftware',
    tags: ['Souls-like', 'RPG', 'Mundo Aberto'],
    generos: ['Action RPG'],
    classificacao_etaria: '16'
  },
  {
    gameId: 'baldurs-gate-3',
    nome: "Baldur's Gate 3",
    descricao: 'RPG baseado em D&D',
    preco: 199.99,
    desenvolvedora: 'Larian Studios',
    tags: ['RPG', 'Turn-Based', 'Fantasy'],
    generos: ['RPG'],
    classificacao_etaria: '18'
  },
  {
    gameId: 'hades',
    nome: 'Hades',
    descricao: 'Roguelike de ação mitológico',
    preco: 49.99,
    desenvolvedora: 'Supergiant Games',
    tags: ['Roguelike', 'Action', 'Indie'],
    generos: ['Action'],
    classificacao_etaria: '12'
  },
  {
    gameId: 'portal-2',
    nome: 'Portal 2',
    descricao: 'Puzzle de primeira pessoa',
    preco: 29.99,
    desenvolvedora: 'Valve',
    tags: ['Puzzle', 'First-Person', 'Sci-Fi'],
    generos: ['Puzzle'],
    classificacao_etaria: '12'
  },
  {
    gameId: 'terraria',
    nome: 'Terraria',
    descricao: 'Aventura de exploração 2D',
    preco: 19.99,
    desenvolvedora: 'Re-Logic',
    tags: ['Sandbox', 'Adventure', 'Crafting'],
    generos: ['Action'],
    classificacao_etaria: '12'
  },
  {
    gameId: 'minecraft',
    nome: 'Minecraft',
    descricao: 'Sandbox de construção infinita',
    preco: 129.99,
    desenvolvedora: 'Mojang Studios',
    tags: ['Sandbox', 'Survival', 'Crafting'],
    generos: ['Sandbox'],
    classificacao_etaria: 'Livre'
  },
  {
    gameId: 'dark-souls-3',
    nome: 'Dark Souls III',
    descricao: 'RPG de ação desafiador',
    preco: 149.99,
    desenvolvedora: 'FromSoftware',
    tags: ['Souls-like', 'RPG', 'Dark Fantasy'],
    generos: ['Action RPG'],
    classificacao_etaria: '16'
  },
  {
    gameId: 'celeste',
    nome: 'Celeste',
    descricao: 'Plataforma desafiador e emocionante',
    preco: 39.99,
    desenvolvedora: 'Maddy Makes Games',
    tags: ['Platformer', 'Indie', 'Difficult'],
    generos: ['Platformer'],
    classificacao_etaria: '10'
  },
  {
    gameId: 'disco-elysium',
    nome: 'Disco Elysium',
    descricao: 'RPG narrativo único',
    preco: 89.99,
    desenvolvedora: 'ZA/UM',
    tags: ['RPG', 'Story Rich', 'Detective'],
    generos: ['RPG'],
    classificacao_etaria: '18'
  },
  {
    gameId: 'sekiro',
    nome: 'Sekiro: Shadows Die Twice',
    descricao: 'Action-adventure no Japão feudal',
    preco: 199.99,
    desenvolvedora: 'FromSoftware',
    tags: ['Action', 'Souls-like', 'Ninja'],
    generos: ['Action'],
    classificacao_etaria: '18'
  },
  {
    gameId: 'undertale',
    nome: 'Undertale',
    descricao: 'RPG com escolhas únicas',
    preco: 19.99,
    desenvolvedora: 'Toby Fox',
    tags: ['RPG', 'Indie', 'Story Rich'],
    generos: ['RPG'],
    classificacao_etaria: '10'
  },
  {
    gameId: 'factorio',
    nome: 'Factorio',
    descricao: 'Simulador de automação industrial',
    preco: 69.99,
    desenvolvedora: 'Wube Software',
    tags: ['Simulation', 'Strategy', 'Automation'],
    generos: ['Simulation'],
    classificacao_etaria: '10'
  },
  {
    gameId: 'rimworld',
    nome: 'RimWorld',
    descricao: 'Simulador de colônia espacial',
    preco: 79.99,
    desenvolvedora: 'Ludeon Studios',
    tags: ['Simulation', 'Strategy', 'Colony Sim'],
    generos: ['Simulation'],
    classificacao_etaria: '16'
  },
  {
    gameId: 'subnautica',
    nome: 'Subnautica',
    descricao: 'Exploração submarina em mundo alienígena',
    preco: 59.99,
    desenvolvedora: 'Unknown Worlds',
    tags: ['Survival', 'Exploration', 'Underwater'],
    generos: ['Adventure'],
    classificacao_etaria: '12'
  },
  {
    gameId: 'valheim',
    nome: 'Valheim',
    descricao: 'Survival viking em mundo procedural',
    preco: 49.99,
    desenvolvedora: 'Iron Gate Studio',
    tags: ['Survival', 'Crafting', 'Viking'],
    generos: ['Survival'],
    classificacao_etaria: '12'
  }
];

async function criarJogosCatalogo() {
  console.log('\n=== TIPO 2: Criando Jogos no Catálogo ===');
  const jogosCriados = [];
  
  for (const jogo of JOGOS_FICTICIOS) {
    try {
      // Adiciona especificações técnicas para enriquecer o documento
      const jogoCompleto = {
        ...jogo,
        especificacoes: {
          minimo: {
            so: 'Windows 10',
            processador: 'Intel i5',
            memoria: '8 GB RAM',
            armazenamento: '50 GB'
          }
        },
        midia: {
          imagem_capa: `https://cdn.ministeam.com/games/${jogo.gameId}/cover.jpg`
        },
        ativo: true
      };
      
      const response = await axios.post(`${ENDPOINTS.catalogo}/catalog`, jogoCompleto);
      console.log(`✓ Jogo criado: ${jogo.nome} (ID: ${jogo.gameId})`);
      
      jogosCriados.push({ gameId: jogo.gameId, nome: jogo.nome });
      logOperation('CREATE_GAME', '/catalog', jogoCompleto, response, true);
      
      await sleep(100);
    } catch (error) {
      console.error(`✗ Erro ao criar jogo ${jogo.nome}:`, error.message);
      logOperation('CREATE_GAME', '/catalog', jogo, error, false);
    }
  }
  
  return jogosCriados;
}

// ============================================
// SINCRONIZAÇÃO COM GRAFO SOCIAL
// ============================================

async function sincronizarGrafoSocial(usuarios, jogos) {
  console.log('\n=== Sincronizando dados com Neo4j ===');
  
  // Adicionar usuários ao grafo
  for (const usuario of usuarios) {
    try {
      await axios.post(`${ENDPOINTS.social}/users`, {
        userId: usuario.id,
        name: usuario.nome
      });
      console.log(`✓ Usuário ${usuario.nome} adicionado ao grafo`);
      await sleep(50);
    } catch (error) {
      console.error(`✗ Erro ao adicionar usuário ao grafo:`, error.message);
    }
  }
  
  // Adicionar jogos ao grafo
  for (const jogo of jogos) {
    try {
      await axios.post(`${ENDPOINTS.social}/games`, {
        gameId: jogo.gameId,
        name: jogo.nome
      });
      console.log(`✓ Jogo ${jogo.nome} adicionado ao grafo`);
      await sleep(50);
    } catch (error) {
      console.error(`✗ Erro ao adicionar jogo ao grafo:`, error.message);
    }
  }
}

// ============================================
// TIPO 3: CRIAÇÃO DE RELAÇÕES
// ============================================

async function criarAmizades(usuarios) {
  console.log('\n=== TIPO 3A: Criando Amizades (50 pedidos) ===');
  let amistadesTotal = 0;
  
  for (let i = 0; i < 50; i++) {
    // Seleciona dois usuários aleatórios diferentes
    const user1 = usuarios[Math.floor(Math.random() * usuarios.length)];
    const user2 = usuarios[Math.floor(Math.random() * usuarios.length)];
    
    if (user1.id === user2.id) continue; // Evita amizade consigo mesmo
    
    try {
      const request = { friendId: user2.id };
      const response = await axios.post(
        `${ENDPOINTS.social}/users/${user1.id}/friends`,
        request
      );
      
      console.log(`✓ Amizade criada: ${user1.nome} <-> ${user2.nome}`);
      amistadesTotal++;
      
      logOperation(
        'CREATE_FRIENDSHIP',
        `/users/${user1.id}/friends`,
        request,
        response,
        true
      );
      
      await sleep(100);
    } catch (error) {
      // Erro esperado se amizade já existe
      if (error.response?.status !== 409) {
        console.error(`✗ Erro ao criar amizade:`, error.message);
      }
      logOperation(
        'CREATE_FRIENDSHIP',
        `/users/${user1.id}/friends`,
        { friendId: user2.id },
        error,
        false
      );
    }
  }
  
  console.log(`\n✓ Total de amizades criadas: ${amistadesTotal}`);
}

async function simularCompras(usuarios, jogos) {
  console.log('\n=== TIPO 3B: Simulando Compras de Jogos (100 compras) ===');
  let comprasTotal = 0;
  
  for (let i = 0; i < 100; i++) {
    const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
    const jogo = jogos[Math.floor(Math.random() * jogos.length)];
    
    const precoAleatorio = (Math.random() * 200 + 20).toFixed(2);
    
    try {
      // 1. Adiciona jogo à biblioteca (PostgreSQL)
      const requestBiblioteca = {
        id_jogo: jogo.gameId,
        preco_pago: parseFloat(precoAleatorio)
      };
      
      const responseBiblioteca = await axios.post(
        `${ENDPOINTS.usuarios}/users/${usuario.id}/library`,
        requestBiblioteca
      );
      
      console.log(`✓ Compra: ${usuario.nome} adquiriu ${jogo.nome} (R$ ${precoAleatorio})`);
      
      logOperation(
        'PURCHASE_GAME',
        `/users/${usuario.id}/library`,
        requestBiblioteca,
        responseBiblioteca,
        true
      );
      
      // 2. Registra propriedade no grafo (Neo4j)
      await axios.post(
        `${ENDPOINTS.social}/users/${usuario.id}/games`,
        { gameId: jogo.gameId, hoursPlayed: 0 }
      );
      
      comprasTotal++;
      await sleep(150);
      
    } catch (error) {
      // Erro 409 esperado se usuário já possui o jogo
      if (error.response?.status !== 409) {
        console.error(`✗ Erro na compra:`, error.message);
      }
      logOperation(
        'PURCHASE_GAME',
        `/users/${usuario.id}/library`,
        { id_jogo: jogo.gameId },
        error,
        false
      );
    }
  }
  
  console.log(`\n✓ Total de compras realizadas: ${comprasTotal}`);
}

// ============================================
// CONSULTAS DE VERIFICAÇÃO
// ============================================

async function consultarRecomendacoes(usuarios) {
  console.log('\n=== Consultando Recomendações ===');
  
  // Consulta recomendações para 3 usuários aleatórios
  const usuariosAmostra = usuarios.slice(0, 3);
  
  for (const usuario of usuariosAmostra) {
    try {
      const response = await axios.get(
        `${ENDPOINTS.social}/users/${usuario.id}/recommendations?limit=5`
      );
      
      console.log(`\n✓ Recomendações para ${usuario.nome}:`);
      response.data.data.forEach(rec => {
        console.log(`  - ${rec.name} (${rec.amigos_que_jogam} amigos jogam)`);
      });
      
      logOperation(
        'GET_RECOMMENDATIONS',
        `/users/${usuario.id}/recommendations`,
        null,
        response,
        true
      );
      
    } catch (error) {
      console.error(`✗ Erro ao consultar recomendações:`, error.message);
      logOperation(
        'GET_RECOMMENDATIONS',
        `/users/${usuario.id}/recommendations`,
        null,
        error,
        false
      );
    }
  }
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

async function executarSimulador() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   MINI-STEAM: Simulador S1 Iniciado           ║');
  console.log('╚════════════════════════════════════════════════╝');
  
  try {
    // Tipo 1: Criar usuários
    const usuarios = await criarUsuarios();
    
    // Tipo 2: Criar jogos
    const jogos = await criarJogosCatalogo();
    
    // Sincronizar com Neo4j
    await sincronizarGrafoSocial(usuarios, jogos);
    
    // Tipo 3: Criar relações
    await criarAmizades(usuarios);
    await simularCompras(usuarios, jogos);
    
    // Consultas de verificação
    await consultarRecomendacoes(usuarios);
    
    // Salvar log de verificação
    await salvarLogVerificacao();
    
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   Simulação Concluída com Sucesso!            ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log(`\nTotal de requisições: ${verificationLog.summary.totalRequests}`);
    console.log(`Sucesso: ${verificationLog.summary.successfulRequests}`);
    console.log(`Falhas: ${verificationLog.summary.failedRequests}`);
    console.log('\nLog salvo em: s1_verification_log.json');
    
  } catch (error) {
    console.error('\n✗ Erro fatal na execução:', error);
    await salvarLogVerificacao();
  }
}

// ============================================
// UTILITÁRIOS
// ============================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function salvarLogVerificacao() {
  try {
    await fs.writeFile(
      's1_verification_log.json',
      JSON.stringify(verificationLog, null, 2),
      'utf8'
    );
    console.log('\n✓ Log de verificação salvo com sucesso');
  } catch (error) {
    console.error('✗ Erro ao salvar log:', error.message);
  }
}

// Executar simulador
if (require.main === module) {
  executarSimulador();
}

module.exports = { executarSimulador };
