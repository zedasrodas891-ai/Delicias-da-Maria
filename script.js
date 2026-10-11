let carrinho = [];
let total = 0;

// Carrega os dados salvos do cliente no navegador assim que a página abre
window.addEventListener("DOMContentLoaded", () => {
  const nomeSalvo = localStorage.getItem("delicias_nome_cliente");
  const enderecoSalvo = localStorage.getItem("delicias_endereco_cliente");
  const tipoSalvo = localStorage.getItem("delicias_tipo_recebimento");

  if (nomeSalvo) {
    document.getElementById("nome-cliente").value = nomeSalvo;
  }
  if (enderecoSalvo) {
    document.getElementById("endereco-cliente").value = enderecoSalvo;
  }
  if (tipoSalvo) {
    document.getElementById("tipo-recebimento").value = tipoSalvo;
    alternarTipoRecebimento();
  }
});

// Função para alternar visibilidade do endereço se for retirada no local
function alternarTipoRecebimento() {
  const tipo = document.getElementById("tipo-recebimento").value;
  const blocoEndereco = document.getElementById("bloco-endereco");
  const avisoTaxa = document.getElementById("aviso-taxa");

  if (tipo === "retirada") {
    blocoEndereco.classList.add("oculto");
    avisoTaxa.innerHTML = `<i class="fas fa-info-circle"></i> Você optou por retirar no local (Rua Petrópolis, nº 815 - Parque da Matriz). Avisaremos quando estiver pronto!`;
  } else {
    blocoEndereco.classList.remove("oculto");
    avisoTaxa.innerHTML = `<i class="fas fa-info-circle"></i> A taxa de entrega será calculada e combinada diretamente via WhatsApp.`;
  }
}

// Função para alternar entre a tela do cardápio e a tela do carrinho
function alternarTela(tela) {
  const divCardapio = document.getElementById("tela-cardapio");
  const divCarrinho = document.getElementById("tela-carrinho");
  const barraFlutuante = document.getElementById("barra-carrinho-flutuante");

  if (tela === "carrinho") {
    if (carrinho.length === 0) {
      alert(
        "Seu carrinho está vazio! Adicione produtos antes de abrir o carrinho.",
      );
      return;
    }

    atualizarCarrinho();

    divCardapio.style.display = "none";
    divCarrinho.classList.remove("oculto");
    divCarrinho.style.display = "block";
    barraFlutuante.classList.add("oculto");

    window.scrollTo(0, 0);
  } else {
    divCarrinho.style.display = "none";
    divCarrinho.classList.add("oculto");
    divCardapio.style.display = "block";

    if (carrinho.length > 0) {
      barraFlutuante.classList.remove("oculto");
    }

    window.scrollTo(0, 0);
  }
}

// Função para filtrar as abas de categorias
function filtrarCategoria(categoria, evento) {
  const secoes = document.querySelectorAll(".secao-categoria");
  const botoes = document.querySelectorAll(".tab-btn");

  botoes.forEach((botao) => botao.classList.remove("active"));
  evento.target.classList.add("active");

  secoes.forEach((secao) => {
    const categoriaSecao = secao.getAttribute("data-categoria");

    if (categoria === "todos" || categoriaSecao === categoria) {
      secao.classList.remove("oculto");
    } else {
      secao.classList.add("oculto");
    }
  });
}

// Função para adicionar produtos ao carrinho com quantidade
function adicionarComQuantidade(nome, precoUnitario, idInputQtd) {
  const inputQtd = document.getElementById(idInputQtd);
  const quantidade = parseInt(inputQtd.value);

  if (isNaN(quantidade) || quantidade <= 0) {
    alert("Por favor, selecione uma quantidade válida.");
    return;
  }

  const precoTotalItem = precoUnitario * quantidade;

  carrinho.push({
    nome: nome,
    preco: precoTotalItem,
    quantidade: quantidade,
  });

  inputQtd.value = 1;
  atualizarCarrinho();
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();

  if (carrinho.length === 0) {
    alternarTela("cardapio");
  }
}

// Função para atualizar o carrinho e a barra flutuante
function atualizarCarrinho() {
  const listaHtml = document.getElementById("lista-carrinho-itens");
  const valorTotalHtml = document.getElementById("carrinho-valor-total");
  const barraFlutuante = document.getElementById("barra-carrinho-flutuante");
  const contadorFlutuante = document.getElementById("contador-itens-flutuante");
  const totalFlutuante = document.getElementById("valor-flutuante");

  listaHtml.innerHTML = "";
  total = 0;

  let quantidadeTotalItens = 0;

  if (carrinho.length === 0) {
    listaHtml.innerHTML = "<li>O carrinho está vazio.</li>";
    valorTotalHtml.textContent = "0,00";
    barraFlutuante.classList.add("oculto");
    return;
  }

  carrinho.forEach((item, index) => {
    total += item.preco;
    quantidadeTotalItens += item.quantidade;

    const li = document.createElement("li");
    li.className = "item-carrinho-linha";
    li.innerHTML = `
      <span>${item.quantidade}x ${item.nome} - R$ ${item.preco.toFixed(2)}</span>
      <button class="botao-remover" onclick="removerDoCarrinho(${index})">❌</button>
    `;
    listaHtml.appendChild(li);
  });

  valorTotalHtml.textContent = total.toFixed(2);

  contadorFlutuante.textContent = quantidadeTotalItens;
  totalFlutuante.textContent = total.toFixed(2);

  const divCardapio = document.getElementById("tela-cardapio");
  if (divCardapio.style.display !== "none") {
    barraFlutuante.classList.remove("oculto");
  }
}

// Função para enviar o pedido pelo WhatsApp
function enviarPedidoWhatsApp() {
  const tipoRecebimento = document.getElementById("tipo-recebimento").value;
  const nomeCliente = document.getElementById("nome-cliente").value.trim();
  const enderecoCliente = document
    .getElementById("endereco-cliente")
    .value.trim();

  if (!nomeCliente) {
    alert("Por favor, preencha seu nome completo!");
    return;
  }

  if (tipoRecebimento === "entrega" && !enderecoCliente) {
    alert("Por favor, preencha seu endereço de entrega!");
    return;
  }

  // Salva os dados no navegador
  localStorage.setItem("delicias_nome_cliente", nomeCliente);
  localStorage.setItem("delicias_tipo_recebimento", tipoRecebimento);
  if (tipoRecebimento === "entrega") {
    localStorage.setItem("delicias_endereco_cliente", enderecoCliente);
  }

  let mensagem = `*Olá! Gostaria de fazer um pedido:*\n\n`;
  mensagem += `*Cliente:* ${nomeCliente}\n`;

  if (tipoRecebimento === "retirada") {
    mensagem += `*Forma de Recebimento:* 🏃 Retirada no Local\n`;
    mensagem += `*Local de Retirada:* Rua Petrópolis, nº 815 - Parque da Matriz, Cachoeirinha - RS\n\n`;
  } else {
    mensagem += `*Forma de Recebimento:* 🚚 Entrega\n`;
    mensagem += `*Endereço:* ${enderecoCliente}\n\n`;
  }

  mensagem += `*Itens do Pedido:*\n`;

  carrinho.forEach((item) => {
    mensagem += `- ${item.quantidade}x ${item.nome} (R$ ${item.preco.toFixed(2)})\n`;
  });

  mensagem += `\n*Total:* R$ ${total.toFixed(2)}`;

  const numeroWhatsApp = "5551993174210";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

// Funções específicas para adicionar produtos com opções
function adicionarTortaFria() {
  const selectOpcao = document.getElementById("opcao-torta");
  const inputQtd = document.getElementById("qtd-torta-fria");

  const quantidade = parseInt(inputQtd.value);
  if (isNaN(quantidade) || quantidade <= 0) {
    alert("Por favor, selecione uma quantidade válida.");
    return;
  }

  const [tamanho, precoUnitarioStr] = selectOpcao.value.split("|");
  const precoUnitario = parseFloat(precoUnitarioStr);

  carrinho.push({
    nome: `Torta Fria (${tamanho} Pedaços)`,
    preco: precoUnitario * quantidade,
    quantidade: quantidade,
  });

  inputQtd.value = 1;
  atualizarCarrinho();
}

function adicionarCoxinha() {
  const selectOpcao = document.getElementById("opcao-coxinha");
  const inputQtd = document.getElementById("qtd-coxinha");

  const quantidade = parseInt(inputQtd.value);
  if (isNaN(quantidade) || quantidade <= 0) {
    alert("Por favor, selecione uma quantidade válida.");
    return;
  }

  const [tipo, precoUnitarioStr] = selectOpcao.value.split("|");
  const precoUnitario = parseFloat(precoUnitarioStr);

  carrinho.push({
    nome: `Coxinha Cremosa (${tipo})`,
    preco: precoUnitario * quantidade,
    quantidade: quantidade,
  });

  inputQtd.value = 1;
  atualizarCarrinho();
}

function adicionarPaoRecheado() {
  const selectOpcao = document.getElementById("opcao-pao-recheado");
  const inputQtd = document.getElementById("qtd-pao-recheado");

  const quantidade = parseInt(inputQtd.value);
  if (isNaN(quantidade) || quantidade <= 0) {
    alert("Por favor, selecione uma quantidade válida.");
    return;
  }

  const [sabor, precoUnitarioStr] = selectOpcao.value.split("|");
  const precoUnitario = parseFloat(precoUnitarioStr);

  carrinho.push({
    nome: `Pão Recheado (${sabor})`,
    preco: precoUnitario * quantidade,
    quantidade: quantidade,
  });

  inputQtd.value = 1;
  atualizarCarrinho();
}

// Funções para abrir e fechar a foto ampliada
function abrirModalFoto(urlImagem) {
  const modal = document.getElementById("modal-foto");
  const imgZoom = document.getElementById("img-modal-zoom");

  modal.classList.remove("oculto");
  imgZoom.src = urlImagem;
}

function fecharModalFoto() {
  const modal = document.getElementById("modal-foto");
  modal.classList.add("oculto");
}
