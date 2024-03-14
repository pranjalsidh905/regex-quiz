import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "../styles/Questions.module.css";
import QuestionBox from "./QuestionBox";
import Button from "./Button.tsx";
import type { AnswerSubmissionsType, QuestionItemType } from "../index.d.ts";

type QuestionsProps = {
  questions: QuestionItemType[];
  quizId: string;
};

function Questions({ questions, quizId }: QuestionsProps) {
  const emptyAnswerSubmission: AnswerSubmissionsType = {
    id: null,
    chosenAnswer: null,
    isCorrect: null,
  };

  const [answerSubmission, setAnswerSubmission] =
    useState<AnswerSubmissionsType>(emptyAnswerSubmission);

  const answerSubmissionsRef = useRef<AnswerSubmissionsType[]>([
    emptyAnswerSubmission,
  ]);

  const answerSubmissions = answerSubmissionsRef.current;

  useEffect(() => {
    let newData: AnswerSubmissionsType = {
      id: answerSubmission.id,
      chosenAnswer: answerSubmission.chosenAnswer,
      isCorrect: answerSubmission.isCorrect,
    };

    let submissionUpdated = false;

    for (let index = 0; index < answerSubmissions.length; index++) {
      if (answerSubmissions[index].id === answerSubmission.id) {
        answerSubmissions[index] = newData;
        submissionUpdated = true;
        break;
      }
    }
    if (!submissionUpdated) {
      if (
        JSON.stringify(emptyAnswerSubmission) ===
        JSON.stringify(answerSubmissions[0])
      ) {
        answerSubmissions[0] = newData;
      } else {
        answerSubmissions.push(newData);
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

    const userId = localStorage.getItem("CREDENTIALS");
    // Ensure userId is a string
    if (typeof userId !== "string" || !userId) {
      console.error("Error: userId is not a string");
      return;
    }

    if (
      !userId ||
      !quizId ||
      typeof userId !== "string" ||
      typeof quizId !== "string"
    ) {
      console.error("Error: userId and quizId are required");
      return;
    }
    console.log("userId:", userId, "quizId:", quizId);

    let score = 0;
    answerSubmissions.forEach((object) => {
      if (object.isCorrect) {
        score++;
      }
    });

    console.log(
      "Making API request with userId:",
      userId,
      "quizId:",
      quizId,
      "score:",
      score
    );
    fetch("http://localhost:5000/result/quiz-results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        quizId: quizId,
        score: score,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Quiz submitted successfully!");
          localStorage.removeItem("CREDENTIALS");
          window.location.reload();
        } else {
          alert("Failed to submit quiz.");
        }
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error);
        alert("An error occurred while submitting the quiz.");
      });
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
