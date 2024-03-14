import { useEffect, useState } from "react";
import JoinForm from "../components/JoinForm";
import styles from "../styles/Quiz.module.css";
import Questions from "../components/Questions";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import { API_URL } from "../config/api";
import type { QuizCredentialsType, QuestionItemType } from "../index.d.ts";

function Quiz() {
  const API = API_URL + "quiz/questions";

  // After user submits the form in JoinForm component, server validates the input and returns it if valid which will be stored in this state
  const [credentials, setCredentials] = useState<QuizCredentialsType>({
    id: "",
    password: "",
  });

  const [questions, setQuestions] = useState<QuestionItemType[]>(); // Used to store questions array fetched from server

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (credentials.id !== "" && credentials.password !== "") {
      // When credentials state changes, its value will be saved to localStorage
      localStorage.setItem("CREDENTIALS", JSON.stringify(credentials));

      // Fetch credentials from localStorage and hit server to get questions array
      const credentialsString = localStorage.getItem("CREDENTIALS");
      const credentialsObject: QuizCredentialsType = credentialsString
        ? JSON.parse(credentialsString)
        : undefined;
      if (credentialsObject) {
        setLoading(true);
        axios
          .post(API, {
            id: credentialsObject.id,
            password: credentialsObject.password,
          })
          .then((res) => {
            const questions: QuestionItemType[] = res.data;
            setQuestions(questions);
          })
          .catch((err) => {
            alert(err.response.data);
            localStorage.removeItem("CREDENTIALS");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [credentials]);

  useEffect(() => {
    // Executed on page load to fetch credentials from localStorage to state
    const credentialsString = localStorage.getItem("CREDENTIALS");
    const credentialsObject: QuizCredentialsType = credentialsString
      ? JSON.parse(credentialsString)
      : undefined;
    if (credentialsObject) {
      if (credentials.id === "" && credentials.password === "") {
        setCredentials({
          id: credentialsObject.id,
          password: credentialsObject.password,
        });
      }
    }
  }, []);

  return (
    <div>
      {credentials.id === "" || credentials.password === "" ? (
        <div className={styles.join_form}>
          <JoinForm setCredentials={setCredentials} />
        </div>
      ) : loading ? (
        <div className={styles.loading}>
          <MoonLoader color="#fb7185" size={200} />
        </div>
      ) : (
        <div className={styles.questions}>
          {!!questions && <Questions questions={questions} />}
        </div>
      )}
    </div>
  );
}

export default Quiz;
