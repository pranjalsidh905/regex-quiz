export type QuestionItemType = {
  id: number | null;
  questionText: string;
  answers: string[];
  correctAnswer: number | null;
};

export type ResponseDataType = {
  id: string;
  password: string;
  created: string;
};

export type QuizCredentialsType = {
  id: string;
  password: string;
};

export type AnswerSubmissionsType = {
  id: number | null;
  chosenAnswer: number | null;
  isCorrect: boolean | null;
};
