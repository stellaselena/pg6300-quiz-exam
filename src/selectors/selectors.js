export function categoriesFormattedForDropdown(categories) {
  return categories.map((category, i) => {
    return {
      value: category,
      text: category
    };
  });
}

export function correctAnswersFormattedForDropdown(answers) {
  return answers.map((answer, i) => {
    return {
      value: i,
      text: "Answer "+ parseInt(i + 1)
    };
  });
}
