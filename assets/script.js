let nomeDigitado="", usuario, mensagem = {from: "",
    to: "Todos",
    text: "",
    type: ""}, msgData, msgLoad, time;

getUserName();

function getUserName () {
    nomeDigitado = prompt('Digite o seu nome para entrar na sala: ');
    usuario = {name: nomeDigitado};
    axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario).then(connected).catch(connectError);
}

function connected() {

    mensagem.from = nomeDigitado;
    mensagem.to = "Todos";
    mensagem.text = "entrou na sala";
    mensagem.type = "message";
    postMsg(mensagem);

    /* let entrou = document.querySelector('main');
    const hora = new Date().toLocaleTimeString('en-US', {hour12: false});
    entrou.innerHTML += `<div class="div-mensagem status">
    <p><span class="hora">${hora}</span> ${nomeDigitado} <span class="mensagem">entra na sala...</span></p>
    </div>`; */

    keepConnected();
    setIntervalLoadMsg();
}

function setIntervalLoadMsg () {
    setInterval(()=>{loadMsg(recentMsgs);}, 3000);
}

function loadMsg(param) {
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(param).catch();
}

function recentMsgs(param) {
    msgLoad = param.data;
    const newArray = msgLoad.filter(chatArray);

    function chatArray (el) {
        if(el.time > time && (el.to == "Todos" || el.to == nomeDigitado)) {
            return true;
        }
    }

    for (let i = 0; i < newArray.length; i++) {
        const view = document.querySelector('.mensagens');
        view.innerHTML += `<div class="div-mensagem status">
        <p><span class="hora">${newArray[i].time}</span> ${newArray[i].from} <span class="mensagem"> para</span> ${newArray[i].to + ":"} <span class="mensagem">${newArray[i].text}</span></p>
        </div>`;
        view.lastElementChild.scrollIntoView({behavior: 'smooth'});
        time = newArray[i].time;
    }

}

function keepConnected () {
    setInterval(postConnected, 5000);
}

function postConnected() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario).then().catch();
}

function connectError (erro) {
    const erroResponse = erro.response.status;

    if (erroResponse == 400) {
        alert(`Nome de usuário já existente! Tente novamente.`);
        getUserName();
    } else {
        alert(`Ocorreu o seguinte erro inesperado - Erro: ${erroResponse} - A pagina vai ser recarregada!`);
        window.location.reload();
    }
    
}

function sendTxt() {
    const text = document.querySelector('.msg');

    mensagem.from = nomeDigitado;
    mensagem.text = text.value;
    mensagem.type = "message";
    /* console.log(mensagem); */
    postMsg(mensagem);
    /* postMsg(mensagem); */

    text.value = "";
    
}

function postMsg(mensagem) {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem).then(getMessage).catch();
}


 function getMessage() {
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(sendMsg).catch();
}

function sendMsg(param) {

    msgData = param.data;
    const newArray = msgData.filter(selectMsg);

    function selectMsg(el){
        if (el.text == mensagem.text && el.from == mensagem.from && el.type == mensagem.type) {
            return true;
        }
    }

    for (let i = 0; i < newArray.length; i++) {
        document.querySelector('.mensagens').innerHTML += `<div class="div-mensagem status">
        <p><span class="hora">${newArray[i].time}</span> ${newArray[i].from} <span class="mensagem"> para</span> ${newArray[i].to + ":"} <span class="mensagem">${newArray[i].text}</span></p>
        </div>`;
        time = newArray[i].time;
    }
    
} 

/* function testeThen(aaa) {
    console.log("Then OK");
    console.log(aaa);
}

function testeCatch(aaa) {
    console.log('DEU RUIM! FUUUUUUU...');
    console.log(aaa);
} */