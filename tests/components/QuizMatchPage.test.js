import expect from 'expect';
import React from 'react';
import {mount, shallow} from 'enzyme';
import QuizMatchPage from '../../src/components/play/common/QuizMatchPage';
import '../../tools/testSetup';

function setup(onNext, disabled, round, canStart) {
  const props = {
    question: "question",
    answers: ["1","2","3","4"],
    opponentsScore: [],
    canStart: canStart,
    onNext: onNext,
    onAnswer: () => {},
    answerCorrect: {},
    disabled: disabled,
    score: 0,
    timeLeft: 10,
    round: round,
    onStart: null,
  };

  return shallow(<QuizMatchPage {...props} />);
}

describe('QuizMatchPage via Enzyme', () => {
  it('renders QuizMatchPage and next question button', () => {
    const wrapper = setup(() => {},false, 0, null);
    expect(wrapper.find('button').at(4).text()).toEqual('Next question');
  });

  it('renders different text on round change', () => {
    const wrapper = setup(() => {},false, 10, null);
    expect(wrapper.find('button').at(4).text()).toEqual('End match');
  });

  it('button renders begin match for online matches', () => {
    const wrapper = setup(null, true, 0, true);
    expect(wrapper.find('button').at(4).text()).toEqual('Begin match');

  });

});
