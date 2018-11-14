import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../common/TextInput';
import SelectInput from '../common/SelectInput';

const QuizForm = ({quiz, allCategories, allCorrectAnswers, onSave, onChange, saving, errors}) => {
  return (
    <form className="container">
      <h1>Manage Quiz</h1>
      <TextInput
        name="question"
        label="Question"
        value={quiz.question}
        onChange={onChange}
        error={errors.question}/>
        {Array.from(Array(4).keys()).map((a,i) => (
        
          <TextInput
          key={i}
          name={"answer_" + i}
          label={"Answer " + parseInt(i + 1)}
          value={quiz.answers && quiz.answers[i]}
          onChange={onChange}
          error={errors.answers}/>
        ))}
      <SelectInput
        name="correctAnswer"
        label="Correct answer"
        value={quiz.correctAnswer && quiz.correctAnswer.toString()}
        defaultOption="Select correct answer"
        options={allCorrectAnswers}
        onChange={onChange}
        error={errors.correctAnswer}/>
      <SelectInput
        name="category"
        label="Category"
        value={quiz.category}
        defaultOption="Select category"
        options={allCategories}
        onChange={onChange}
        error={errors.category}/>

      <input
        type="submit"
        disabled={saving}
        value={saving ? 'Saving...' : 'Save'}
        className="btn btn-primary"
        onClick={onSave}/>
    </form>
  );
};

QuizForm.propTypes = {
  quiz: PropTypes.object.isRequired,
  allCategories: PropTypes.array.isRequired,
  allCorrectAnswers: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  errors: PropTypes.object
};

export default QuizForm;
