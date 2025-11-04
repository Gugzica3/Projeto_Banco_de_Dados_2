// ============================================
// MINI-STEAM: MongoDB Document Model
// Coleção: games (Catálogo de Jogos)
// ============================================

// Exemplo de Documento Completo
const gameDocument = {
  "_id": "game_001",
  "gameId": "the-witcher-3-wild-hunt",
  "nome": "The Witcher 3: Wild Hunt",
  "descricao": "Um RPG de mundo aberto épico onde você controla Geralt de Rivia, um caçador de monstros em busca de sua filha adotiva.",
  "descricao_completa": "The Witcher 3: Wild Hunt é um jogo eletrônico de RPG de ação em mundo aberto desenvolvido pela CD Projekt RED. O jogo apresenta uma narrativa envolvente, combate dinâmico e um vasto mundo para explorar.",
  
  // Informações Comerciais
  "preco": 89.99,
  "desconto": {
    "ativo": true,
    "percentual": 50,
    "preco_final": 44.99,
    "data_fim": "2025-12-31T23:59:59Z"
  },
  "moeda": "BRL",
  
  // Metadados do Jogo
  "desenvolvedora": "CD Projekt RED",
  "publicadora": "CD Projekt",
  "data_lancamento": "2015-05-19",
  "plataformas": ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
  
  // Classificação e Avaliações
  "classificacao_etaria": "18",
  "avaliacao": {
    "media": 4.8,
    "total_votos": 125430,
    "positivas": 98,
    "negativas": 2
  },
  
  // Categorização Flexível
  "tags": ["RPG", "Mundo Aberto", "História Rica", "Fantasia", "Single-player"],
  "generos": ["Action RPG", "Adventure"],
  "categorias": ["Single-player", "Steam Achievements", "Full Controller Support"],
  
  // Especificações Técnicas (Estrutura Aninhada)
  "especificacoes": {
    "minimo": {
      "so": "Windows 7 64-bit",
      "processador": "Intel Core i5-2500K 3.3GHz / AMD Phenom II X4 940",
      "memoria": "6 GB RAM",
      "graficos": "NVIDIA GeForce GTX 660 / AMD Radeon HD 7870",
      "directx": "Version 11",
      "armazenamento": "35 GB",
      "observacoes": "Configuração para 1080p com gráficos baixos a 30 FPS"
    },
    "recomendado": {
      "so": "Windows 10 64-bit",
      "processador": "Intel Core i7-3770 3.4 GHz / AMD FX-8350 4 GHz",
      "memoria": "8 GB RAM",
      "graficos": "NVIDIA GeForce GTX 770 / AMD Radeon R9 290",
      "directx": "Version 11",
      "armazenamento": "35 GB SSD",
      "observacoes": "Configuração para 1080p com gráficos altos a 60 FPS"
    }
  },
  
  // Conteúdo Adicional
  "dlcs": [
    {
      "dlcId": "hearts-of-stone",
      "nome": "Hearts of Stone",
      "preco": 29.99,
      "data_lancamento": "2015-10-13"
    },
    {
      "dlcId": "blood-and-wine",
      "nome": "Blood and Wine",
      "preco": 39.99,
      "data_lancamento": "2016-05-31"
    }
  ],
  
  // Mídia
  "midia": {
    "imagem_capa": "https://cdn.ministeam.com/games/witcher3/cover.jpg",
    "imagem_background": "https://cdn.ministeam.com/games/witcher3/background.jpg",
    "screenshots": [
      "https://cdn.ministeam.com/games/witcher3/screenshot1.jpg",
      "https://cdn.ministeam.com/games/witcher3/screenshot2.jpg",
      "https://cdn.ministeam.com/games/witcher3/screenshot3.jpg"
    ],
    "trailer_url": "https://youtube.com/watch?v=..."
  },
  
  // Idiomas Suportados
  "idiomas": {
    "interface": ["Português", "Inglês", "Espanhol", "Francês", "Alemão"],
    "audio": ["Português", "Inglês", "Polonês"],
    "legendas": ["Português", "Inglês", "Espanhol", "Francês", "Alemão", "Italiano"]
  },
  
  // Estatísticas e Metadados
  "estatisticas": {
    "total_vendas": 50000000,
    "pico_jogadores_simultaneos": 103000,
    "jogadores_ativos_mes": 450000
  },
  
  // Timestamps
  "data_adicao_catalogo": "2015-05-19T00:00:00Z",
  "ultima_atualizacao": "2025-11-01T10:30:00Z",
  "ativo": true
};

// ============================================
// Índices para Performance
// ============================================

// No MongoDB shell ou script de inicialização:
/*
db.games.createIndex({ "gameId": 1 }, { unique: true });
db.games.createIndex({ "nome": "text", "descricao": "text" }); // Busca full-text
db.games.createIndex({ "tags": 1 });
db.games.createIndex({ "generos": 1 });
db.games.createIndex({ "preco": 1 });
db.games.createIndex({ "avaliacao.media": -1 }); // Ordenar por avaliação
db.games.createIndex({ "data_lancamento": -1 }); // Lançamentos recentes
db.games.createIndex({ "ativo": 1 });

// Índice composto para filtros comuns
db.games.createIndex({ "ativo": 1, "preco": 1, "avaliacao.media": -1 });
*/

// ============================================
// Exemplo de Jogo Indie (Esquema Mais Simples)
// ============================================

const indieGameDocument = {
  "_id": "game_002",
  "gameId": "stardew-valley",
  "nome": "Stardew Valley",
  "descricao": "Simulador de fazenda relaxante e envolvente.",
  "preco": 24.99,
  "desenvolvedora": "ConcernedApe",
  "publicadora": "ConcernedApe",
  "data_lancamento": "2016-02-26",
  "tags": ["Farming", "Simulation", "Indie", "Relaxing"],
  "generos": ["Simulation", "RPG"],
  "classificacao_etaria": "10",
  "avaliacao": {
    "media": 4.9,
    "total_votos": 89000
  },
  "especificacoes": {
    "minimo": {
      "so": "Windows Vista",
      "processador": "2 GHz",
      "memoria": "2 GB RAM",
      "graficos": "256 MB",
      "armazenamento": "500 MB"
    }
  },
  "midia": {
    "imagem_capa": "https://cdn.ministeam.com/games/stardew/cover.jpg"
  },
  "ativo": true
};

// ============================================
// Schema Validation (Opcional, mas recomendado)
// ============================================

/*
db.createCollection("games", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["gameId", "nome", "preco", "desenvolvedora"],
      properties: {
        gameId: {
          bsonType: "string",
          description: "ID único do jogo (obrigatório)"
        },
        nome: {
          bsonType: "string",
          description: "Nome do jogo (obrigatório)"
        },
        preco: {
          bsonType: "number",
          minimum: 0,
          description: "Preço do jogo (obrigatório)"
        },
        avaliacao: {
          bsonType: "object",
          properties: {
            media: {
              bsonType: "number",
              minimum: 0,
              maximum: 5
            }
          }
        }
      }
    }
  }
});
*/
