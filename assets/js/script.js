let newQuizz = {
  title: "",
  image: "",
  questions: [],
  levels: [],
};

// Quizz atualmente em edição
let editingQuizz = null;

let myQuizzes;

//variáveis da finalização do quizz
let pontuacao = 0;
let level;

function esconderTodas() {
  const mains = document.querySelectorAll("main");
  mains.forEach((elem) => elem.classList.add("esconder"));
  window.scrollTo(0, 0);
}

const btnQuizzIndividual = (idSelecao) => {
  const id = idSelecao.getAttribute("data-id");
  oneQuizz(id);
};

const btnCriarQuizz = () => {
  esconderTodas();
  document.querySelector(".novo-quiz").classList.remove("esconder");
  window.scrollTo(0, 0);
};

const btnHome = () => {
  window.location.reload();
};

// Listagem dos Quizzes - gerais e do usuário
function getQuizzes() {
  esconderTodas();
  document.querySelector(".loading").classList.remove("esconder");

  const request = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
  );

  request.then((quizzes) => {
    const exibirQuizzes = document.querySelector(".area-todos-quizzes");

    for (let i = 0; i < quizzes.data.length; i++) {
      exibirQuizzes.innerHTML += `
            <div data-id="${quizzes.data[i].id}" onclick="btnQuizzIndividual(this)" class="quizz-individual">
              <div class="background-individual"></div>
              <img alt="Imagem de ${quizzes.data[i].title}" src="${quizzes.data[i].image}">
              <p>${quizzes.data[i].title}</p>
            </div>
            `;

      for (let j = 0; j < myQuizzes.length; j++) {
        if (myQuizzes[j].id == quizzes.data[i].id) {
          exibirQuizzes
            .querySelector(`.quizz-individual[data-id="${myQuizzes[j].id}"]`)
            .classList.add("esconder");
        }
      }
    }

    document.querySelector(".loading").classList.add("esconder");
    document.querySelector(".lista-quizzes").classList.remove("esconder");
  });

  request.catch((error) =>
    alert(
      `Unable to retrive quizzes from server, please try again later. Error: ${error.response.status}`
    )
  );
}

function oneQuizz(id) {
  esconderTodas();
  document.querySelector(".loading").classList.remove("esconder");

  const request = axios.get(
    `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`
  );

  request.then((infoQuizz) => {
    pontuacao = 0;
    level = undefined;
    renderQuizz(infoQuizz);
    esconderTodas();
    document.querySelector(".pagina-quizz").classList.remove("esconder");
  });

  request.catch((error) =>
    alert(
      `Unable to retrive quizzes from server, please try again later. Error: ${error.response.status}`
    )
  );
}

function renderQuizz(infoQuizz) {
  level = infoQuizz.data.levels;
  const quizzID = infoQuizz.data.id;
  const container = document.querySelector(".pagina-quizz .container");
  container.innerHTML = "";

  container.innerHTML += `
    <div class="banner-sup">
      <img alt="Banner superior" src="${infoQuizz.data.image}">
      <h2>${infoQuizz.data.title}</h2>
    </div>
    `;

  for (let i = 0; i < infoQuizz.data.questions.length; i++) {
    let conteudoRespostas = [];

    for (let j = 0; j < infoQuizz.data.questions[i].answers.length; j++) {
      conteudoRespostas.push(`
            <div onclick="trataResposta(this)" data-correct="${infoQuizz.data.questions[i].answers[j].isCorrectAnswer}" class="opcao-individual">
              <img alt="${infoQuizz.data.questions[i].answers[j].text}" src="${infoQuizz.data.questions[i].answers[j].image}">
              <h3>${infoQuizz.data.questions[i].answers[j].text}</h3>
            </div>`);
    }

    container.innerHTML += `
          <div class="pagina-quizz-individual">
            <div class="pag-quizz-ind-titulo" style="background-color:${
              infoQuizz.data.questions[i].color
            }">
              <h2>${infoQuizz.data.questions[i].title}</h2>
            </div>
            <div class="pag-quizz-ind-opcoes">
              ${conteudoRespostas.sort(() => Math.random() - 0.5).join(" ")}
            </div>
          </div>
        `;
  }

  container.id = quizzID;
}

const scrollDown = (elemento) => {
  if (elemento === null) {
    return;
  }

  window.scrollTo(0, elemento.offsetTop - 50);
};

function trataResposta(clicado) {
  if (clicado.classList.contains("selecionado")) {
    return;
  }
  if (clicado.classList.contains("locked")) {
    return;
  }

  clicado.classList.add("selecionado");
  const parametro = clicado.innerHTML;
  const blocoRespectivo = clicado.parentNode;

  Array.from(blocoRespectivo.children).forEach((elem) => {
    if (elem.innerHTML != parametro) {
      elem.style.opacity = "50%";
      elem.classList.add("locked");
    }
    if (elem.getAttribute("data-correct") == "true") {
      elem.children.item(1).style.color = "#009C22";
    } else {
      elem.children.item(1).style.color = "#FF4B4B";
    }
  });

  setTimeout(
    () => scrollDown(blocoRespectivo.parentNode.nextElementSibling),
    2000
  );

  if (clicado.dataset.correct == "true") {
    pontuacao++;
  }

  const selecionados = document.querySelectorAll(".selecionado");
  const questoes = document.querySelectorAll(".pagina-quizz-individual");
  const parametroQuestoes = questoes.length;

  if (selecionados.length == questoes.length) {
    mostrarResultado(pontuacao, parametroQuestoes);
  }
}

function mostrarResultado(pontuacao, questoes) {
  let porcentagem = ((pontuacao / questoes) * 100).toFixed(0);
  let levelClass;

  for (let i = 0; i < level.length; i++) {
    if (porcentagem >= level[i].minValue) {
      levelClass = level[i];
    }
  }

  const container = document.querySelector(".pagina-quizz .container");
  const id = container.id;

  container.innerHTML += `
      <div class="pagina-quizz-individual-resultado">
        <div class="pag-quizz-ind-res-titulo" style="background-color: black">
          <h2>${porcentagem}% de acerto: ${levelClass.title}</h2>
        </div>
        <div class="pag-quizz-reiniciar">
          <div class="reiniciar-left">
          <img alt="${levelClass.title}" src="${levelClass.image}">
          </div>
          <div class="reiniciar-right">
          <h3>${levelClass.text}</h3>
          </div>
        </div>
        <button onclick="oneQuizz(${id})" class="reinicio">Reiniciar Quizz</button>
        <button onclick="btnHome()" class="home">Voltar para a Home</button>
      </div>`;

  setTimeout(
    () =>
      window.scrollTo(
        0,
        document.querySelector(".pagina-quizz-individual-resultado").offsetTop -
          50
      ),
    2000
  );
}

function validaInputs(inputs) {
  /* Dada uma lista de inputs, retorna true se validas. Do
  contrário, retorna false */
  inputs.forEach((input) => (input.value = input.value.trim()));
  let valid = true;

  for (const input of inputs) {
    if (!input.checkValidity()) {
      input.classList.add("invalido");
      valid = false;
    } else {
      input.classList.remove("invalido");
    }
  }

  return valid;
}

function unfoldFormCard() {
  /* Função chamada ao clicar no botão de editar em um card de pergunta ou
  nível colapsado. A função descolapsa o card em questão, e colapsa todos os demais */
  this.closest("main")
    .querySelectorAll(".form-card")
    .forEach((formCard) => {
      formCard.classList.add("fold");
    });

  const formCard = this.closest(".form-card");
  formCard.classList.remove("fold");
  // Scrollar até o topo do card em questão ficar visivel
  window.scrollTo(0, formCard.offsetTop - 75);
}

function editarQuizz(quizzId) {
  /* Função chamada ao clicar no botão de edição de um
  dos quizzes do usuário */
  console.log(quizzId);
  const quizz = JSON.parse(localStorage.getItem("quizzes")).find(
    (quizz) => quizz.id === parseInt(quizzId)
  );
  editingQuizz = quizz;

  const telaDeInfoBase = document.querySelector("#info-base");
  const [titleInput, imageInput, perguntasInput, niveisInput] =
    telaDeInfoBase.querySelectorAll("input");

  titleInput.value = quizz.title;
  imageInput.value = quizz.image;
  perguntasInput.value = quizz.questions.length;
  niveisInput.value = quizz.levels.length;

  btnCriarQuizz();
}

function irParaPerguntas() {
  /* Checa as informações basicas em #info-base. Se forem validas,
  popula novoQuiz, #perguntas e #niveis e exibe #perguntas */
  const telaDeInfoBase = document.querySelector("#info-base");
  const inputs = telaDeInfoBase.querySelectorAll("input");

  if (!validaInputs(inputs)) {
    // alert('Valor inválido! Você deve inserir um título de 20 a 65 caracteres, uma URL válida, uma quantia de perguntas de no mínimo 3 e uma quantia de níveis de no mínimo 2.');
    return null;
  }

  const [titleInput, imageInput, perguntasInput, niveisInput] =
    telaDeInfoBase.querySelectorAll("input");

  newQuizz.title = titleInput.value.trim();
  newQuizz.image = imageInput.value.trim();

  const telaDePerguntas = document.querySelector("#perguntas");
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
              <div>
                <input required type="text" class="texto-pergunta" pattern="^.{20,}$" placeholder="Texto da pergunta">
                <span>Precisa ter no mínimo 20 caracteres</span>
              </div>
              <div>
              <input required type="text" class="cor-pergunta" pattern="#[a-fA-F0-9]{6}" placeholder="Cor de fundo da pergunta">
                <span>Precisa ser uma cor no formato HEX (#xxxxxx)</span>
              </div>
            </div>
            <div class="form-grupo">
              <span>Reposta correta</span>
              <div>
              <input required type="text" class="resp" placeholder="Reposta correta">
                <span>Preencha este campo</span>
              </div>
              <div>
              <input required type="url" class="img-src-resp" placeholder="URL da imagem">
                <span>Precisa ser uma URL válida</span>
              </div>
            </div>
            <div class="form-grupo">
              <span>Repostas incorretas</span>
              <div>
              <input required type="text" class="resp" placeholder="Reposta incorreta 1">
                <span>Preencha este campo</span>
              </div>
              <div>
              <input required type="url" class="img-src-resp" placeholder="URL da imagem 1">
                <span>Precisa ser uma URL válida</span>
              </div>
            </div>
            <div class="form-grupo">
              <input type="text" class="resp" placeholder="Reposta incorreta 2">
              <input type="url" class="img-src-resp" placeholder="URL da imagem 2">
            </div>
            <div class="form-grupo">
              <input type="text" class="resp" placeholder="Reposta incorreta 3">
              <input type="url" class="img-src-resp" placeholder="URL da imagem 3">
            </div>
          </div>`;
  }

  telaDePerguntas.innerHTML +=
    '<button class="btn-prosseguir" onclick="irParaNiveis();">Prosseguir para criar níveis</button>';

  const telaDeNiveis = document.querySelector("#niveis");
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
              <div>
                <input required type="text" class="titulo-nivel" pattern="^.{10,}$" placeholder="Título do nível">
                <span>Precisa ter no mínimo 10 caracteres</span>
              </div>
              <div>
              <input required type="number" class="acerto-min-nivel" min="0" max="100" placeholder="% de acerto mínimo">
                <span>Precisa ser um valor entre 0 e 100%</span>
              </div>
              <div>
              <input required type="url" class="img-src-nivel" placeholder="URL da imagem do nível">
                <span>Precisa ser uma URL válida</span>
              </div>
              <div>
                <input required type="text" class="desc-nivel" pattern="^.{30,}$" placeholder="Descrição do nível">
                <span>Precisa ter no mínimo 30 caracteres</span>
              </div>
            </div>
          </div>`;
  }

  telaDeNiveis.innerHTML +=
    '<button class="btn-prosseguir" onclick="enviarQuizz();">Finalizar Quizz</button>';

  // Chamando unfoldFormCard nos clicks nos botões .btn-fold
  const foldBtns = document.querySelectorAll(".btn-fold");
  foldBtns.forEach((btn) => {
    btn.addEventListener("click", unfoldFormCard);
  });

  // Removendo classe fold dos primeiros form-cards de cada tela
  document
    .querySelectorAll(":is(#perguntas, #niveis) .form-card:first-of-type")
    .forEach((elem) => elem.classList.remove("fold"));

  /* Caso um quiz esteja em edição, popula os forms */
  if (editingQuizz !== null) {
    const cardsDePerguntas = telaDePerguntas.querySelectorAll(".form-card");
    const cardsDeNiveis = telaDeNiveis.querySelectorAll(".form-card");

    for (let i = 0; i < cardsDePerguntas.length; i++) {
      const question = editingQuizz.questions[i];

      if (question !== undefined) {
        const [titleInput, colorInput, ...answerInputs] =
          cardsDePerguntas[i].querySelectorAll("input");

        titleInput.value = question.title;
        colorInput.value = question.color;

        const answerValues = [];
        for (const answer of question.answers) {
          answerValues.push(answer.text, answer.image);
        }

        answerValues.forEach((value, i) => {
          answerInputs[i].value = value;
        });
      }
    }

    for (let i = 0; i < cardsDeNiveis.length; i++) {
      const level = editingQuizz.levels[i];

      if (level !== undefined) {
        const [titleInput, minPercentInput, imageInput, descInput] =
          cardsDeNiveis[i].querySelectorAll("input");

        titleInput.value = level.title;
        minPercentInput.value = level.minValue;
        imageInput.value = level.image;
        descInput.value = level.text;
      }
    }
  }

  esconderTodas();
  telaDePerguntas.classList.remove("esconder");
}

function irParaNiveis() {
  /* Checa as perguntas em #perguntas. Se forem validas,
  popula novoQuiz e exibe #niveis */
  const telaDePerguntas = document.querySelector("#perguntas");
  const inputs = telaDePerguntas.querySelectorAll("input");

  if (!validaInputs(inputs)) {
    // alert('Valor inválido! O texto da pergunta deve ter no mínimo 20 caracteres, a cor deve estar em formato HEX e a resposta correta e ao menos uma resposta incorreta são obrigatórias.');
    return null;
  }

  const formCards = telaDePerguntas.querySelectorAll(".form-card");

  for (const formCard of formCards) {
    const pergunta = {
      title: "",
      color: "",
      answers: [],
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
        text: "",
        image: "",
        isCorrectAnswer: i === 0,
      };

      resposta.text = respsInputs[i].value.trim();
      resposta.image = respsImgInputs[i].value.trim();
      pergunta.answers.push(resposta);
    }

    newQuizz.questions.push(pergunta);
  }

  const telaDeNiveis = document.querySelector("#niveis");
  esconderTodas();
  telaDeNiveis.classList.remove("esconder");
}

function successCallback(response) {
  document.querySelector(".loading").classList.add("esconder");
  let quizzes = JSON.parse(localStorage.getItem("quizzes"));

  if (editingQuizz !== null) {
    quizzes = quizzes.filter((quizz) => quizz.id !== editingQuizz.id);
  }

  quizzes.push(response.data);
  const quizzesStr = JSON.stringify(quizzes);
  localStorage.setItem("quizzes", quizzesStr);

  // Em caso de sucesso, popula e mostra #fim-novo-quiz
  const telaFinal = document.querySelector("#fim-novo-quizz");
  telaFinal.innerHTML += `
          <div class="quizz-individual-container">
            <div class="quizz-individual">
              <img src="${newQuizz.image}" alt="Imagem Quizz ${response.data.id}">
              <p>${newQuizz.title}</p>
            </div>
          </div>
          <button class="btn-prosseguir" onclick="oneQuizz(${response.data.id});">Acessar Quiz</button>
          <button class="btn-home" onclick="btnHome();">Voltar para home</button>
        `;

  // Reseta objeto newQuizz
  newQuizz = {
    title: "",
    image: "",
    questions: [],
    levels: [],
  };

  esconderTodas();
  telaFinal.classList.remove("esconder");
}

function enviarQuizz() {
  /* Checa os niveis em #niveis. Se forem validas, realiza o
  post na API, guarda novoQuizz no localStorage e exibe #fim-novo-quizz */
  const telaDeNiveis = document.querySelector("#niveis");
  const inputs = telaDeNiveis.querySelectorAll("input");
  const percentMinInputs = telaDeNiveis.querySelectorAll(".acerto-min-nivel");
  const zeroPercentIndex = Array.from(percentMinInputs)
    .map((input) => input.value)
    .indexOf("0");

  if (!validaInputs(inputs) || zeroPercentIndex === -1) {
    // alert('Valor inválido! O título dos níveis deve ter no mínimo 10 caracteres, a descrição deve ter no mínimo 30 caractéres, o formato de URL deve ser válido e ao menos um nível deve ter percentual de acerto mínimo nulo.');
    return null;
  }

  const formCards = telaDeNiveis.querySelectorAll(".form-card");

  for (const formCard of formCards) {
    const nivel = {
      title: "",
      image: "",
      text: "",
      minValue: 0,
    };

    const [titleInput, minValueInput, imageInput, descInput] =
      formCard.querySelectorAll("input");

    nivel.title = titleInput.value.trim();
    nivel.image = imageInput.value.trim();
    nivel.text = descInput.value.trim();
    nivel.minValue = parseInt(minValueInput.value);

    newQuizz.levels.push(nivel);
  }

  esconderTodas();
  document.querySelector(".loading").classList.remove("esconder");

  // Postando o Quizz na API
  const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

  if (editingQuizz !== null) {
    return axios
      .put(`${url}/${editingQuizz.id}`, newQuizz, {
        headers: { "Secret-Key": editingQuizz.key },
      })
      .then(successCallback)
      .catch((error) => {
        document.querySelector(".loading").classList.add("esconder");
        telaDeNiveis.classList.remove("esconder");
        console.log(error);
        alert("Unable to put quizzes to server, please try again later.");
      });
  }

  return axios
    .post(url, newQuizz)
    .then(successCallback)
    .catch((error) => {
      document.querySelector(".loading").classList.add("esconder");
      telaDeNiveis.classList.remove("esconder");
      console.log(error);
      alert("Unable to post quizzes to server, please try again later.");
    });
}

//deletar quizz

function deleteQuizz(deletarQuizz) {
  let retorno = confirm("Tem certeza de que quer excluir o Quizz?");
  let idDeletar = deletarQuizz.getAttribute("data-id");
  let keyDeletar = deletarQuizz.getAttribute("data-key");

  const novosQuizzesUser = [];

  if (retorno === true) {
    const request = axios.delete(
      `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idDeletar}`,
      { headers: { "Secret-Key": keyDeletar } }
    );

    request.then(() => {
      for (let i = 0; i < myQuizzes.length; i++) {
        if (myQuizzes[i].id != idDeletar) {
          novosQuizzesUser.push(myQuizzes[i]);
        }
      }

      const novosQuizzesUserstr = JSON.stringify(novosQuizzesUser);
      //localStorage.removeItem('quizzes');
      localStorage.removeItem("quizzes");
      localStorage.setItem("quizzes", novosQuizzesUserstr);
      alert("Seu Quizz foi excluído com sucesso!");
      getQuizzesUser();
    });

    request.catch(() => {
      alert(
        "Houve um erro ao tentar excluir seu Quizz. Tente novamente mais tarde."
      );
    });
  }
}

// Exibir quizzes do usuario
function getQuizzesUser() {
  myQuizzes = JSON.parse(localStorage.getItem("quizzes"));

  if (myQuizzes.length !== 0) {
    document.querySelector(".cria-quizz").classList.add("esconder");
    document.querySelector(".meus-quizzes").classList.remove("esconder");
  } else {
    document.querySelector(".cria-quizz").classList.remove("esconder");
    document.querySelector(".meus-quizzes").classList.add("esconder");
  }

  const meusQuizzesIndividual = document.querySelector(
    ".area-todos-quizzes-ind"
  );
  meusQuizzesIndividual.innerHTML = "";

  for (let i = 0; i < myQuizzes.length; i++) {
    meusQuizzesIndividual.innerHTML =
      `
          <div class="quizz-ind-z1">
            <div class="edit-delete">
              <ion-icon data-id="${myQuizzes[i].id}" onclick="editarQuizz(this.dataset.id)" name="create-outline"></ion-icon>
              <ion-icon data-id="${myQuizzes[i].id}" data-key="${myQuizzes[i].key}" onclick="deleteQuizz(this)" name="trash-outline"></ion-icon>
            </div>
            <div class="quizz-individual" data-id="${myQuizzes[i].id}" onclick="btnQuizzIndividual(this)" >
              <div class="background-individual"></div>
              <img alt="Imagem de ${myQuizzes[i].title}" src="${myQuizzes[i].image}">
              <p>${myQuizzes[i].title}</p>
            </div>
          </div>
          ` + meusQuizzesIndividual.innerHTML;
  }
}

window.onload = () => {
  if (localStorage.getItem("quizzes") === null) {
    localStorage.setItem("quizzes", JSON.stringify([]));
  }

  getQuizzes();
  getQuizzesUser();
};
