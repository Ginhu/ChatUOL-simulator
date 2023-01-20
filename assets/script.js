let nomeDigitado, usuario;

getUserName();

function getUserName () {
    nomeDigitado = prompt('Digite o seu nome para entrar na sala: ');
    usuario = {name: nomeDigitado};
    const post = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
    post.then(statusServer);
    post.catch(erroEntrar);
}

function statusServer() {

    let entrou = document.querySelector('main');
    const hora = new Date().toLocaleTimeString();
    entrou.innerHTML += `<div class="div-mensagem status">
    <p><span class="hora">${hora}</span> ${nomeDigitado} <span class="mensagem">entra na sala...</span></p>
    </div>`;

    keepConnected();
}

function keepConnected () {
    setInterval(postConnected, 5000);
}

function postConnected() {
    const post = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
}

function erroEntrar (erro) {
    const erroResponse = erro.response.status;

    if (erroResponse == 400) {
        alert(`Nome de usuário já existente! Tente novamente.`);
        getUserName();
    } else {
        alert(`Ocorreu o seguinte erro inesperado - Erro: ${erroResponse} - A pagina vai ser recarregada!`);
        window.location.reload();
    }
    
}