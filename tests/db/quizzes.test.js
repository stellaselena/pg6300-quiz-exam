import expect from "expect";
const Quizzes = require('../../server/db/quizzes');

beforeEach(() => {Quizzes.resetQuizzes();});

describe('Create & update a quiz and then find it', () => {
  it('Create & update a quiz and then find it', () => {
    const quizId = Quizzes.createQuiz("question", ["answer1", "answer2", "answer3", "answer4"], 1, "Javascript");
    Quizzes.updateQuiz(quizId, "updatedQuestion", ["answer1", "answer2", "answer3", "answer4"], 1, "Javascript");

    const foundQuiz = Quizzes.getQuiz(quizId);
    expect(foundQuiz.question).toBe("updatedQuestion");
  });

});

