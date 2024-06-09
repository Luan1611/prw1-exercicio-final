function checarLogin() {
    const loginDiv = document.querySelector(".inputLogin")
    const sticknotesDiv = document.querySelector(".inputLembretes");
    const login = localStorage.getItem("tokenJWT");

    if(login) {
        loginDiv.style.display = "none";
        sticknotesDiv.style.display = "block";
    } else{
        loginDiv.style.display = "block";
        sticknotesDiv.style.display = "none";
    }
}

async function logar(e) {

    e.preventDefault();

    let botaoClicado = e.target;
    let valorEmailPessoa = botaoClicado.parentElement.children[0].value;
    let valorSenhaPessoa = botaoClicado.parentElement.children[1].value;

    let options = {
        method: "POST",
        body: JSON.stringify({
            login: valorEmailPessoa,
            senha: valorSenhaPessoa
        }),
        headers: {
            "Content-type": "application/json"
        }
    }

    let resposta = await fetch(urlBase + "/usuario/login", options);
    let valorToken = await resposta.json();

    console.log(valorToken);
    if (valorToken.token) {
        localStorage.setItem("tokenJWT", valorToken.token);
        verificarSeEstaLogado();
        checarLogin();
    } else {
        alert(JSON.stringify(valorToken.msg));
    }

}

async function cadastrar(e) {

    e.preventDefault();

    let botaoClicado = e.target;
    let valorEmailPessoa = botaoClicado.parentElement.children[0].value;
    let valorSenhaPessoa = botaoClicado.parentElement.children[1].value;

    let options = {
        method: "POST",
        body: JSON.stringify({
            login: valorEmailPessoa,
            senha: valorSenhaPessoa
        }),
        headers: {
            "Content-type": "application/json"
        }
    }

    let resposta = await fetch(urlBase + "/usuario/signup", options);
    let valorToken = await resposta.json();

    if (valorToken.key === "token") {
        localStorage.setItem("tokenJWT", JSON.stringify(valorToken));
        alert("Cadastro realizado com sucesso! Por favor, agora realize o Login");
    } else {
        alert(JSON.stringify(valorToken.msg));
    }
    
}


//funções de lembretes

async function carregarDadosLembretes(e) {

    e.preventDefault();

    const resposta = await fetch(urlBase + "/lembrete");
    const listaDeLembretes = await resposta.json();

    let divPai = document.querySelector(".container-lembretes");

    for (lembrete of listaDeLembretes) {

        let divDoLembrete = document.createElement("div");
        divFilha.classList.add("lembrete");

        let dataLembrete = document.createElement("h4");
        dataLembrete.innerHTML = lembrete.data;

        let conteudoLembrete = document.createElement("p");
        conteudoLembrete.innerHTML = lembrete.texto;

        let botaoAlterarLembrete = document.createElement("button");
        botaoAlterarLembrete.innerText = "Editar";
        botaoAlterarLembrete.addEventListener("click", editarLembrete);

        let botaoRemoverLembrete = document.createElement("button");
        botaoRemoverLembrete.innerText = "Remover";
        botaoRemoverLembrete.addEventListener("click", removerLembrete);

        divDoLembrete.append(dataLembrete);
        divDoLembrete.append(conteudoLembrete);
        divDoLembrete.append(botaoAlterarLembrete);
        divDoLembrete.append(botaoRemoverLembrete);

        divPai.append(divDoLembrete);

    }

}

async function salvarLembrete(e) {

    renovarToken();

    const tokenJWT = localStorage.getItem("tokenJWT");

    e.preventDefault();
    let botaoSalvarLembrete = e.target;
    let valorTextArea = botaoSalvarLembrete.parentElement.children[0].value;

    let options = {
        method: "POST",
        body: JSON.stringify({
            texto: valorTextArea
        }),
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${tokenJWT}`
        }
    }

    let resposta = await fetch(urlBase + "/lembrete", options);
    console.log(resposta)
    let lembrete = await resposta.json();
    console.log(lembrete);

    let divPai = document.querySelector(".container-lembretes");

    let divDoLembrete = document.createElement("div");
    divDoLembrete.classList.add("lembrete");

    let dataLembrete = document.createElement("h4");
    dataLembrete.innerHTML = lembrete.data;

    let conteudoLembrete = document.createElement("p");
    conteudoLembrete.innerHTML = lembrete.texto;

    let botaoAlterarLembrete = document.createElement("button");
    botaoAlterarLembrete.innerText = "Editar";
    botaoAlterarLembrete.addEventListener("click", editarLembrete);

    let botaoRemoverLembrete = document.createElement("button");
    botaoRemoverLembrete.innerText = "Remover";
    botaoRemoverLembrete.addEventListener("click", removerLembrete);

    divDoLembrete.append(dataLembrete);
    divDoLembrete.append(conteudoLembrete);
    divDoLembrete.append(botaoAlterarLembrete);
    divDoLembrete.append(botaoRemoverLembrete);

    divPai.append(divDoLembrete);

}

function textCounter(field, countfield, maxlimit) {
if (field.value.length > maxlimit)
field.value = field.value.substring(0, maxlimit);
else 
countfield.value = maxlimit - field.value.length;
}
function editarLembrete() {
    console.log("editar")
}

function removerLembrete() {
    console.log("remover")
}

async function renovarToken() {
    const tokenJWT = localStorage.getItem("tokenJWT");

    let options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${tokenJWT}`
        }
    }

    const respServer = await fetch(urlBase + "/usuario/renew", options);
    console.log(respServer);
    const respJson = await respServer.json();
    console.log(respJson);
    console.log(typeof respJson);

    localStorage.removeItem("tokenJWT");

    localStorage.setItem("tokenJWT", respJson.token);
    console.log(typeof respJson.token);
    console.log(localStorage.getItem("tokenJWT"));

}

async function verificarSeEstaLogado() {
    const tokenJWT = localStorage.getItem("tokenJWT");

    let options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${tokenJWT}`
        }
    }

    const respServer = await fetch(urlBase + "/usuario/check", options);
    const respJson = await respServer.json();
    alert(respJson.msg);

}


const urlBase = "https://ifsp.ddns.net/webservices/lembretes";

checarLogin();

const botaoLogin = document.querySelector("#fazerLogin");
botaoLogin.addEventListener("click", logar);

const botaoCadastro = document.querySelector("#fazerCadastro");
botaoCadastro.addEventListener("click", cadastrar);

const inputAdicionarLembrete = document.querySelector("#inputLembrete");
inputAdicionarLembrete.addEventListener("click", salvarLembrete);





/*    
const tokenJWT = localStorage.getItem("tokenJWT");

    let options = {
        method: "POST",
        body: JSON.stringify({
            login: valorEmailPessoa,
            senha: valorSenhaPessoa
        }),
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${tokenJWT}`
        }
    }*/