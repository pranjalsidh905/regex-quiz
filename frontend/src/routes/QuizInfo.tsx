import styles from "../styles/QuizInfo.module.css";
import MyLink from "../components/MyLink";
import type { ResponseDataType } from "../index.d.ts";

function QuizInfo() {
  const quizInfoString = localStorage.getItem("QUIZ_INFO");

  const quizInfo: ResponseDataType[] = quizInfoString
    ? JSON.parse(quizInfoString)
    : null;

  if (quizInfo === null) {
    window.location.href = "/";
  }

  return (
    <div className={styles.container}>
      {!!quizInfo && (
        <>
          <h2 className={styles.info_title}>Created quizzes</h2>
          <div className={styles.boxes}>
            {quizInfo.map((object, index) => (
              <div className={styles.text_parent} key={index}>
                <div className={styles.text}>
                  <p>ID:</p>
                  <span>{object.id}</span>
                </div>
                <div className={styles.text}>
                  <p>Password:</p>
                  <span>{object.password}</span>
                </div>
                <div className={styles.text}>
                  <p>Created:</p>
                  <span>{object.created}</span>
                </div>
              </div>
            ))}
          </div>
          <MyLink path="/" name="Back to home" />
        </>
      )}
    </div>
  );
}

export default QuizInfo;
