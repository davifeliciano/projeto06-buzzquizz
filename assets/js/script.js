const btnCriarQuizz = () => {
    document.querySelector('.lista-quizzes').classList.add('esconder');
    document.querySelector('.pagina-quizz').classList.remove('esconder');
    window. scrollTo(0, 0);
}

const btnHome = () => {
    document.querySelector('.lista-quizzes').classList.remove('esconder');
    document.querySelector('.pagina-quizz').classList.add('esconder');
    window. scrollTo(0, 0);
}