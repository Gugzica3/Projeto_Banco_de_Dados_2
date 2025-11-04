#!/usr/bin/env python3
# ============================================
# MINI-STEAM: Simulador S1 em Python
# ============================================

import requests
import json
import time
import random
from datetime import datetime
from typing import List, Dict

# Configuração dos endpoints
ENDPOINTS = {
    'usuarios': 'http://localhost:3001',
    'catalogo': 'http://localhost:3002',
    'social': 'http://localhost:3003'
}

# Log de verificação
verification_log = {
    'timestamp': datetime.now().isoformat(),
    'summary': {
        'totalRequests': 0,
        'successfulRequests': 0,
        'failedRequests': 0
    },
    'operations': []
}

def log_operation(op_type: str, endpoint: str, request_data: dict, response, success: bool):
    """Registra operação no log de verificação"""
    
    # === CORREÇÃO 1: Acessar o sub-dicionário 'summary' ===
    verification_log['summary']['totalRequests'] += 1
    if success:
        verification_log['summary']['successfulRequests'] += 1
    else:
        verification_log['summary']['failedRequests'] += 1
    
    # === CORREÇÃO 2: Tratar 'response' quando é um objeto de exceção ===
    response_json = None
    status_code = None
    
    if success:
        response_json = response.json()
        status_code = response.status_code
    else:
        response_json = str(response) # Loga a string do erro
        # Verifica se a exceção (response) tem um atributo .response (do requests)
        if hasattr(response, 'response') and hasattr(response.response, 'status_code'):
            status_code = response.response.status_code

    verification_log['operations'].append({
        'timestamp': datetime.now().isoformat(),
        'type': op_type,
        'endpoint': endpoint,
        'request': request_data,
        'response': response_json,
        'status': 'SUCCESS' if success else 'FAILED',
        'statusCode': status_code
    })

# ============================================
# TIPO 1: CRIAÇÃO DE USUÁRIOS
# ============================================

USUARIOS_FICTICIOS = [
    {'nome': 'João Silva', 'email': 'joao.silva@email.com', 'senha': 'senha123'},
    {'nome': 'Maria Santos', 'email': 'maria.santos@email.com', 'senha': 'senha123'},
    {'nome': 'Pedro Costa', 'email': 'pedro.costa@email.com', 'senha': 'senha123'},
    {'nome': 'Ana Lima', 'email': 'ana.lima@email.com', 'senha': 'senha123'},
    {'nome': 'Carlos Souza', 'email': 'carlos.souza@email.com', 'senha': 'senha123'},
    {'nome': 'Beatriz Alves', 'email': 'beatriz.alves@email.com', 'senha': 'senha123'},
    {'nome': 'Rafael Oliveira', 'email': 'rafael.oliveira@email.com', 'senha': 'senha123'},
    {'nome': 'Juliana Pereira', 'email': 'juliana.pereira@email.com', 'senha': 'senha123'},
    {'nome': 'Lucas Rodrigues', 'email': 'lucas.rodrigues@email.com', 'senha': 'senha123'},
    {'nome': 'Fernanda Martins', 'email': 'fernanda.martins@email.com', 'senha': 'senha123'}
]

def criar_usuarios() -> List[Dict]:
    """Cria usuários fictícios"""
    print('\n=== TIPO 1: Criando Usuários ===')
    usuarios_criados = []
    
    for usuario in USUARIOS_FICTICIOS:
        try:
            response = requests.post(f"{ENDPOINTS['usuarios']}/users", json=usuario)
            response.raise_for_status() # Lança exceção se status code for 4xx ou 5xx
            
            data = response.json()['data']
            print(f"✓ Usuário criado: {usuario['nome']} (ID: {data['id']})")
            
            usuarios_criados.append({
                'id': data['id'],
                'nome': usuario['nome'],
                'email': usuario['email']
            })
            
            log_operation('CREATE_USER', '/users', usuario, response, True)
            time.sleep(0.1)
            
        except Exception as e:
            print(f"✗ Erro ao criar usuário {usuario['nome']}: {str(e)}")
            log_operation('CREATE_USER', '/users', usuario, e, False)
    
    return usuarios_criados

# ============================================
# TIPO 2: CRIAÇÃO DE JOGOS NO CATÁLOGO
# ============================================

JOGOS_FICTICIOS = [
    {
        'gameId': 'the-witcher-3',
        'nome': 'The Witcher 3: Wild Hunt',
        'descricao': 'RPG de mundo aberto épico',
        'preco': 89.99,
        'desenvolvedora': 'CD Projekt RED',
        'tags': ['RPG', 'Mundo Aberto', 'Fantasia'],
        'generos': ['Action RPG'],
        'classificacao_etaria': '18'
    },
    {
        'gameId': 'cyberpunk-2077',
        'nome': 'Cyberpunk 2077',
        'descricao': 'RPG de ação futurista',
        'preco': 199.99,
        'desenvolvedora': 'CD Projekt RED',
        'tags': ['RPG', 'Cyberpunk', 'Open World'],
        'generos': ['Action RPG'],
        'classificacao_etaria': '18'
    },
    {
        'gameId': 'red-dead-2',
        'nome': 'Red Dead Redemption 2',
        'descricao': 'Aventura no velho oeste',
        'preco': 249.99,
        'desenvolvedora': 'Rockstar Games',
        'tags': ['Action', 'Adventure', 'Western'],
        'generos': ['Action'],
        'classificacao_etaria': '18'
    },
    {
        'gameId': 'stardew-valley',
        'nome': 'Stardew Valley',
        'descricao': 'Simulador de fazenda relaxante',
        'preco': 24.99,
        'desenvolvedora': 'ConcernedApe',
        'tags': ['Farming', 'Simulation', 'Indie'],
        'generos': ['Simulation'],
        'classificacao_etaria': '10'
    },
    {
        'gameId': 'hollow-knight',
        'nome': 'Hollow Knight',
        'descricao': 'Metroidvania desafiador',
        'preco': 34.99,
        'desenvolvedora': 'Team Cherry',
        'tags': ['Metroidvania', 'Indie', 'Platformer'],
        'generos': ['Action'],
        'classificacao_etaria': '10'
    },
    {
        'gameId': 'elden-ring',
        'nome': 'Elden Ring',
        'descricao': 'RPG de ação souls-like',
        'preco': 299.99,
        'desenvolvedora': 'FromSoftware',
        'tags': ['Souls-like', 'RPG', 'Mundo Aberto'],
        'generos': ['Action RPG'],
        'classificacao_etaria': '16'
    },
    {
        'gameId': 'baldurs-gate-3',
        'nome': "Baldur's Gate 3",
        'descricao': 'RPG baseado em D&D',
        'preco': 199.99,
        'desenvolvedora': 'Larian Studios',
        'tags': ['RPG', 'Turn-Based', 'Fantasy'],
        'generos': ['RPG'],
        'classificacao_etaria': '18'
    },
    {
        'gameId': 'hades',
        'nome': 'Hades',
        'descricao': 'Roguelike de ação mitológico',
        'preco': 49.99,
        'desenvolvedora': 'Supergiant Games',
        'tags': ['Roguelike', 'Action', 'Indie'],
        'generos': ['Action'],
        'classificacao_etaria': '12'
    },
    {
        'gameId': 'portal-2',
        'nome': 'Portal 2',
        'descricao': 'Puzzle de primeira pessoa',
        'preco': 29.99,
        'desenvolvedora': 'Valve',
        'tags': ['Puzzle', 'First-Person', 'Sci-Fi'],
        'generos': ['Puzzle'],
        'classificacao_etaria': '12'
    },
    {
        'gameId': 'terraria',
        'nome': 'Terraria',
        'descricao': 'Aventura de exploração 2D',
        'preco': 19.99,
        'desenvolvedora': 'Re-Logic',
        'tags': ['Sandbox', 'Adventure', 'Crafting'],
        'generos': ['Action'],
        'classificacao_etaria': '12'
    },
    {
        'gameId': 'minecraft',
        'nome': 'Minecraft',
        'descricao': 'Sandbox de construção infinita',
        'preco': 129.99,
        'desenvolvedora': 'Mojang Studios',
        'tags': ['Sandbox', 'Survival', 'Crafting'],
        'generos': ['Sandbox'],
        'classificacao_etaria': 'Livre'
    },
    {
        'gameId': 'dark-souls-3',
        'nome': 'Dark Souls III',
        'descricao': 'RPG de ação desafiador',
        'preco': 149.99,
        'desenvolvedora': 'FromSoftware',
        'tags': ['Souls-like', 'RPG', 'Dark Fantasy'],
        'generos': ['Action RPG'],
        'classificacao_etaria': '16'
    },
    {
        'gameId': 'celeste',
        'nome': 'Celeste',
        'descricao': 'Plataforma desafiador e emocionante',
        'preco': 39.99,
        'desenvolvedora': 'Maddy Makes Games',
        'tags': ['Platformer', 'Indie', 'Difficult'],
        'generos': ['Platformer'],
        'classificacao_etaria': '10'
    },
    {
        'gameId': 'disco-elysium',
        'nome': 'Disco Elysium',
        'descricao': 'RPG narrativo único',
        'preco': 89.99,
        'desenvolvedora': 'ZA/UM',
        'tags': ['RPG', 'Story Rich', 'Detective'],
        'generos': ['RPG'],
        'classificacao_etaria': '18'
    },
    {
        'gameId': 'sekiro',
        'nome': 'Sekiro: Shadows Die Twice',
        'descricao': 'Action-adventure no Japão feudal',
        'preco': 199.99,
        'desenvolvedora': 'FromSoftware',
        'tags': ['Action', 'Souls-like', 'Ninja'],
        'generos': ['Action'],
        'classificacao_etaria': '18'
    },
    {
        'gameId': 'undertale',
        'nome': 'Undertale',
        'descricao': 'RPG com escolhas únicas',
        'preco': 19.99,
        'desenvolvedora': 'Toby Fox',
        'tags': ['RPG', 'Indie', 'Story Rich'],
        'generos': ['RPG'],
        'classificacao_etaria': '10'
    },
    {
        'gameId': 'factorio',
        'nome': 'Factorio',
        'descricao': 'Simulador de automação industrial',
        'preco': 69.99,
        'desenvolvedora': 'Wube Software',
        'tags': ['Simulation', 'Strategy', 'Automation'],
        'generos': ['Simulation'],
        'classificacao_etaria': '10'
    },
    {
        'gameId': 'rimworld',
        'nome': 'RimWorld',
        'descricao': 'Simulador de colônia espacial',
        'preco': 79.99,
        'desenvolvedora': 'Ludeon Studios',
        'tags': ['Simulation', 'Strategy', 'Colony Sim'],
        'generos': ['Simulation'],
        'classificacao_etaria': '16'
    },
    {
        'gameId': 'subnautica',
        'nome': 'Subnautica',
        'descricao': 'Exploração submarina em mundo alienígena',
        'preco': 59.99,
        'desenvolvedora': 'Unknown Worlds',
        'tags': ['Survival', 'Exploration', 'Underwater'],
        'generos': ['Adventure'],
        'classificacao_etaria': '12'
    },
    {
        'gameId': 'valheim',
        'nome': 'Valheim',
        'descricao': 'Survival viking em mundo procedural',
        'preco': 49.99,
        'desenvolvedora': 'Iron Gate Studio',
        'tags': ['Survival', 'Crafting', 'Viking'],
        'generos': ['Survival'],
        'classificacao_etaria': '12'
    }
]

def criar_jogos_catalogo() -> List[Dict]:
    """Cria jogos no catálogo"""
    print('\n=== TIPO 2: Criando Jogos no Catálogo ===')
    jogos_criados = []
    
    for jogo in JOGOS_FICTICIOS:
        try:
            jogo_completo = {
                **jogo,
                'especificacoes': {
                    'minimo': {
                        'so': 'Windows 10',
                        'processador': 'Intel i5',
                        'memoria': '8 GB RAM',
                        'armazenamento': '50 GB'
                    }
                },
                'midia': {
                    'imagem_capa': f"https://cdn.ministeam.com/games/{jogo['gameId']}/cover.jpg"
                },
                'ativo': True
            }
            
            response = requests.post(f"{ENDPOINTS['catalogo']}/catalog", json=jogo_completo)
            response.raise_for_status()
            
            print(f"✓ Jogo criado: {jogo['nome']} (ID: {jogo['gameId']})")
            jogos_criados.append({'gameId': jogo['gameId'], 'nome': jogo['nome']})
            
            log_operation('CREATE_GAME', '/catalog', jogo_completo, response, True)
            time.sleep(0.1)
            
        except Exception as e:
            print(f"✗ Erro ao criar jogo {jogo['nome']}: {str(e)}")
            log_operation('CREATE_GAME', '/catalog', jogo, e, False)
    
    return jogos_criados

# ============================================
# SINCRONIZAÇÃO COM GRAFO SOCIAL
# ============================================

def sincronizar_grafo_social(usuarios: List[Dict], jogos: List[Dict]):
    """Sincroniza dados com Neo4j"""
    print('\n=== Sincronizando dados com Neo4j ===')
    
    # Adicionar usuários ao grafo
    for usuario in usuarios:
        try:
            req_data = {
                'userId': usuario['id'],
                'name': usuario['nome']
            }
            response = requests.post(f"{ENDPOINTS['social']}/users", json=req_data)
            response.raise_for_status()
            print(f"✓ Usuário {usuario['nome']} adicionado ao grafo")
            log_operation('SYNC_USER_GRAPH', '/users', req_data, response, True)
            time.sleep(0.05)
        except Exception as e:
            print(f"✗ Erro ao adicionar usuário ao grafo: {str(e)}")
            log_operation('SYNC_USER_GRAPH', '/users', req_data, e, False)
    
    # Adicionar jogos ao grafo
    for jogo in jogos:
        try:
            req_data = {
                'gameId': jogo['gameId'],
                'name': jogo['nome']
            }
            response = requests.post(f"{ENDPOINTS['social']}/games", json=req_data)
            response.raise_for_status()
            print(f"✓ Jogo {jogo['nome']} adicionado ao grafo")
            log_operation('SYNC_GAME_GRAPH', '/games', req_data, response, True)
            time.sleep(0.05)
        except Exception as e:
            print(f"✗ Erro ao adicionar jogo ao grafo: {str(e)}")
            log_operation('SYNC_GAME_GRAPH', '/games', req_data, e, False)

# ============================================
# TIPO 3: CRIAÇÃO DE RELAÇÕES
# ============================================

def criar_amizades(usuarios: List[Dict]):
    """Cria amizades entre usuários"""
    print('\n=== TIPO 3A: Criando Amizades (50 pedidos) ===')
    amizades_total = 0
    
    if not usuarios:
        print("✗ Nenhum usuário criado, pulando amizades.")
        return

    for _ in range(50):
        user1 = random.choice(usuarios)
        user2 = random.choice(usuarios)
        
        if user1['id'] == user2['id']:
            continue
        
        try:
            request_data = {'friendId': user2['id']}
            response = requests.post(
                f"{ENDPOINTS['social']}/users/{user1['id']}/friends",
                json=request_data
            )
            response.raise_for_status()
            
            print(f"✓ Amizade criada: {user1['nome']} <-> {user2['nome']}")
            amizades_total += 1
            
            log_operation('CREATE_FRIENDSHIP', f"/users/{user1['id']}/friends", 
                         request_data, response, True)
            time.sleep(0.1)
            
        except Exception as e:
            # Não logar erros de 'conflito' (amizade já existe)
            if not (hasattr(e, 'response') and e.response.status_code == 409):
                print(f"✗ Erro ao criar amizade: {str(e)}")
                log_operation('CREATE_FRIENDSHIP', f"/users/{user1['id']}/friends",
                             request_data, e, False)
    
    print(f"\n✓ Total de amizades criadas: {amizades_total}")

def simular_compras(usuarios: List[Dict], jogos: List[Dict]):
    """Simula compras de jogos"""
    print('\n=== TIPO 3B: Simulando Compras de Jogos (100 compras) ===')
    compras_total = 0
    
    if not usuarios or not jogos:
        print("✗ Nenhum usuário ou jogo criado, pulando compras.")
        return

    for _ in range(100):
        usuario = random.choice(usuarios)
        jogo = random.choice(jogos)
        preco_aleatorio = round(random.uniform(20, 200), 2)
        
        try:
            # Adiciona jogo à biblioteca (PostgreSQL)
            request_biblioteca = {
                'id_jogo': jogo['gameId'],
                'preco_pago': preco_aleatorio
            }
            
            response_pg = requests.post(
                f"{ENDPOINTS['usuarios']}/users/{usuario['id']}/library",
                json=request_biblioteca
            )
            response_pg.raise_for_status()
            
            print(f"✓ Compra: {usuario['nome']} adquiriu {jogo['nome']} (R$ {preco_aleatorio})")
            
            log_operation('PURCHASE_GAME_PG', f"/users/{usuario['id']}/library",
                         request_biblioteca, response_pg, True)
            
            # Registra propriedade no grafo (Neo4j)
            request_neo4j = {'gameId': jogo['gameId'], 'hoursPlayed': 0}
            response_neo4j = requests.post(
                f"{ENDPOINTS['social']}/users/{usuario['id']}/games",
                json=request_neo4j
            )
            response_neo4j.raise_for_status()
            log_operation('PURCHASE_GAME_NEO4J', f"/users/{usuario['id']}/games",
                         request_neo4j, response_neo4j, True)
            
            compras_total += 1
            time.sleep(0.15)
            
        except Exception as e:
            # Não logar erros de 'conflito' (compra já existe)
            if not (hasattr(e, 'response') and e.response.status_code == 409):
                print(f"✗ Erro na compra: {str(e)}")
                log_operation('PURCHASE_GAME_ERROR', 'Multi-DB',
                             {'user': usuario, 'game': jogo}, e, False)
    
    print(f"\n✓ Total de compras realizadas: {compras_total}")

# ============================================
# FUNÇÃO PRINCIPAL
# ============================================

def salvar_log_verificacao():
    """Salva log de verificação em arquivo JSON"""
    try:
        with open('s1_verification_log.json', 'w', encoding='utf-8') as f:
            json.dump(verification_log, f, indent=2, ensure_ascii=False)
        print('\n✓ Log de verificação salvo com sucesso')
    except Exception as e:
        print(f'✗ Erro ao salvar log: {str(e)}')

def executar_simulador():
    """Executa o simulador completo"""
    print('╔════════════════════════════════════════════════╗')
    print('║   MINI-STEAM: Simulador S1 Iniciado (Python)  ║')
    print('╚════════════════════════════════════════════════╝')
    
    start_time = time.time()
    
    try:
        # Tipo 1: Criar usuários
        usuarios = criar_usuarios()
        
        # Tipo 2: Criar jogos
        jogos = criar_jogos_catalogo()
        
        # Sincronizar com Neo4j
        sincronizar_grafo_social(usuarios, jogos)
        
        # Tipo 3: Criar relações
        criar_amizades(usuarios)
        simular_compras(usuarios, jogos)
        
        # === CONSULTAS DE VERIFICAÇÃO REMOVIDAS ===
        
        print('\n╔════════════════════════════════════════════════╗')
        print('║   Simulação Concluída!                        ║')
        print('╚════════════════════════════════════════════════╝')
        
    except Exception as e:
        print(f'\n✗ Erro fatal na execução: {type(e).__name__}: {str(e)}')
    
    finally:
        # Salvar log
        salvar_log_verificacao()
        end_time = time.time()
        print(f"\nTempo total de execução: {end_time - start_time:.2f} segundos")
        print(f"Total de requisições: {verification_log['summary']['totalRequests']}")
        print(f"Sucesso: {verification_log['summary']['successfulRequests']}")
        print(f"Falhas: {verification_log['summary']['failedRequests']}")
        print('\nLog salvo em: s1_verification_log.json')

if __name__ == '__main__':
    executar_simulador()