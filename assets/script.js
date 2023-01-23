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

    document.querySelector('.mensagens').innerHTML = "";

    function chatArray (el) {
        if(el.time > time && (el.to == "Todos" || el.to == nomeDigitado)) {
            return true;
        }
    }

    for (let i = 0; i < newArray.length; i++) {
        if (newArray[i].type == "message") {
            const view = document.querySelector('.mensagens');
            view.innerHTML += `<div class="div-mensagem normal" data-test="message">
            <p><span class="hora">${newArray[i].time}</span> ${newArray[i].from} <span class="mensagem"> para</span> ${newArray[i].to + ":"} <span class="mensagem">${newArray[i].text}</span></p>
            </div>`;
            view.lastElementChild.scrollIntoView({behavior: 'smooth'});
            time = newArray[i].time;

        } else if (newArray[i].type == "status") {
            const view = document.querySelector('.mensagens');
            view.innerHTML += `<div class="div-mensagem status" data-test="message">
            <p><span class="hora">${newArray[i].time}</span> ${newArray[i].from}  <span class="mensagem">${newArray[i].text}</span></p>
            </div>`;
            view.lastElementChild.scrollIntoView({behavior: 'smooth'});
            time = newArray[i].time;
            
        } else if (newArray[i].to == nomeDigitado) {
            const view = document.querySelector('.mensagens');
            view.innerHTML += `<div class="div-mensagem reservada" data-test="message">
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
    const histMsg = msgData.filter(history);

    function history(el) {
        if (true/* el.to == "Todos" || el.to != "Todos" */) {
            return true;
        }
    }

    for (let i = 0; i < histMsg.length; i++) {

        if (histMsg[i].to == "Todos" && histMsg[i].type == "status") {
            document.querySelector('.mensagens').innerHTML += `<div class="div-mensagem status" data-test="message">
            <p><span class="hora">${histMsg[i].time}</span> ${histMsg[i].from} <span class="mensagem"> para</span> ${histMsg[i].to + ":"} <span class="mensagem">${histMsg[i].text}</span></p>
            </div>`;
            time = histMsg[i].time;
        } else if (histMsg[i].to == "Todos" && histMsg[i].type == "message") {
            document.querySelector('.mensagens').innerHTML += `<div class="div-mensagem normal" data-test="message">
            <p><span class="hora">${histMsg[i].time}</span> ${histMsg[i].from} <span class="mensagem"> para</span> ${histMsg[i].to + ":"} <span class="mensagem">${histMsg[i].text}</span></p>
            </div>`;
            time = histMsg[i].time;
        } else {
            document.querySelector('.mensagens').innerHTML += `<div class="div-mensagem reservada" data-test="message">
            <p><span class="hora">${histMsg[i].time}</span> ${histMsg[i].from} <span class="mensagem"> para</span> ${histMsg[i].to + ":"} <span class="mensagem">${histMsg[i].text}</span></p>
            </div>`;
            time = histMsg[i].time;
        }
    }

    function selectMsg(el){
        if (el.text == mensagem.text && el.from == mensagem.from) {
            return true;
        }
    }

    if (newArray[0].type == "status") {

        document.querySelector('.mensagens').innerHTML += `<div class="div-mensagem status" data-test="message">
        <p><span class="hora">${newArray[0].time}</span> ${newArray[0].from}  <span class="mensagem">${newArray[0].text}</span></p>
        </div>`;
        time = newArray[0].time;

    } else if (newArray[0].type == "message" && newArray[0].to != "Todos") {
        document.querySelector('.mensagens').innerHTML += `<div class="div-mensagem reservada" data-test="message">
        <p><span class="hora">${newArray[0].time}</span> ${newArray[0].from} <span class="mensagem"> para</span> ${newArray[0].to + ":"} <span class="mensagem">${newArray[0].text}</span></p>
        </div>`;
        time = newArray[0].time;

    } else {
    
        document.querySelector('.mensagens').innerHTML += `<div class="div-mensagem normal" data-test="message">
        <p><span class="hora">${newArray[0].time}</span> ${newArray[0].from} <span class="mensagem"> para</span> ${newArray[0].to + ":"} <span class="mensagem">${newArray[0].text}</span></p>
        </div>`;
        time = newArray[0].time;
    
    }
} 

function errorCatch(param) {
    console.log(`Algo deu errado! \n
    O erro foi ${param} \n
    A página vai ser recarregada!`);
    /* window.location.reload(); */

}