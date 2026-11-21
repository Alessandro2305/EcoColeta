// --- 1. NAVEGAÇÃO ENTRE TELAS E ABAS ---

function goToScreen(screenId) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Mostra a tela selecionada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Atualiza o estado ativo na barra de navegação inferior
    document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
        btn.classList.remove('active');
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(screenId)) {
            btn.classList.add('active');
        }
    });
}

function switchTab(button, screenId) {
    document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    goToScreen(screenId);
}

// --- AUTENTICAÇÃO (CADASTRO E LOGIN) ---

function realizarCadastro(event) {
    event.preventDefault();

    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirmasenha').value;

    if (senha !== confirmaSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Salva os dados básicos no localStorage para simular o banco de dados local
    localStorage.setItem('ecoUserNome', nome);
    localStorage.setItem('ecoUserEmail', email);

    alert('Cadastro realizado com sucesso!');
    
    // Redireciona para a tela de login
    window.location.href = 'login.html';
}

function realizarLogin(event) {
    event.preventDefault();
    // Redireciona diretamente para o painel principal do usuário
    window.location.href = "usuario.html";
}


// --- 2. SELEÇÃO DE TIPO DE RESÍDUO (NOVO PEDIDO) ---

let tipoResiduoSelecionado = "Móveis";

function ativarBotao(event) {
    if (event) event.preventDefault();

    const clickedBtn = event ? event.currentTarget : this;

    // Remove a classe 'selected' de todos os botões da grade
    const botoes = document.querySelectorAll('.tiporesiduo button');
    botoes.forEach(btn => {
        btn.classList.remove('selected');
    });

    // Adiciona a classe 'selected' ao botão clicado
    clickedBtn.classList.add('selected');

    // Captura o texto correspondente ao tipo de resíduo
    const spanText = clickedBtn.querySelector('span');
    if (spanText) {
        tipoResiduoSelecionado = spanText.innerText;
    }
}


// --- 3. GERENCIAMENTO E HISTÓRICO DE PEDIDOS ---

let pedidosData = [
    { id: 1, tipo: 'Móveis/Madeiras', data: '25/10', status: 'Agendado', icone: 'fa-couch' },
    { id: 2, tipo: 'Eletrodomésticos', data: '25/10', status: 'Pendente', icone: 'fa-bolt' },
    { id: 3, tipo: 'Entulho', data: '28/10', status: 'Concluído', icone: 'fa-trowel-bricks' }
];

function renderizarPedidos(filtro = 'todos') {
    const listaContainer = document.getElementById('fullRequestsList');
    if (!listaContainer) return;

    listaContainer.innerHTML = '';

    const pedidosFiltrados = filtro === 'todos'
        ? pedidosData
        : pedidosData.filter(p => p.status.toLowerCase() === filtro.toLowerCase());

    if (pedidosFiltrados.length === 0) {
        listaContainer.innerHTML = `<p style="text-align: center; color: var(--text-gray); font-size: 12px; padding: 20px;">Nenhum pedido encontrado.</p>`;
        return;
    }

    pedidosFiltrados.forEach(pedido => {
        let badgeClass = 'badge-green';
        let itemClass = 'request-item';
        let iconeClass = 'fa-solid ' + pedido.icone;

        if (pedido.status === 'Pendente') {
            badgeClass = 'badge-orange';
            itemClass = 'request-item-pendete';
        }

        const itemHTML = `
            <div class="${itemClass}">
                <i class="${iconeClass} ${pedido.status === 'Pendente' ? 'iconn' : 'icon'}"></i>
                <div class="${pedido.status === 'Pendente' ? 'info-eletro' : 'info'}">
                    <h4>${pedido.tipo}</h4>
                    <p>Solicitado em: ${pedido.data}</p>
                </div>
                <span class="${badgeClass}">${pedido.status}</span>
            </div>
        `;
        listaContainer.innerHTML += itemHTML;
    });

    const contador = document.getElementById('pedidos');
    if (contador) {
        contador.innerText = `${pedidosData.length} pedidos`;
    }
}

function filterRequests(status, buttonElement) {
    document.querySelectorAll('.btn-filtro button').forEach(btn => {
        btn.classList.remove('active-filter');
    });

    if (buttonElement) {
        buttonElement.classList.add('active-filter');
    }

    renderizarPedidos(status);
}

function salvarPedido(event) {
    event.preventDefault();

    const dataInput = document.getElementById('dataPreferencia');
    const obsInput = document.getElementById('observacao');

    const novaDataVal = dataInput ? dataInput.value : 'Hoje';

    let dataFormatada = novaDataVal;
    if (novaDataVal.includes('-')) {
        const partes = novaDataVal.split('-');
        dataFormatada = `${partes[2]}/${partes[1]}`;
    }

    pedidosData.unshift({
        id: pedidosData.length + 1,
        tipo: tipoResiduoSelecionado,
        data: dataFormatada,
        status: 'Pendente',
        icone: 'fa-box-archive'
    });

    alert('Solicitação agendada com sucesso!');

    event.target.reset();
    renderizarPedidos('todos');
    goToScreen('screen-history');
}

// --- 4. INICIALIZAÇÃO AUTOMÁTICA ---

document.addEventListener('DOMContentLoaded', () => {
    renderizarPedidos('todos');

    // Associa eventos de clique nos botões de tipo de resíduo dinamicamente
    const botoesResiduo = document.querySelectorAll('.tiporesiduo button');
    botoesResiduo.forEach(btn => {
        btn.addEventListener('click', ativarBotao);
    });
});