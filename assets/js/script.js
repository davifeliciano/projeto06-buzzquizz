
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
        console.log(quizzes.data[0].questions)
        
        const exibirQuizzes = document.querySelector('.area-todos-quizzes');
        console.log(quizzes.data.length);
        exibirQuizzes.innerHTML = "";

        for (let i = 0; i < quizzes.data.length; i++){
            exibirQuizzes.innerHTML = exibirQuizzes.innerHTML +`
            <div onclick="AAAAAAA()" class="quizz-individual">
              <img alt="Imagem Quizz 2" src="${quizzes.data[i].image}">
              <p>${quizzes.data[i].title}</p>
            </div>
            `
        }
        
    });
    request.catch(error => `Unable to retrive quizzes from server, please try again later. Error: ${error.status}`);
}

function oneQuizz (this) {

    const quizz = document.querySelector(this);

    const idQuizz = quizz.getAttribute(id);

    const request = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`);

    request.then();
    request.catch();
}

getQuizzes()
