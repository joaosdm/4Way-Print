from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('main.html')

@app.route('/adicionar', methods=['GET', 'POST'])
def adicionar_produto():
    if request.method == 'POST':
        nome = request.form['nome']
        validade = request.form['validade']
        print(f"Produto adicionado: {nome} com validade até {validade}")
        return redirect(url_for('home'))
    return render_template('label.html')

if __name__ == '__main__':
    app.run(debug=True)
