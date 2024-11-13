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

// Função para formatar a data no formato DD-MM-YYYY
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');  // Garantir dois dígitos
    const mes = String(data.getMonth() + 1).padStart(2, '0');  // Meses começam de 0, então somamos 1
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;  // Formato DD-MM-YYYY
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
    dataValidade.setDate(dataAtual.getDate() + prazoValidadeDias); // Soma o prazo de validade
    return formatarData(dataValidade); // Formato DD-MM-YYYY
}

// Função para atualizar a pré-visualização da etiqueta
function updateLabel() {
    const produtoSelecionado = produtosSelect.value;
    const produto = produtos.find(p => p.nome === produtoSelecionado);

    if (!produto) {
        return; // Se nenhum produto for selecionado, não faz nada
    }

    const nomeProduto = produto.nome;
    const prazoValidadeDias = produto.prazoValidadeDias;

    // Data de fabricação (data atual)
    const dataFabricacao = new Date();
    const dataFabricacaoFormatada = formatarData(dataFabricacao); // Formato DD-MM-YYYY

    // Data de validade (data atual + prazo de validade)
    const dataValidade = calcularDataValidade(prazoValidadeDias);

    // Preenchendo os campos de data
    dataFabricacaoInput.value = dataFabricacaoFormatada;
    dataValidadeInput.value = dataValidade;

    // Atualizando o conteúdo da etiqueta
    const labelContent = `
        <strong>Nome do Produto:</strong> ${nomeProduto} <br>
        <strong>Data de Fabricação:</strong> ${dataFabricacaoFormatada} <br>
        <strong>Data de Validade:</strong> ${dataValidade} <br>
        <strong>Lote:</strong> ${loteInput.value || 'Lote 12345'} <br>
        <strong>Impresso por:</strong> ${impressoPorInput.value || 'Sua Empresa'}
    `;
    labelText.innerHTML = labelContent;

    // Mostrar o logotipo (caso haja)
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

// Adicionar evento para atualizar a pré-visualização quando o produto for selecionado
produtosSelect.addEventListener('change', updateLabel);

// Função para gerar o download da etiqueta
downloadBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Definindo as dimensões do canvas
    canvas.width = labelContainer.offsetWidth;
    canvas.height = labelContainer.offsetHeight;

    // Desenhando o conteúdo da etiqueta
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Adicionando texto
    ctx.fillText(labelText.innerText, 20, 20);

    // Adicionando o logotipo
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
    }
});
