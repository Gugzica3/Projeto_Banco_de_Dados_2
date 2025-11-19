# 📖 ÍNDICE DO MATERIAL DE ESTUDO - MINI-STEAM
## Guia Completo Para Sua Prova de Banco de Dados 2

---

## 🎯 COMECE AQUI!

Você tem uma prova amanhã e precisa aprender tudo sobre este projeto de Persistência Poliglota. Este índice vai te guiar pelos 4 documentos de estudo que preparei para você.

---

## 📚 VISÃO GERAL DO MATERIAL

| Documento | Tamanho | Tempo de Leitura | Quando Usar |
|-----------|---------|------------------|-------------|
| **GUIA_DE_ESTUDOS.md** | 36KB | 2-3 horas | Primeira leitura completa |
| **COLA_RAPIDA.md** | 6KB | 15 minutos | Revisão rápida, dia da prova |
| **PERGUNTAS_E_RESPOSTAS.md** | 16KB | 1 hora | Auto-teste, prática |
| **DIAGRAMAS_VISUAIS.md** | 37KB | 1 hora | Entender arquitetura visualmente |

**Total:** ~4-5 horas para dominar todo o conteúdo

---

## 📋 PLANO DE ESTUDOS RECOMENDADO

### 🗓️ Se você tem 3 dias:

#### **Dia 1 (3 horas) - Aprendizado Inicial**
1. ⏰ 30 min: Ler **COLA_RAPIDA.md** para overview geral
2. ⏰ 2 horas: Ler **GUIA_DE_ESTUDOS.md** partes 1-5
3. ⏰ 30 min: Executar o projeto (seção "Como Executar")

#### **Dia 2 (3 horas) - Aprofundamento**
1. ⏰ 1 hora: Terminar **GUIA_DE_ESTUDOS.md** partes 6-10
2. ⏰ 1 hora: Estudar **DIAGRAMAS_VISUAIS.md** (focar nos fluxos)
3. ⏰ 1 hora: Praticar queries nos 3 bancos de dados

#### **Dia 3 (2 horas) - Revisão e Testes**
1. ⏰ 1 hora: Responder **PERGUNTAS_E_RESPOSTAS.md** (tente sozinho primeiro)
2. ⏰ 30 min: Revisar **COLA_RAPIDA.md** novamente
3. ⏰ 30 min: Checar checklist pré-prova

### 🚨 Se você tem APENAS HOJE (5 horas crash course):

#### **Manhã (3 horas)**
1. ⏰ 30 min: **COLA_RAPIDA.md** completo - memorizar conceitos-chave
2. ⏰ 1 hora: **GUIA_DE_ESTUDOS.md** - ler APENAS:
   - Parte 1 (Conceitos Fundamentais)
   - Parte 2 (Arquitetura)
   - Parte 3 (Modelagem)
3. ⏰ 1h30: **DIAGRAMAS_VISUAIS.md** - focar em:
   - Arquitetura completa
   - Modelo de dados dos 3 bancos
   - Fluxo de compra de jogo

#### **Tarde (2 horas)**
1. ⏰ 1 hora: **PERGUNTAS_E_RESPOSTAS.md** - responder categorias:
   - Conceitos fundamentais (P1-P5)
   - Justificativas dos 3 bancos (P6, P13, P20)
   - Queries essenciais (P39-P42)
2. ⏰ 30 min: Executar projeto uma vez (para fixar)
3. ⏰ 30 min: Revisar **COLA_RAPIDA.md** + checklist

---

## 📖 GUIA DE NAVEGAÇÃO POR DOCUMENTO

### 1️⃣ GUIA_DE_ESTUDOS.md (DOCUMENTO PRINCIPAL)

**O que é:** Material completo e aprofundado sobre todo o projeto.

**Estrutura:**
```
├── Parte 1: CONCEITOS FUNDAMENTAIS
│   ├── 1.1 O que é ACID? ⭐⭐⭐
│   ├── 1.2 Integridade Referencial ⭐⭐⭐
│   ├── 1.3 Schema Flexível ⭐⭐⭐
│   └── 1.4 Bancos de Grafos ⭐⭐⭐
│
├── Parte 2: ARQUITETURA DO SISTEMA
│   ├── 2.1 Visão Geral ⭐⭐
│   ├── 2.2 Detalhamento dos Serviços ⭐⭐
│   └── 2.3 Por que Microsserviços? ⭐⭐
│
├── Parte 3: MODELAGEM DE DADOS DETALHADA
│   ├── 3.1 PostgreSQL - Modelo Relacional ⭐⭐⭐
│   ├── 3.2 MongoDB - Modelo de Documentos ⭐⭐⭐
│   └── 3.3 Neo4j - Modelo de Grafos ⭐⭐⭐
│
├── Parte 4: COMO FUNCIONA NA PRÁTICA
│   ├── 4.1 Fluxo Completo: Compra de Jogo ⭐⭐
│   ├── 4.2 Fluxo Completo: Adicionar Amigo ⭐
│   └── 4.3 Fluxo Completo: Ver Recomendações ⭐⭐
│
├── Parte 5: DOCKER E INFRAESTRUTURA
│   ├── 5.1 O que é Docker? ⭐
│   ├── 5.2 Docker Compose ⭐
│   └── 5.5 Comandos Docker Essenciais ⭐⭐
│
├── Parte 6: TESTES E VERIFICAÇÃO
│   ├── 6.1 Como Executar o Projeto ⭐⭐⭐
│   ├── 6.2 Verificação Manual - PostgreSQL ⭐⭐
│   ├── 6.3 Verificação Manual - MongoDB ⭐⭐
│   └── 6.4 Verificação Manual - Neo4j ⭐⭐
│
├── Parte 7: PERGUNTAS E RESPOSTAS COMUNS ⭐⭐
├── Parte 8: CONCEITOS AVANÇADOS ⭐
└── Parte 9: CHECKLIST PARA PROVA ⭐⭐⭐
```

**⭐⭐⭐ = Essencial | ⭐⭐ = Importante | ⭐ = Complementar**

**Use quando:**
- Primeira vez estudando o projeto
- Precisa entender conceitos em profundidade
- Quer ver exemplos de código completos
- Precisa aprender queries dos 3 bancos

### 2️⃣ COLA_RAPIDA.md (REFERÊNCIA RÁPIDA)

**O que é:** Resumo ultra-compacto para consulta rápida.

**Conteúdo:**
- ✅ Conceito principal (Persistência Poliglota)
- ✅ Tabela comparativa dos 3 bancos
- ✅ Diagrama de arquitetura simplificado
- ✅ Queries essenciais (SQL, MongoDB, Cypher)
- ✅ Comandos Docker
- ✅ Como verificar cada banco
- ✅ Como executar o projeto (5 passos)
- ✅ Justificativas rápidas
- ✅ Checklist pré-prova

**Use quando:**
- Precisa revisar rapidamente (15 min)
- Dia da prova (ler antes de sair)
- Esqueceu uma query ou comando
- Quer ver tabela comparativa
- Precisa de credenciais/portas

### 3️⃣ PERGUNTAS_E_RESPOSTAS.md (AUTO-TESTE)

**O que é:** 50+ perguntas com respostas completas, organizadas por categoria.

**Categorias:**

```
📚 CATEGORIA 1: CONCEITOS FUNDAMENTAIS (P1-P5)
   ↳ Persistência Poliglota, ACID, Por que múltiplos bancos

🗄️ CATEGORIA 2: POSTGRESQL (P6-P12)
   ↳ Por que usar, Foreign Keys, Índices, Triggers

📄 CATEGORIA 3: MONGODB (P13-P19)
   ↳ Schema flexível, Documentos, Arrays, Queries

🕸️ CATEGORIA 4: NEO4J (P20-P27)
   ↳ Grafos, Cypher, Relacionamentos, Performance

🏗️ CATEGORIA 5: ARQUITETURA (P28-P33)
   ↳ Microsserviços, Comunicação, Vantagens

🐳 CATEGORIA 6: DOCKER (P34-P38)
   ↳ Containers, Compose, Volumes, Healthchecks

🔧 CATEGORIA 7: OPERAÇÕES PRÁTICAS (P39-P44)
   ↳ Como executar, verificar, debugar

🎓 CATEGORIA 8: CONCEITOS AVANÇADOS (P45-P50)
   ↳ CAP Theorem, Sharding, ACID vs BASE

💡 PERGUNTAS BÔNUS (B1-B5)
   ↳ Aplicações práticas
```

**Como usar:**
1. **Primeira passada:** Leia todas perguntas e respostas
2. **Segunda passada:** Tente responder sem ver resposta
3. **Terceira passada:** Explique em voz alta
4. **Prova simulada:** Peça para alguém perguntar aleatoriamente

**Use quando:**
- Quer testar seu conhecimento
- Prefere aprender com Q&A
- Precisa praticar explicações
- Quer simular perguntas de prova

### 4️⃣ DIAGRAMAS_VISUAIS.md (VISUAL LEARNER)

**O que é:** Diagramas ASCII art detalhados de toda arquitetura e fluxos.

**Conteúdo:**

```
🏗️ Arquitetura Completa do Sistema
   ↳ Camadas: Simulação → Microsserviços → Persistência

📊 Modelo de Dados - PostgreSQL
   ↳ Tabelas: usuarios, bibliotecas
   ↳ Relacionamentos: Foreign Keys, Índices

📄 Modelo de Dados - MongoDB
   ↳ Estrutura de documento de jogo (JSON)
   ↳ Dados aninhados, Arrays

🕸️ Modelo de Dados - Neo4j
   ↳ Nodos: User, Game
   ↳ Relacionamentos: FRIENDS_WITH, OWNS

🔄 Fluxo: Compra de Jogo (4 passos)
   ↳ Cliente → servico-usuarios → PostgreSQL → Neo4j

🤝 Fluxo: Adicionar Amigo
   ↳ Cliente → servico-social → Neo4j

🎯 Fluxo: Recomendação de Jogos
   ↳ Neo4j (query de grafo) → MongoDB (detalhes)

🐳 Infraestrutura Docker
   ↳ docker-compose.yml explicado visualmente

📊 Comparação: Quando Usar Cada Banco
   ↳ Matriz de decisão

🎓 Resumo Visual Final
```

**Use quando:**
- É visual learner (aprende melhor com diagramas)
- Quer entender fluxos passo-a-passo
- Precisa visualizar arquitetura
- Quer ver estrutura de dados
- Gosta de ASCII art! 🎨

---

## 🎯 TÓPICOS MAIS IMPORTANTES (TOP 10)

Se você tem tempo limitado, priorize estes tópicos:

### 1. **Persistência Poliglota** ⭐⭐⭐
- **Onde:** COLA_RAPIDA.md (início)
- **Por quê:** É o conceito central do projeto

### 2. **ACID (4 propriedades)** ⭐⭐⭐
- **Onde:** GUIA_DE_ESTUDOS.md → Parte 1.1
- **Por quê:** Cai em TODAS as provas de BD

### 3. **Por que usar cada banco?** ⭐⭐⭐
- **Onde:** GUIA_DE_ESTUDOS.md → Parte 3 (justificativas)
- **Por quê:** Pergunta mais comum: "Por que escolheram X para Y?"

### 4. **Queries dos 3 bancos** ⭐⭐⭐
- **Onde:** COLA_RAPIDA.md (queries essenciais)
- **Por quê:** Parte prática da prova

### 5. **Arquitetura de Microsserviços** ⭐⭐
- **Onde:** DIAGRAMAS_VISUAIS.md (arquitetura completa)
- **Por quê:** Entender como tudo se conecta

### 6. **Integridade Referencial** ⭐⭐⭐
- **Onde:** GUIA_DE_ESTUDOS.md → Parte 1.2
- **Por quê:** Foreign Keys e cascatas são fundamentais

### 7. **Schema Flexível vs Fixo** ⭐⭐⭐
- **Onde:** GUIA_DE_ESTUDOS.md → Parte 1.3
- **Por quê:** Principal diferença SQL vs NoSQL

### 8. **Como executar o projeto** ⭐⭐
- **Onde:** GUIA_DE_ESTUDOS.md → Parte 6.1
- **Por quê:** Pode ser pergunta prática

### 9. **Fluxo de compra de jogo** ⭐⭐
- **Onde:** DIAGRAMAS_VISUAIS.md (fluxo detalhado)
- **Por quê:** Mostra integração entre os 3 bancos

### 10. **Neo4j para grafos** ⭐⭐⭐
- **Onde:** GUIA_DE_ESTUDOS.md → Parte 1.4 e 3.3
- **Por quê:** Performance O(k) vs O(n²) é argumento-chave

---

## 🔍 BUSCA RÁPIDA POR TÓPICO

Use esta tabela para encontrar onde está cada conceito:

| Tópico | Documento Principal | Também em |
|--------|---------------------|-----------|
| **ACID** | GUIA (1.1) | COLA, P&R (P2) |
| **Foreign Keys** | GUIA (1.2) | P&R (P7) |
| **Schema Flexível** | GUIA (1.3) | DIAG, P&R (P15) |
| **Cypher** | GUIA (3.3) | COLA, P&R (P23) |
| **Docker Compose** | GUIA (5.2) | DIAG, P&R (P35) |
| **Microsserviços** | GUIA (2.2) | DIAG, P&R (P28) |
| **Query SQL** | GUIA (3.1) | COLA |
| **Query MongoDB** | GUIA (3.2) | COLA |
| **Query Neo4j** | GUIA (3.3) | COLA |
| **Executar projeto** | GUIA (6.1) | COLA, P&R (P39) |
| **CAP Theorem** | GUIA (8.1) | P&R (P45) |
| **Sharding** | GUIA (8.2) | P&R (P46) |
| **Normalização** | GUIA (8.5) | P&R (P48) |

**Legenda:**
- GUIA = GUIA_DE_ESTUDOS.md
- COLA = COLA_RAPIDA.md
- P&R = PERGUNTAS_E_RESPOSTAS.md
- DIAG = DIAGRAMAS_VISUAIS.md

---

## ✅ CHECKLIST DE PREPARAÇÃO

### 📖 Leitura
- [ ] Li COLA_RAPIDA.md completo
- [ ] Li GUIA_DE_ESTUDOS.md partes 1-5
- [ ] Li DIAGRAMAS_VISUAIS.md (arquitetura + fluxos)
- [ ] Respondi PERGUNTAS_E_RESPOSTAS.md (pelo menos 80%)

### 💻 Prática
- [ ] Executei o projeto com sucesso
- [ ] Conectei em cada banco de dados manualmente
- [ ] Executei pelo menos 3 queries em cada banco
- [ ] Entendi o log s1_verification_log.json

### 🧠 Conceitos
- [ ] Sei explicar Persistência Poliglota
- [ ] Sei explicar ACID (4 propriedades)
- [ ] Sei justificar os 3 bancos escolhidos
- [ ] Entendo diferença SQL vs NoSQL
- [ ] Sei o que é Foreign Key e CASCADE
- [ ] Entendo schema flexível do MongoDB
- [ ] Entendo grafos do Neo4j

### 📝 Queries
- [ ] Sei escrever SELECT com JOIN (SQL)
- [ ] Sei escrever find() com filtros (MongoDB)
- [ ] Sei escrever MATCH simples (Cypher)
- [ ] Entendo como funcionam índices

### 🏗️ Arquitetura
- [ ] Sei explicar os 3 microsserviços
- [ ] Entendo comunicação entre serviços
- [ ] Sei vantagens e desvantagens de microsserviços
- [ ] Entendo o papel do Docker

### ✨ Avançado (Opcional)
- [ ] Entendo CAP Theorem
- [ ] Sei diferença Sharding vs Replication
- [ ] Entendo ACID vs BASE
- [ ] Sei explicar normalização

---

## 🆘 DÚVIDAS COMUNS

### "Qual documento ler primeiro?"
👉 **COLA_RAPIDA.md** para overview, depois **GUIA_DE_ESTUDOS.md**

### "Não tenho tempo de ler tudo!"
👉 Siga o plano "Se você tem APENAS HOJE" (5 horas)

### "Sou visual learner, o que leio?"
👉 **DIAGRAMAS_VISUAIS.md** + **COLA_RAPIDA.md**

### "Como testar meu conhecimento?"
👉 **PERGUNTAS_E_RESPOSTAS.md** - tente responder sozinho primeiro

### "O que é mais importante?"
👉 Seção "TÓPICOS MAIS IMPORTANTES (TOP 10)" acima

### "Como executar o projeto?"
👉 **GUIA_DE_ESTUDOS.md** → Parte 6.1 (passo-a-passo)

### "Preciso memorizar queries?"
👉 Não! Entenda a lógica. Mas tenha **COLA_RAPIDA.md** para referência

### "E se eu não souber responder algo na prova?"
👉 Use lógica + justificativas:
- "PostgreSQL porque precisa ACID..."
- "MongoDB porque esquema flexível..."
- "Neo4j porque queries de grafo O(k)..."

---

## 📞 RESUMO EXECUTIVO

### O QUE É ESTE PROJETO?
Uma plataforma de distribuição de jogos (tipo Steam) que demonstra **Persistência Poliglota** usando 3 bancos de dados diferentes.

### POR QUE 3 BANCOS?
Cada tipo de dado tem necessidades diferentes:
- **PostgreSQL**: Usuários (precisa ACID e integridade)
- **MongoDB**: Catálogo (precisa flexibilidade)
- **Neo4j**: Rede social (precisa queries de grafo)

### COMO FUNCIONA?
- **Python** simula dados
- **3 Microsserviços Node.js** expõem APIs
- **Docker** orquestra tudo
- **Cada microsserviço** usa banco apropriado

### O QUE VOU APRENDER?
- ✅ Quando usar SQL vs NoSQL
- ✅ Como bancos de grafos funcionam
- ✅ Arquitetura de microsserviços
- ✅ Queries dos 3 tipos de bancos
- ✅ Docker e infraestrutura moderna

---

## 🎓 MENSAGEM FINAL

Você tem em mãos **~95KB de conteúdo** cuidadosamente preparado para te ensinar TUDO sobre este projeto. 

**4 documentos. ~5 horas de estudo. Conhecimento para a prova inteira.** 📚✨

Não tente decorar. **Entenda os conceitos.** As respostas virão naturalmente.

### Boa sorte! 🍀🎯

*"A persistência é o caminho do êxito." - Charles Chaplin*

---

**Criado com ❤️ para você arrasar na prova!**

**Autores do Projeto:**
- Gustavo Bertoluzzi Cardoso (22.123.016-2)
- Isabella Vieira Silva Rosseto (22.222.036-0)
- Humberto de Oliveira Pellegrini (22.224.019-4)
