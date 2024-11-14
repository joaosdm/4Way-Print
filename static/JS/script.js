const produtos = [
    { nome: "Morango", prazoValidadeDias: 7 },
    { nome: "Maçã", prazoValidadeDias: 10 },
    { nome: "Pera", prazoValidadeDias: 12 },
    { nome: "Banana", prazoValidadeDias: 5 }
];

const produtosSelect = document.getElementById('produtos');
const dataFabricacaoInput = document.getElementById('data-fabricacao');
const dataValidadeInput = document.getElementById('data-validade');
const loteInput = document.getElementById('lote');
const impressoPorInput = document.getElementById('impresso-por');
const logoInput = document.getElementById('logo');
const labelContainer = document.getElementById('label-container');
const labelText = document.getElementById('label-text');
const labelLogo = document.getElementById('label-logo');
const downloadBtn = document.getElementById('download-btn');

// Verificar se os elementos estão carregados
if (!produtosSelect || !downloadBtn) {
    console.error("Algum elemento do DOM está faltando.");
}

// Função para formatar a data no formato DD-MM-YYYY
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Preencher o campo de seleção com os produtos
produtos.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.nome;
    option.textContent = produto.nome;
    produtosSelect.appendChild(option);
});

// Função para calcular a data de validade
function calcularDataValidade(prazoValidadeDias) {
    const dataAtual = new Date();
    const dataValidade = new Date(dataAtual);
    dataValidade.setDate(dataAtual.getDate() + prazoValidadeDias);
    return formatarData(dataValidade);
}

// Função para atualizar a pré-visualização da etiqueta
function updateLabel() {
    const produtoSelecionado = produtosSelect.value;
    const produto = produtos.find(p => p.nome === produtoSelecionado);

    if (!produto) return;

    const nomeProduto = produto.nome;
    const prazoValidadeDias = produto.prazoValidadeDias;

    const dataFabricacaoFormatada = formatarData(new Date());
    const dataValidade = calcularDataValidade(prazoValidadeDias);

    dataFabricacaoInput.value = dataFabricacaoFormatada;
    dataValidadeInput.value = dataValidade;

    const labelContent = `
        <strong>Nome do Produto:</strong> ${nomeProduto} <br>
        <strong>Data de Fabricação:</strong> ${dataFabricacaoFormatada} <br>
        <strong>Data de Validade:</strong> ${dataValidade} <br>
        <strong>Lote:</strong> ${loteInput.value || 'Lote 12345'} <br>
        <strong>Impresso por:</strong> ${impressoPorInput.value || 'Sua Empresa'}
    `;
    labelText.innerHTML = labelContent;

    if (logoInput.files && logoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            labelLogo.src = e.target.result;
            labelLogo.style.display = 'block';
        };
        reader.readAsDataURL(logoInput.files[0]);
    } else {
        labelLogo.style.display = 'none';
    }
}

// Atualizar a pré-visualização sempre que o produto, lote ou nome do impressor mudarem
produtosSelect.addEventListener('change', updateLabel);
loteInput.addEventListener('input', updateLabel);
impressoPorInput.addEventListener('input', updateLabel);
logoInput.addEventListener('change', updateLabel);

// Função para gerar o download da etiqueta como imagem
downloadBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = labelContainer.offsetWidth;
    canvas.height = labelContainer.offsetHeight;
    const ctx = canvas.getContext('2d');

    // Desenhar conteúdo da etiqueta no canvas
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(labelText.innerText, 10, 20);

    // Adicionar logo se existir
    if (labelLogo.src) {
        const logoImg = new Image();
        logoImg.src = labelLogo.src;
        logoImg.onload = function () {
            ctx.drawImage(logoImg, canvas.width - 120, canvas.height - 80, 100, 40);
            const link = document.createElement('a');
            link.download = 'etiqueta.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    } else {
        const link = document.createElement('a');
        link.download = 'etiqueta.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
});
