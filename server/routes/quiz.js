const express = require('express');
const Quizzes = require('../db/quizzes');

const router = express.Router();

router.post('/quiz', function (req, res) {
  if(!req.user) {

    if (req.user.id !== "admin") {
      res.status(403).send();
      return;
    } else {
      res.status(401).send();
      return;
    }
  }

  if (req.body.question.length < 5) {
    res.status(400).send(`Question must be at least 5 characters long.`);
  }
  const created = Quizzes.createQuiz(req.body.question, req.body.answers, req.body.correctAnswer, req.body.category);
  if (!created) {
    res.status(400).send();
    return;
  }
  res.status(200).json({id: created});

});

router.put('/quiz', function (req, res) {
  if(!req.user) {
    if (req.user.id !== "admin") {
      res.status(403).send();
      return;
    } else {
      res.status(401).send();
      return;
    }
  }
  if (req.body.question.length < 5) {
    res.status(400).send(`Question must be at least 5 characters long.`);
  }
  const updated = Quizzes.updateQuiz(req.body.id, req.body.question, req.body.answers, req.body.correctAnswer, req.body.category);
  if (!updated) {
    res.status(400).send();
    return;
  }
  res.status(204).send();

});

router.get('/quizzes', function (req, res) {
  const quizzes = Quizzes.getQuizzes();
  res.status(200).json({quizzes: quizzes});
});


router.get('/randomQuiz', function (req, res) {
  const quiz = Quizzes.getRandomQuiz();
  if(!quiz){
    res.status(404).send();
    return;
  }
  res.status(200).json({quiz: quiz});
});

module.exports = router;
