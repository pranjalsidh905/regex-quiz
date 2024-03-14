import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import styles from "../styles/JoinForm.module.css";
import Button from "./Button";
import axios from "axios";
import { API_URL } from "../config/api";
import type { QuizCredentialsType } from "../index.d.ts";

type JoinFormProps = {
  setCredentials: Dispatch<SetStateAction<QuizCredentialsType>>;
};

function JoinForm(props: JoinFormProps) {
  const { setCredentials } = props;

  const API = API_URL + "quiz/credentials";

  const [loading, setLoading] = useState(false);

  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleJoinForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    if (idRef.current && passwordRef.current) {
      const credentials = {
        id: idRef.current.value,
        password: passwordRef.current.value,
      };

      axios
        .post(API, credentials)
        .then((res) => {
          // Update the state in parent component
          setCredentials({
            id: res.data.id,
            password: res.data.password,
          });
          setLoading(false);
        })
        .catch((err) => {
          alert(err.response.data);
          setLoading(false);
        });
    }
  }

  return (
    <form className={styles.join_form} onSubmit={handleJoinForm}>
      <input type="text" placeholder="Enter the ID..." required ref={idRef} />
      <input
        type="password"
        placeholder="Enter the Password..."
        required
        ref={passwordRef}
      />
      <Button text={loading ? "SyncLoader" : "Join"} />
    </form>
  );
}

export default JoinForm;
