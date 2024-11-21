import sqlite3

# Conectar ao banco de dados (ou criar se não existir)
conn = sqlite3.connect('products.db')
cursor = conn.cursor()

# Criar a tabela de produtos
cursor.execute('''
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    temperatura TEXT NOT NULL,
    validade TEXT NOT NULL,
    lote TEXT NOT NULL
)
''')

print("Tabela criada com sucesso!")

# Inserir dados iniciais (opcional)
produtos = [
    ('Alecrim', '2024-11-23', 'Lote A123'),
    ('Tomilho', '2024-12-10', 'Lote B456'),
    ('Orégano', '2024-10-15', 'Lote C789')
]

cursor.executemany('INSERT INTO produtos (nome, validade, lote) VALUES (?, ?, ?)', produtos)
conn.commit()

print("Dados inseridos com sucesso!")
conn.close()
