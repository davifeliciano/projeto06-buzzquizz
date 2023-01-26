const newQuizz = {
    title: "",
    image: "",
    questions: [],
    levels: []
}

function esconderTodas() {
    const mains = document.querySelectorAll('main');
    mains.forEach((elem) => elem.classList.add('esconder'));
}


const btnCriarQuizz = () => {
    document.querySelector('.lista-quizzes').classList.add('esconder');
    document.querySelector('.pagina-quizz').classList.add('esconder');
    document.querySelector('.novo-quiz').classList.remove('esconder');
    window.scrollTo(0, 0);
}

const btnHome = () => {
    document.querySelector('.lista-quizzes').classList.remove('esconder');
    document.querySelector('.pagina-quizz').classList.add('esconder');
    document.querySelector('.novo-quiz').classList.add('esconder');
    window.scrollTo(0, 0);
}

function getQuizzes () {

    const request = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');

    request.then(quizzes => {
        console.log(quizzes.data)
        console.log(quizzes.data[0].id)
        
        const exibirQuizzes = document.querySelector('.area-todos-quizzes');
        console.log(quizzes.data.length);
        //exibirQuizzes.innerHTML = "";

        for (let i = 0; i < quizzes.data.length; i++){
            exibirQuizzes.innerHTML += `
            <div data-id="${quizzes.data[i].id}" onclick="funcaozinha(this)" class="quizz-individual">
							<div class="background-individual"></div>
              <img alt="Imagem de ${quizzes.data[i].title}" src="${quizzes.data[i].image}">
              <p>${quizzes.data[i].title}</p>
            </div>
            `;
        }
        
    });
    request.catch(error => `Unable to retrive quizzes from server, please try again later. Error: ${error.status}`);
}

/*function funcaozinha(idSelecao){
	const id = idSelecao.getAttribute('data-id');
	console.log(id);
    renderQuizz();
}*/

function oneQuizz () {

    const quizz = document.querySelector(this);

    const idQuizz = quizz.getAttribute('data-id');

    const request = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`);

    request.then();
    request.catch();
}

getQuizzes()

/*function renderQuizz (this) {

    const paginaQuizz = document.querySelector('.pagina-quizz');

    paginaQuizz.classList.remove('escondido');

    const containerQuizz = document.querySelector('.pagina-quizz .container');

    let questionBlocks;

    for(let i = 0; i < ; i++){
        questionBlocks += `<div class="pag-quizz-ind-opcoes">
            <div class="opcao-individual selecionado-h3">
              <img alt="Opção do Quizz" src="assets/img/img1.png">
              <h3>Gatíneo</h3>
            </div>`
    }

    containerQuizz.innerHTML = `<div class="banner-sup">
          <img alt="Banner superior" src="assets/img/image-sup1.png">
          <h2>O quão Potterhead é você?</h2>
        </div>` + `<div class="pag-quizz-ind-titulo cor-azul">
            <h2>Em qual animal Olho-Tonto Moody transfigurou Malfoy?</h2>
          </div>` + questionBlocks;
}*/

function validaInfoBase() {
    const telaDeInfoBase = document.querySelector('#info-base');
    const inputs = telaDeInfoBase.querySelectorAll("input");
    inputs.forEach((input) => input.value = input.value.trim());

    for (const input of inputs) {
        if (!input.checkValidity()) {
            return false;
        }
    }
    return true;
}

function irParaPerguntas() {

    if (!validaInfoBase()) {
        alert('Valor inválido! Você deve inserir um título de 20 a 65 caracteres, uma URL válida, uma quantia de perguntas maior que 3 e uma quantia de níveis maior que 3.');
        return null;
    }

    // Preencher newQuizz.title e newQuizz.image
    // Popular as telas de perguntas e de níveis
    // Esconder todas as telas e exibir tela de perguntas
}
