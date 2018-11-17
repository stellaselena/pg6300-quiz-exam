import expect from 'expect';
import React from 'react';
import {mount, shallow} from 'enzyme';
import QuizForm from '../../src/components/quiz/QuizForm';
import '../../tools/testSetup';

function setup(saving) {
  const props = {
    allCategories: [],
    allCorrectAnswers: [1,2,3,4],
    quiz: {},
    saving: saving,
    errors: {},
    onSave: () => {},
    onChange: () => {}
  };

  return shallow(<QuizForm {...props} />);
}

describe('QuizForm via Enzyme', () => {
  it('renders form and h1', () => {
    const wrapper = setup(false);
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('h1').text()).toEqual('Manage Quiz');
  });

  it('save button is labeled "Save" when not saving', () => {
    const wrapper = setup(false);
    expect(wrapper.find('input').props().value).toBe('Save');
  });

  it('save button is labeled "Saving..." when saving', () => {
    const wrapper = setup(true);
    expect(wrapper.find('input').props().value).toBe('Saving...');
  });
});
