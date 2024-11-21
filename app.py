import os
from flask import Flask, jsonify, render_template
import sqlite3

app = Flask(__name__)

# Caminho para o banco de dados
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'data', 'products.db')

# Função para buscar produtos no banco de dados
def buscar_produtos():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT id, nome, validade, lote FROM produtos')
        produtos = cursor.fetchall()
        conn.close()
        return produtos
    except sqlite3.Error as e:
        print(f"Erro ao acessar o banco de dados: {e}")
        return []

# Rota para listar produtos
@app.route('/produtos', methods=['GET'])
def listar_produtos():
    produtos = buscar_produtos()
    if not produtos:
        return jsonify({"error": "Nenhum produto encontrado no banco de dados."}), 404
    return jsonify([{"id": p[0], "nome": p[1], "validade": p[2], "lote": p[3]} for p in produtos])

# Rota para renderizar o HTML
@app.route('/')
def home():
    return render_template('label.html')

if __name__ == '__main__':
    app.run(debug=True)
