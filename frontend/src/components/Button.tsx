import { FaCheck } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import styles from "../styles/Button.module.css";

type ButtonProps = { text: string; action?: () => void };

function Button(props: ButtonProps) {
  const { text, action } = props;
  return (
    <div className={styles.button_parent} onClick={action}>
      <button
        className={styles.button}
        disabled={text === "FaCheck" ? true : false}
      >
        {text === "FaCheck" ? (
          <FaCheck />
        ) : text === "SyncLoader" ? (
          <SyncLoader color="#f0f0f0" />
        ) : (
          text
        )}
      </button>
    </div>
  );
}

export default Button;
