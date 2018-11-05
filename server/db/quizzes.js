const quizzes =  [
    {
      id: "1",
      question: "How can you get the total number of arguments passed to a function",
      answers: ["Using args.length property",
        "Using arguments.length property",
        "Both of the above",
        "None of the above"],
      correctAnswer: 1,
      category: "JavaScript"
    },
    {
      id: "2",
      question: "Which of the following is correct about callbacks",
      answers: ["A callback is a plain JavaScript function passed to some method as an argument or option",
        "Some callbacks are just events, called to give the user a chance to react when a certain state is triggered.",
        "Both of the above",
        "None of the above"],
      correctAnswer: 2,
      category: "JavaScript"
    },
    {
      id: "3",
      question: "Which of the following function of Boolean object returns a string of either 'true' or 'false' depending upon the value of the object",
      answers: ["toSource()",
        "valueOf()",
        "toString()",
        "None of the above."],
      correctAnswer: 2,
      category: "JavaScript"
    },
    {
      id: "4",
      question: "Which of the following function of String object is used to match a regular expression against a string",
      answers: ["concat()",
        "match()",
        "search()",
        "replace()"],
      correctAnswer: 1,
      category: "JavaScript"
    },
    {
      id: "5",
      question: "Which of the following function of Array object creates a new array with the results of calling a provided function on every element in this array?",
      answers: ["push()",
        "join()",
        "pop()",
        "map()"],
      correctAnswer: 3,
      category: "JavaScript"
    },
    {
      id: "6",
      question: "Which of the following function of Array object removes the first element from an array and returns that element",
      answers: ["reverse()",
        "shift()",
        "slice()",
        "some()"],
      correctAnswer: 1,
      category: "JavaScript"
    }
  ];

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
  
  const generateId = (question) => {
    return replaceAll(question, ' ', '-');
  };

function getQuiz(id){
    return quizzes.find(quiz => quiz.id === id);
}

function getRandomQuiz(){
  return quizzes[Math.floor(Math.random()* quizzes.length)];
}

function getQuizzes(){
    return Object.values(quizzes);
}

function createQuiz(question, answers, correctAnswer, category){
    const id = generateId(question);
    if(getQuiz(id) !== undefined ){
        return false;
    }
    const quiz = {
        id: id,
        question: question,
        answers: answers,
        correctAnswer: correctAnswer,
        category: category
    };
    quizzes.push(quiz);
    return quiz.id;
}

function updateQuiz(id, question, answers, correctAnswer, category){

    if(getQuiz(id) === undefined ){
        return false;
    }
    const quiz = {
        id: id,
        question: question,
        answers: answers,
        correctAnswer: correctAnswer,
        category: category
    };
    const index = quizzes.findIndex(quiz => quiz.id === id);
    quizzes[index] = quiz;
    return true;
}

module.exports = {updateQuiz, getQuizzes, createQuiz, getRandomQuiz};
