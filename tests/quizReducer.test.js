import expect from 'expect';
import quizReducer from '../src/reducers/quizReducer';
import * as actions from '../src/actions/quizActions';

describe('Quiz Reducer', () => {
  it('should add quiz when passed CREATE_QUIZ_SUCCESS', () => {
    // arrange
    const initialState = [
      {question: 'A'},
      {question: 'B'}
    ];

    const newQuiz = {question: 'C'};

    const action = actions.createQuizSuccess(newQuiz);

    // act
    const newState = quizReducer(initialState, action);

    // assert
    expect(newState.length).toEqual(3);
    expect(newState[0].question).toEqual('A');
    expect(newState[1].question).toEqual('B');
    expect(newState[2].question).toEqual('C');
  });

  it('should update quiz when passed UPDATE_QUIZ_SUCCESS', () => {
    // arrange
    const initialState = [
      {id: 'A', question: 'A'},
      {id: 'B', question: 'B'},
      {id: 'C', question: 'C'}
    ];

    const quiz = {id: 'B', question: 'New Question'};
    const action = actions.updateQuizSuccess(quiz);

    // act
    const newState = quizReducer(initialState, action);
    const updatedQuiz = newState.find(a => a.id == quiz.id);
    const untouchedQuiz = newState.find(a => a.id == 'A');

    // assert
    expect(updatedQuiz.question).toEqual('New Question');
    expect(untouchedQuiz.question).toEqual('A');
    expect(newState.length).toEqual(3);
  });
});
