import sqlite3

# Criar banco de dados e tabela
conn = sqlite3.connect('products.db')
cursor = conn.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    validade TEXT NOT NULL,
    lote TEXT NOT NULL
)
''')

# Adicionar alguns produtos para teste
produtos = [
    ('Alecrim', '2024-11-23', 'Lote A123'),
    ('Tomilho', '2024-12-10', 'Lote B456'),
    ('Orégano', '2024-10-15', 'Lote C789')
]
cursor.executemany('INSERT INTO produtos (nome, validade, lote) VALUES (?, ?, ?)', produtos)
conn.commit()
conn.close()
