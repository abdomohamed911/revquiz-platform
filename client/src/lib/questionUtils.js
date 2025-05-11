export function resetQuestionOptions() {
  return [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ];
}

export function handleOptionChange(idx, field, value, options) {
  if (field === "isCorrect" && value === "true") {
    return options.map((opt, i) => ({ ...opt, isCorrect: i === idx }));
  }
  return options.map((opt, i) =>
    i === idx ? { ...opt, [field]: value } : opt
  );
}
