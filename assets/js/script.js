function getQuizzes () {

    const request = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');

    request.then(quizzes => console.log(quizzes.data));
    request.catch(error => `Unable to retrive quizzes from server, please try again later. Error: ${error.status}`);
}

getQuizzes()