import styles from "../styles/QuestionBox.module.css";
import type { AnswerSubmissionsType } from "../index.d.ts";
import { Dispatch, SetStateAction } from "react";

type QuestionBoxProps = {
  setAnswerSubmission: Dispatch<SetStateAction<AnswerSubmissionsType>>;
  questionNumber: number;
  questionText: string;
  answers: string[];
  correctAnswer: number | null;
};

function QuestionBox(props: QuestionBoxProps) {
  const {
    setAnswerSubmission,
    questionNumber,
    questionText,
    answers,
    correctAnswer,
  } = props;

  function handleAnswer(chosenAnswer: number) {
    let answerSubmission: AnswerSubmissionsType = {
      id: questionNumber,
      chosenAnswer: chosenAnswer,
      isCorrect: chosenAnswer === correctAnswer,
    };

    setAnswerSubmission(answerSubmission);
  }

  return (
    <div className={styles.question_box}>
      <h2 className={styles.question_text}>
        {`(${questionNumber}) ${questionText}`}
      </h2>
      <div className={styles.answers_box}>
        {answers.map((answer, index) => (
          <label className={styles.answer_parent} key={index}>
            <input
              type="radio"
              name={`question${questionNumber}`}
              onChange={() => handleAnswer(index + 1)}
            />
            <p className={styles.answer}>{answer}</p>
          </label>
        ))}
      </div>
    </div>
  );
}

export default QuestionBox;
