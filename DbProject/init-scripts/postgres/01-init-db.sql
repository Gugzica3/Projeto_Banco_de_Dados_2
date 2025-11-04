-- ============================================
-- MINI-STEAM: PostgreSQL Schema
-- Gerenciamento de Usuários e Bibliotecas
-- ============================================

-- Tabela de Usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    
    -- Índices para performance
    CONSTRAINT email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índice para buscas por email (login)
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo) WHERE ativo = TRUE;

-- Tabela de Bibliotecas (Jogos que o usuário possui)
CREATE TABLE bibliotecas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    id_jogo VARCHAR(50) NOT NULL, -- Referência ao MongoDB (gameId)
    data_aquisicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preco_pago DECIMAL(10, 2), -- Valor pago na compra
    tempo_jogado INTEGER DEFAULT 0, -- Em minutos
    
    -- Integridade Referencial
    CONSTRAINT fk_usuario 
        FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id) 
        ON DELETE CASCADE,
    
    -- Um usuário não pode ter o mesmo jogo duplicado
    CONSTRAINT unique_usuario_jogo UNIQUE (id_usuario, id_jogo)
);

-- Índices para queries comuns
CREATE INDEX idx_bibliotecas_usuario ON bibliotecas(id_usuario);
CREATE INDEX idx_bibliotecas_jogo ON bibliotecas(id_jogo);
CREATE INDEX idx_bibliotecas_data ON bibliotecas(data_aquisicao DESC);

-- View útil: Estatísticas do usuário
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

-- Função para registrar último acesso
CREATE OR REPLACE FUNCTION atualizar_ultimo_acesso()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE usuarios SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = NEW.id_usuario;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ultimo_acesso
AFTER INSERT ON bibliotecas
FOR EACH ROW
EXECUTE FUNCTION atualizar_ultimo_acesso();

-- Comentários para documentação
COMMENT ON TABLE usuarios IS 'Armazena informações de autenticação e perfil dos usuários';
COMMENT ON TABLE bibliotecas IS 'Registra a propriedade de jogos pelos usuários';
COMMENT ON COLUMN bibliotecas.id_jogo IS 'Referência externa ao gameId no MongoDB';
