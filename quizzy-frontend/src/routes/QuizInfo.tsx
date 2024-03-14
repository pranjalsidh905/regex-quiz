import styles from "../styles/QuizInfo.module.css";
import MyLink from "../components/MyLink";
import { useEffect, useState } from "react";
import type { ResponseDataType } from "../index.d.ts";
import AllUser from "./AllUser.tsx";

function QuizInfo() {
  const [quizInfo, setQuizInfo] = useState<ResponseDataType[]>([]);

  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/allquiz/all-quiz");
        const data = await response.json();
        console.log(data);
        setQuizInfo(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        // Handle error, e.g., set an error state or redirect to an error page
      }
    };

    fetchQuizInfo();
  }, []);

  // if (!quizInfo.length) {
  //   // Redirect or handle the case where quizInfo is empty
  //   window.location.href = "/";
  // }

  return (
    // <div className={styles.container}>
    //   {!!quizInfo && (
    //     <>
    //       <h2 className={styles.info_title}>Created quizzes</h2>
    //       <div className={styles.boxes}>
    //         {quizInfo.map((object, index) => (
    //           <div className={styles.text_parent} key={index}>
    //             <div className={styles.text}>
    //               <p>ID:</p>
    //               <span>{object.id}</span>
    //             </div>
    //             <div className={styles.text}>
    //               <p>Password:</p>
    //               <span>{object.password}</span>
    //             </div>
    //             <div className={styles.text}>
    //               <p>Created:</p>
    //               <span>{object.createdAt}</span>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //       <MyLink path="/" name="Back to home" />
    //     </>
    //   )}
    // </div>
    <div className={styles.container}>
      {!!quizInfo && (
        <>
          <h2 className={styles.info_title}>Created quizzes</h2>
          <table className={styles.table} border={2}>
            <thead>
              <tr>
                {/* <th>Created By</th>
                <th>Quiz Name</th> */}
                <th>Quiz ID</th>
                <th>Quiz Password</th>
                <th>Creation Date</th>
              </tr>
            </thead>
            <tbody>
              {quizInfo.map((object, index) => (
                <tr key={index}>
                  {/* <td>{object.name || "Mohit"}</td>
                  <td>{object.name || "Html"}</td> */}
                  <td>{object.id}</td>
                  <td>{object.password}</td>
                  <td>{object.created}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <AllUser />
          </div>

          <MyLink path="/" name="Back to home" />
        </>
      )}
    </div>
  );
}

export default QuizInfo;
