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

const btnQuizzIndividual= (idSelecao) => {
    document.querySelector('.lista-quizzes').classList.add('esconder');
    document.querySelector('.pagina-quizz').classList.remove('esconder');
    document.querySelector('.novo-quiz').classList.add('esconder');
    window.scrollTo(0, 0);

	const id = idSelecao.getAttribute('data-id');
	console.log(id);
    renderQuizz();
}

const btnCriarQuizz = (idSelecao) => {
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

        for (let i = 0; i < quizzes.data.length; i++){
            exibirQuizzes.innerHTML += `
            <div data-id="${quizzes.data[i].id}" onclick="btnQuizzIndividual(this)" class="quizz-individual">
							<div class="background-individual"></div>
              <img alt="Imagem de ${quizzes.data[i].title}" src="${quizzes.data[i].image}">
              <p>${quizzes.data[i].title}</p>
            </div>
            `;
        }
        
    });
    request.catch(error => `Unable to retrive quizzes from server, please try again later. Error: ${error.status}`);
}

function oneQuizz () {

    const quizz = document.querySelector(this);

    const idQuizz = quizz.getAttribute('data-id');

    const request = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`);

    request.then();
    request.catch();
}

getQuizzes()

/*function renderQuizz (infoQuizz) {

    const paginaQuizz = document.querySelector('.pagina-quizz');

    paginaQuizz.classList.remove('escondido');

    const containerQuizz = document.querySelector('.pagina-quizz .container');

    const questionBLock = document.querySelector('.pagina-quizz-individual');

    const answerBLock = document.querySelector('.pag-quizz-ind-opcoes');

    const banner = `<div class="banner-sup">
          <img alt="Banner superior" src="${infoQuizz.image}">
          <h2>${infoQuizz.title}</h2>
        </div>`

    let questionN;
    let answerN;
    let wholeN;

    for(let questions = 0; questions < infoQuizz.questions.length; questions++){

      for(let answers = 0; answers < infoQuizz.questions.answers.length; answers++){
        answerN += `<div data-answer="${infoQuizz.questions[questions].answers[answer].isCorrectAnswer}" class="opcao-individual">
              <img alt="${infoQuizz.questions[questions].answers[answers].text}" src="${infoQuizz.questions[questions].answers[answers].image}">
              <h3>${infoQuizz.questions[questions].answers[answers].text}</h3>
        </div>`;
      }
      questionN += `<div data-question="${questions}" class="pag-quizz-ind-titulo" style="color:${infoQuizz.questions.color}">
            <h2>${infoQuizz.questions[questions].title}</h2>
          </div>` + answerN;

        wholeN += questionN;
    }
      containerQuizz.innerHTML = wholeN;
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

    const telaDeInfoBase = document.querySelector('#info-base');
    const [titleInput, imageInput, perguntasInput, niveisInput] =
        telaDeInfoBase.querySelectorAll('input');

    newQuizz.title = titleInput;
    newQuizz.image = imageInput.value;

    const telaDePerguntas = document.querySelector('#perguntas');
    const numPerguntas = parseInt(perguntasInput.value);

    for (let index = 0; index < numPerguntas; index++) {
        telaDePerguntas.innerHTML += `
          <div class="form-card fold">
            <div class="form-card-header">
              <span>Pergunta ${index + 1}</span>
              <button class="btn-fold">
                <ion-icon name="create-outline"></ion-icon>
              </button>
            </div>
            <div class="form-grupo">
              <input required type="text" class="input-pergunta" min="20" placeholder="Texto da pergunta">
              <input required type="text" class="input-cor" pattern="#[a-fA-F0-9]{6}" placeholder="Cor de fundo da pergunta">
            </div>
            <div class="form-grupo">
              <span>Reposta correta</span>
              <input required type="text" class="resp-correta" placeholder="Reposta correta">
              <input required type="url" class="img-src-resp-correta" placeholder="URL da imagem">
            </div>
            <div class="form-grupo">
              <span>Repostas incorretas</span>
              <input required type="text" class="resp-incorreta-1" placeholder="Reposta incorreta 1">
              <input required type="url" class="img-src-resp-incorreta-1" placeholder="URL da imagem 1">
            </div>
            <div class="form-grupo">
              <input type="text" class="resp-incorreta-2" placeholder="Reposta incorreta 2">
              <input type="url" class="img-src-resp-incorreta-2" placeholder="URL da imagem 2">
            </div>
            <div class="form-grupo">
              <input type="text" class="resp-incorreta-3" placeholder="Reposta incorreta 3">
              <input type="url" class="img-src-resp-incorreta-3" placeholder="URL da imagem 3">
            </div>
          </div>`
    }

    telaDePerguntas.innerHTML += '<button class="btn-prosseguir">Prosseguir para criar níveis</button>';

    const telaDeNiveis = document.querySelector('#niveis');
    const numNiveis = parseInt(niveisInput.value);

    for (let index = 0; index < numNiveis; index++) {
        telaDeNiveis.innerHTML += `
          <div class="form-card fold">
            <div class="form-card-header">
             <span>Nível ${index + 1}</span>
             <button class="btn-fold">
               <ion-icon name="create-outline"></ion-icon>
             </button>
            </div>
            <div class="form-grupo">
              <input required type="text" class="titulo-nivel" min="10" placeholder="Título do nível">
              <input required type="number" class="acerto-min-nivel" min="0" max="100" placeholder="% de acerto mínimo">
              <input required type="url" class="img-src-nivel" placeholder="URL da imagem do nível">
              <input required type="text" class="desc-nivel" min="30" placeholder="Descrição do nível">
            </div>
          </div>`
    }

    telaDeNiveis.innerHTML += '<button class="btn-prosseguir">Finalizar Quizz</button>';

    document.querySelectorAll(":is(#perguntas, #niveis) .form-card:first-of-type")
        .forEach((elem) => elem.classList.remove("fold"));

    esconderTodas();
    telaDePerguntas.classList.remove("esconder");
}
