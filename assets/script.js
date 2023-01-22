let nomeDigitado="", usuario, mensagem = {from: "",
    to: "Todos",
    "text": "",
    "type": ""}, msgData, msgLoad, time;

getUserName();

function getUserName () {
    nomeDigitado = prompt('Digite o seu nome para entrar na sala: ');
    usuario = {name: nomeDigitado};
    axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario).then(connected).catch(connectError);
}

function connected() {
    mensagem.text = "entra na sala..."
    mensagem.from = nomeDigitado;
    getMessage();
    keepConnected();
    setIntervalLoadMsg();
}

function setIntervalLoadMsg () {
    setInterval(()=>{getMsg(recentMsgs);}, 3000);
}

function getMsg(param) {
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(param).catch(errorCatch);
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
        if (newArray[i].type == "message") {
            const view = document.querySelector('.mensagens');
            view.innerHTML += `<div class="div-mensagem normal">
            <p><span class="hora">${newArray[i].time}</span> ${newArray[i].from} <span class="mensagem"> para</span> ${newArray[i].to + ":"} <span class="mensagem">${newArray[i].text}</span></p>
            </div>`;
            view.lastElementChild.scrollIntoView({behavior: 'smooth'});
            time = newArray[i].time;

        } else if (newArray[i].type == "status") {
            const view = document.querySelector('.mensagens');
            view.innerHTML += `<div class="div-mensagem status">
            <p><span class="hora">${newArray[i].time}</span> ${newArray[i].from}  <span class="mensagem">${newArray[i].text}</span></p>
            </div>`;
            view.lastElementChild.scrollIntoView({behavior: 'smooth'});
            time = newArray[i].time;
            
        } else if (newArray[i].to == nomeDigitado) {
            const view = document.querySelector('.mensagens');
            view.innerHTML += `<div class="div-mensagem reservada">
            <p><span class="hora">${newArray[i].time}</span> ${newArray[i].from} <span class="mensagem"> para</span> ${newArray[i].to + ":"} <span class="mensagem">${newArray[i].text}</span></p>
            </div>`;
            view.lastElementChild.scrollIntoView({behavior: 'smooth'});
            time = newArray[i].time;
        }
    }

}

function keepConnected () {
    setInterval(postConnected, 5000);
}

function postConnected() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario).catch(errorCatch);
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

    postMsg(mensagem);
    text.value = "";
}

function postMsg(mensagem) {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem).then(getMessage).catch(errorCatch);
}


function getMessage() {
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(sendMsg).catch(errorCatch);
}


function sendMsg(param) {

    msgData = param.data;
    const newArray = msgData.filter(selectMsg);

    function selectMsg(el){
        if (el.text == mensagem.text && el.from == mensagem.from) {
            return true;
        }
    }

    if (newArray[0].type == "status") {

        document.querySelector('.mensagens').innerHTML += `<div class="div-mensagem status">
        <p><span class="hora">${newArray[0].time}</span> ${newArray[0].from}  <span class="mensagem">${newArray[0].text}</span></p>
        </div>`;
        time = newArray[0].time;

    } else {
    
        document.querySelector('.mensagens').innerHTML += `<div class="div-mensagem normal">
        <p><span class="hora">${newArray[0].time}</span> ${newArray[0].from} <span class="mensagem"> para</span> ${newArray[0].to + ":"} <span class="mensagem">${newArray[0].text}</span></p>
        </div>`;
        time = newArray[0].time;
    
    }


    
    
} 

function errorCatch(param) {
    alert(`Algo deu errado! \n
    O erro foi ${param} \n
    A página vai ser recarregada!`);
    window.location.reload();

}