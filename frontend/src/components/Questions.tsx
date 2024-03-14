import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "../styles/Questions.module.css";
import QuestionBox from "./QuestionBox";
import Button from "./Button.tsx";
import type { AnswerSubmissionsType, QuestionItemType } from "../index.d.ts";

type QuestionsProps = {
  questions: QuestionItemType[];
};

function Questions({ questions }: QuestionsProps) {
  const emptyAnswerSubmission: AnswerSubmissionsType = {
    id: null,
    chosenAnswer: null,
    isCorrect: null,
  }; // Initial value

  const [answerSubmission, setAnswerSubmission] =
    useState<AnswerSubmissionsType>(emptyAnswerSubmission); // Used to store answer submission for each question box

  const answerSubmissionsRef = useRef<AnswerSubmissionsType[]>([
    emptyAnswerSubmission,
  ]); // Used to store all answer submissions

  const answerSubmissions = answerSubmissionsRef.current;

  useEffect(() => {
    // Executed whenever answer submission for any of the question box changes
    let newData: AnswerSubmissionsType = {
      id: answerSubmission.id,
      chosenAnswer: answerSubmission.chosenAnswer,
      isCorrect: answerSubmission.isCorrect,
    };

    let submissionUpdated = false;

    for (let index = 0; index < answerSubmissions.length; index++) {
      if (answerSubmissions[index].id === answerSubmission.id) {
        answerSubmissions[index] = newData; // Update previous answer submission
        submissionUpdated = true;
        break;
      }
    }
    if (!submissionUpdated) {
      if (
        JSON.stringify(emptyAnswerSubmission) ===
        JSON.stringify(answerSubmissions[0])
      ) {
        answerSubmissions[0] = newData; // Update initial value
      } else {
        answerSubmissions.push(newData); // Add new answer submission
      }
    }
  }, [answerSubmission]);

  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    let count = 0;
    if (
      JSON.stringify(emptyAnswerSubmission) !==
      JSON.stringify(answerSubmissions[0])
    ) {
      answerSubmissions.forEach(() => {
        count++;
      });
    }
    setDoneCount(count);
  }, [answerSubmission]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Calculate score
    let score = 0;
    answerSubmissions.forEach((object) => {
      if (object.isCorrect) {
        score++;
      }
    });
    alert(`Your score is ${score} out of ${questions?.length}`);
    localStorage.removeItem("CREDENTIALS");
    window.location.reload();
  }
  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      {!!questions && (
        <>
          <div className={styles.button_parent}>
            <h2>
              {doneCount} out of {questions.length} done
            </h2>
            <Button text="Submit" />
          </div>
          <div className={styles.questions_container}>
            {questions.map((question, index) => (
              <QuestionBox
                key={index}
                setAnswerSubmission={setAnswerSubmission}
                questionNumber={index + 1}
                questionText={question.questionText}
                answers={question.answers}
                correctAnswer={question.correctAnswer}
              />
            ))}
          </div>
        </>
      )}
    </form>
  );
}

export default Questions;
