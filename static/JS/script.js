document.addEventListener('DOMContentLoaded', async function () {
    const produtosSelect = document.getElementById('produtos');
    const dataFabricacaoInput = document.getElementById('data-fabricacao');
    const dataValidadeInput = document.getElementById('data-validade');
    const loteInput = document.getElementById('lote');
    const impressoPorInput = document.getElementById('impresso-por');
    const labelText = document.getElementById('label');

    // Função para buscar produtos da API
    async function carregarProdutos() {
        try {
            const response = await fetch('/produtos');
            if (!response.ok) throw new Error(`Erro ao carregar produtos: ${response.status}`);

            const produtos = await response.json();

            // Adicionar produtos ao seletor
            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.nome;
                option.textContent = `${produto.nome} - Validade: ${produto.validade}`;
                produtosSelect.appendChild(option);
            });

            console.log("Produtos carregados com sucesso.");
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            produtosSelect.innerHTML = `<option value="">Erro ao carregar produtos</option>`;
        }
    }

    // Função para atualizar a etiqueta
    function updateLabel() {
        const produtoSelecionado = produtosSelect.value;

        if (!produtoSelecionado) {
            labelText.innerHTML = `<p>Selecione um produto para visualizar a etiqueta.</p>`;
            return;
        }

        const dataFabricacao = new Date().toLocaleDateString('pt-BR');

        labelText.innerHTML = `
            <h2>${produtoSelecionado}</h2>
            <p><strong>Manipulação:</strong> ${dataFabricacao}</p>
            <p><strong>Validade:</strong> ${dataValidadeInput.value || 'N/A'}</p>
            <p><strong>Resp.:</strong> ${impressoPorInput.value || 'Sua Empresa'}</p>
            <p><strong>Lote:</strong> ${loteInput.value || 'N/A'}</p>
        `;
    }

    // Adicionar eventos para atualizar a etiqueta
    produtosSelect.addEventListener('change', updateLabel);
    loteInput.addEventListener('input', updateLabel);
    impressoPorInput.addEventListener('input', updateLabel);

    // Carregar os produtos ao carregar a página
    await carregarProdutos();
});
