export default {
  quizzes: [],
  categories: [],
  match: {
    inProgress: false,
    firstPlayer: null,
    matchId: null,
    quiz: {},
    matchLog: []
  },
  ajaxCallsInProgress: 0,
  userId: "",
  websocketAuth: false
};
