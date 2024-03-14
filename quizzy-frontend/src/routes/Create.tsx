import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import QuestionForm from "../components/QuestionForm";
import styles from "../styles/Create.module.css";
import Button from "../components/Button";
import type { QuestionItemType } from "../index.d.ts";
import type { ResponseDataType } from "../index.d.ts";
import QuizUploader from "../components/QuizUploader.tsx";

function Create() {
  const API = API_URL + "create";

  const [saving, setSaving] = useState(false); // Used to show spinner instead of usual text in Submit quiz button

  const [questionNumber, setQuestionNumber] = useState(1); // Used to add another QuestionForm in the page

  // Create an empty object that will be set to initial questionItem state
  const emptyQuestionItem: QuestionItemType = {
    id: null,
    questionText: "",
    answers: ["", "", "", ""],
    correctAnswer: null,
  };

  const [questionItem, setQuestionItem] =
    useState<QuestionItemType>(emptyQuestionItem);

  const questionItemArrayRef = useRef<QuestionItemType[]>([emptyQuestionItem]);

  useEffect(() => {
    const questionItemArray = questionItemArrayRef.current;
    let itemUpdated = false;
    if (questionItem.id) {
      for (let index = 0; index < questionItemArray.length; index++) {
        if (questionItemArray[index].id === questionItem.id) {
          questionItemArray[index] = questionItem; // Update previous object
          itemUpdated = true;
          break;
        }
      }
      if (!itemUpdated) {
        if (
          JSON.stringify(questionItemArray[0]) ===
          JSON.stringify(emptyQuestionItem)
        ) {
          questionItemArray[0] = questionItem; // Update initial object
        } else {
          // If no object was updated previously, push the object to array
          questionItemArray.push(questionItem);
        }
      }
    }
  }, [questionItem]);

  function addQuestion() {
    setQuestionNumber((prev) => prev + 1);
  }

  function handleSubmitQuiz() {
    setSaving(true);

    axios
      .post(API, questionItemArrayRef.current)
      .then((res) => {
        const newData: ResponseDataType = res.data;
        saveQuizInfo(newData);
        setSaving(false);
        window.location.href = "/info";
      })
      .catch((err) => {
        setSaving(false);
        alert(err.response.data);
      });
  }

  function saveQuizInfo(newData: ResponseDataType) {
    // Get previously saved data from localStorage
    const previousQuizInfoString = localStorage.getItem("QUIZ_INFO");
    const previousQuizInfo: ResponseDataType[] = previousQuizInfoString
      ? JSON.parse(previousQuizInfoString)
      : null;

    // Merge the new array of data with previous one
    const newQuizInfo = previousQuizInfo ? [...previousQuizInfo] : [];
    newQuizInfo.push(newData);

    // Save to localStorage
    localStorage.setItem("QUIZ_INFO", JSON.stringify(newQuizInfo));
  }

  return (
    <div className={styles.container}>
      <div className={styles.questions}>
        <QuizUploader/>
        {Array.from({ length: questionNumber }).map((_, index) => (
          <QuestionForm
            key={index}
            questionNumber={index + 1}
            setQuestionItem={setQuestionItem}
            emptyQuestionItem={emptyQuestionItem}
          />
        ))}
        <div className={styles.separator}></div>
        <div className={styles.button_parent}>
          <Button text="Add question" action={addQuestion} />
          <Button
            text={saving ? "SyncLoader" : "Submit quiz"}
            action={handleSubmitQuiz}
          />
        </div>
      </div>
    </div>
  );
}

export default Create;
