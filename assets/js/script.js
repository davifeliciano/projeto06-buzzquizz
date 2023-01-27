const newQuizz = {
    title: "",
    image: "",
    questions: [],
    levels: []
}

function esconderTodas() {
    const mains = document.querySelectorAll('main');
    mains.forEach((elem) => elem.classList.add('esconder'));
    window.scrollTo(0, 0);
}

const btnQuizzIndividual= (idSelecao) => {
    document.querySelector('.lista-quizzes').classList.add('esconder');
    document.querySelector('.pagina-quizz').classList.remove('esconder');
    document.querySelector('.novo-quiz').classList.add('esconder');
    window.scrollTo(0, 0);

	const id = idSelecao.getAttribute('data-id');
	console.log(id);
    oneQuizz(id);
}

const btnCriarQuizz = (idSelecao) => {
    document.querySelector('.lista-quizzes').classList.add('esconder');
    document.querySelector('.pagina-quizz').classList.add('esconder');
    document.querySelector('.novo-quiz').classList.remove('esconder');
    window.scrollTo(0, 0);
}

const btnHome = () => {
    window.location.reload();
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
    request.catch(error => console.log(`Unable to retrive quizzes from server, please try again later. Error: ${error.status}`));
}

function oneQuizz (id) {

    const request = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);

    request.then(infoQuizz => {
      console.log(infoQuizz.data)
    renderQuizz(infoQuizz)});
    request.catch(error => console.log(`Unable to retrive quizzes from server, please try again later. Error: ${error.status}`));
}

function renderQuizz (infoQuizz) {
    const quizzID = infoQuizz.data.id;

    const container = document.querySelector('.pagina-quizz .container');

    container.innerHTML = "";

    container.innerHTML += `
    <div class="banner-sup">
      <img alt="Banner superior" src="${infoQuizz.data.image}">
      <h2>${infoQuizz.data.title}</h2>
    </div>
    `

    for (let i = 0; i < infoQuizz.data.questions.length; i++){

        let conteudoRespostas = [];

        for(let j = 0; j < infoQuizz.data.questions[i].answers.length; j++){
            let resBlock = `<div onClick="trataResposta(this)" data-correct="${infoQuizz.data.questions[i].answers[j].isCorrectAnswer}" class="opcao-individual">
            <img alt="${infoQuizz.data.questions[i].answers[j].text}" src="${infoQuizz.data.questions[i].answers[j].image}">
            <h3>${infoQuizz.data.questions[i].answers[j].text}</h3>
            </div>` ;
            conteudoRespostas.push(resBlock);
        }

        container.innerHTML += `
          <div class="pagina-quizz-individual">
            <div class="pag-quizz-ind-titulo" style="background-color:${infoQuizz.data.questions[i].color}">
              <h2>${infoQuizz.data.questions[i].title}</h2>
            </div>
            <div class="pag-quizz-ind-opcoes">
              ${conteudoRespostas.sort(() => Math.random() - 0.5).join(" ")}
            </div>
          </div>
        `
        }

        container.id = quizzID;
    }

function trataResposta (clicado) {

    const parametro = clicado.innerHTML;

    const blocoRespectivo = clicado.parentNode;

    Array.from(blocoRespectivo.children).forEach(elem => {
      if(elem.innerHTML != parametro ){
        elem.style.opacity = "50%";
      }
      if(elem.getAttribute('data-correct') == "true"){
        elem.children.item(1).style.color = "#009C22";
      } else {
        elem.children.item(1).style.color = "#FF4B4B";
      }
    })

    
}


function validaInputs(inputs) {
    /* Dada uma lista de inputs, retorna true se validas. Do
    contrário, retorna false */
    inputs.forEach((input) => input.value = input.value.trim());
    for (const input of inputs) {
        if (!input.checkValidity()) {
            return false;
        }
    }
    return true;
}

function unfoldFormCard() {
    /* Função chamada ao clicar no botão de editar em um card de pergunta ou
    nível colapsado. A função descolapsa o card em questão, e colapsa todos os demais */
    this.closest('main')
        .querySelectorAll('.form-card')
        .forEach((formCard) => {
            formCard.classList.add('fold');
        })

    const formCard = this.closest('.form-card');
    formCard.classList.remove('fold');
    // Scrollar até o topo do card em questão ficar visivel
    window.scrollTo(0, formCard.offsetTop - 75);
}

function irParaPerguntas() {
    /* Checa as informações basicas em #info-base. Se forem validas,
    popula novoQuiz, #perguntas e #niveis e exibe #perguntas */
    const telaDeInfoBase = document.querySelector('#info-base');
    const inputs = telaDeInfoBase.querySelectorAll("input");

    if (!validaInputs(inputs)) {
        alert('Valor inválido! Você deve inserir um título de 20 a 65 caracteres, uma URL válida, uma quantia de perguntas de no mínimo 3 e uma quantia de níveis de no mínimo 2.');
        return null;
    }

    const [titleInput, imageInput, perguntasInput, niveisInput] =
        telaDeInfoBase.querySelectorAll('input');

    newQuizz.title = titleInput.value.trim();
    newQuizz.image = imageInput.value.trim();

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
              <input required type="text" class="texto-pergunta" min="20" placeholder="Texto da pergunta">
              <input required type="text" class="cor-pergunta" pattern="#[a-fA-F0-9]{6}" placeholder="Cor de fundo da pergunta">
            </div>
            <div class="form-grupo">
              <span>Reposta correta</span>
              <input required type="text" class="resp" placeholder="Reposta correta">
              <input required type="url" class="img-src-resp" placeholder="URL da imagem">
            </div>
            <div class="form-grupo">
              <span>Repostas incorretas</span>
              <input required type="text" class="resp" placeholder="Reposta incorreta 1">
              <input required type="url" class="img-src-resp" placeholder="URL da imagem 1">
            </div>
            <div class="form-grupo">
              <input type="text" class="resp" placeholder="Reposta incorreta 2">
              <input type="url" class="img-src-resp" placeholder="URL da imagem 2">
            </div>
            <div class="form-grupo">
              <input type="text" class="resp" placeholder="Reposta incorreta 3">
              <input type="url" class="img-src-resp" placeholder="URL da imagem 3">
            </div>
          </div>`
    }

    telaDePerguntas.innerHTML += '<button class="btn-prosseguir" onclick="irParaNiveis();">Prosseguir para criar níveis</button>';

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

    telaDeNiveis.innerHTML += '<button class="btn-prosseguir" onclick="enviarQuizz();">Finalizar Quizz</button>';

    // Chamando unfoldFormCard nos clicks nos botões .btn-fold
    const foldBtns = document.querySelectorAll(".btn-fold");
    foldBtns.forEach((btn) => {
        btn.addEventListener("click", unfoldFormCard)
    });

    // Removendo classe fold dos primeiros form-cards de cada tela
    document.querySelectorAll(":is(#perguntas, #niveis) .form-card:first-of-type")
        .forEach((elem) => elem.classList.remove("fold"));

    esconderTodas();
    telaDePerguntas.classList.remove("esconder");
}

function irParaNiveis() {
    /* Checa as perguntas em #perguntas. Se forem validas,
    popula novoQuiz e exibe #niveis */
    const telaDePerguntas = document.querySelector("#perguntas");
    const inputs = telaDePerguntas.querySelectorAll("input");

    if (!validaInputs(inputs)) {
        alert('Valor inválido! O texto da pergunta deve ter no mínimo 20 caracteres, a cor deve estar em formato HEX e a resposta correta e ao menos uma resposta incorreta são obrigatórias.');
        return null;
    }

    const formCards = telaDePerguntas.querySelectorAll('.form-card');

    for (const formCard of formCards) {

        const pergunta = {
            title: '',
            color: '',
            answers: []
        };

        const inputTextoPergunta = formCard.querySelector(".texto-pergunta");
        pergunta.title = inputTextoPergunta.value.trim();

        const inputCorPergunta = formCard.querySelector(".cor-pergunta");
        pergunta.color = inputCorPergunta.value.trim();

        const respsInputs = formCard.querySelectorAll(".resp");
        const respsImgInputs = formCard.querySelectorAll(".img-src-resp");

        for (let i = 0; i < respsInputs.length; i++) {
            // Se alguma reposta opcional tiver algum input em branco, ignore-a
            if (respsInputs[i].value.trim() === "") continue;
            if (respsImgInputs[i].value.trim() === "") continue;

            const resposta = {
                text: '',
                image: '',
                isCorrectAnswer: i === 0
            }

            resposta.text = respsInputs[i].value.trim();
            resposta.image = respsImgInputs[i].value.trim();
            pergunta.answers.push(resposta);
        }

        newQuizz.questions.push(pergunta);
    }

    const telaDeNiveis = document.querySelector('#niveis');
    esconderTodas();
    telaDeNiveis.classList.remove("esconder");
}

function enviarQuizz() {
    /* Checa os niveis em #niveis. Se forem validas, realiza o
    post na API, guarda novoQuizz no localStorage e exibe #fim-novo-quizz */
    const telaDeNiveis = document.querySelector("#niveis");
    const inputs = telaDeNiveis.querySelectorAll("input");
    const percentMinInputs = telaDeNiveis.querySelectorAll(".acerto-min-nivel");
    const zeroPercentIndex = Array.from(percentMinInputs)
        .map(input => input.value)
        .indexOf("0");

    if (!validaInputs(inputs) || zeroPercentIndex === -1) {
        alert('Valor inválido! O título dos níveis deve ter no mínimo 10 caracteres, a descrição deve ter no mínimo 30 caractéres, o formato de URL deve ser válido e ao menos um nível deve ter percentual de acerto mínimo nulo.');
        return null;
    }

    const formCards = telaDeNiveis.querySelectorAll('.form-card');

    for (const formCard of formCards) {

        const nivel = {
            title: '',
            image: '',
            text: '',
            minValue: 0
        }

        const [titleInput, minValueInput, imageInput, descInput] =
            formCard.querySelectorAll('input');

        nivel.title = titleInput.value.trim();
        nivel.image = imageInput.value.trim();
        nivel.text = descInput.value.trim();
        nivel.minValue = parseInt(minValueInput.value);

        newQuizz.levels.push(nivel);
    }

    // Postando o Quizz na API
    const url = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';

    return axios.post(url, newQuizz)
        .then((response) => {
            const quizzes = JSON.parse(localStorage.getItem('quizzes'));
            quizzes.push(response.data);
            const quizzesStr = JSON.stringify(quizzes);
            localStorage.setItem('quizzes', quizzesStr);

            // Em caso de sucesso, popula e mostra #fim-novo-quiz
            const telaFinal = document.querySelector('#fim-novo-quizz');
            telaFinal.innerHTML += `
              <div class="quizz-individual-container">
                <div class="quizz-individual">
                  <img src="${newQuizz.image}" alt="Imagem Quizz ${response.data.id}">
                  <p>${newQuizz.title}</p>
                </div>
              </div>
              <button class="btn-prosseguir" onclick="btnQuizzIndividual(${response.data.id});">Acessar Quiz</button>
              <button class="btn-home" onclick="btnHome();">Voltar para home</button>
            `;

            esconderTodas();
            telaFinal.classList.remove("esconder");
        })
        .catch((error) => {
            console.log(error);
            alert('Unable to post quizzes to server, please try again later.');
        });
}

window.onload = () => {
    getQuizzes();

    if (localStorage.getItem('quizzes') === null) {
        localStorage.setItem('quizzes', JSON.stringify([]));
    }
}