import React from 'react';
import expect from 'expect';
import {mount, shallow} from 'enzyme';
import {ManageQuizPage} from '../src/components/quiz/ManageQuizPage';
import '../tools/testSetup';

describe ('Manage Quiz Page', () => {
  it('sets error message upon blur of empty question field', () => {
    const props = {
      categories: [],
      correctAnswers: [],
      actions: { saveQuiz: () => { return Promise.resolve(); }},
      quiz: {id: '', question: '', category: ''},
      match: {},
      userId: "admin"
    };
    const wrapper = mount(<ManageQuizPage {...props}/>);
    const saveButton = wrapper.find('input').last();
    expect(saveButton.prop('type')).toBe('submit');
    saveButton.simulate('click');
    expect(wrapper.state().errors.question).toBe('Question must be at least 5 characters long.');
  });
});
