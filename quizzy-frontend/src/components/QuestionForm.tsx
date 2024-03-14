import {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";
import Button from "./Button";
import styles from "../styles/QuestionForm.module.css";
import type { QuestionItemType } from "../index.d.ts";

type QuestionFormProps = {
  questionNumber: number;
  setQuestionItem: Dispatch<SetStateAction<QuestionItemType>>;
  emptyQuestionItem: QuestionItemType;
};

type actionType = "Save" | "Update" | "FaCheck";

function QuestionForm(props: QuestionFormProps) {
  const { questionNumber, setQuestionItem, emptyQuestionItem } = props;

  const [action, setAction] = useState<actionType>("Save");

  const questionRef = useRef(""); // Used to store question text
  const choiceRef = useRef(0); // Used to store correct choice number
  const answersRef = useRef(["", "", "", ""]); // Used to store the four answer choices

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent reload

    // Set questionItem state to an empty object
    const questionItem = emptyQuestionItem;

    questionItem.id = questionNumber;
    questionItem.questionText = questionRef.current;
    questionItem.answers = answersRef.current;
    questionItem.correctAnswer = choiceRef.current + 1;
    setQuestionItem(questionItem);

    setAction("FaCheck"); // Let user know that the input data was saved
  }

  function handleQuestionInput(event: ChangeEvent<HTMLInputElement>) {
    // Get current updated input value and set it to ref
    const inputValue = event.target.value;
    questionRef.current = inputValue;

    changeAction();
  }

  function handleRadioInput(event: ChangeEvent<HTMLInputElement>) {
    // Get current updated input value and set it to ref
    const inputValue = parseInt(event.target.value);
    choiceRef.current = inputValue;

    changeAction();
  }

  function handleAnswerInput(
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    // Get current updated input value and its index
    const inputValue = event.target.value;
    answersRef.current[index] = inputValue; // Update the value in the ref at given index

    changeAction();
  }

  function changeAction() {
    if (action === "FaCheck") {
      setAction("Update"); // Let user know that the input data was updated and needs to be saved again
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.input_parent}>
        <div className={styles.question}>
          <h2 className={styles.title}>Question number: {questionNumber}</h2>
          <input
            onChange={handleQuestionInput}
            type="text"
            className={styles.input}
            placeholder="Question text goes here..."
            required
          />
        </div>
        <div className={styles.answers_parent}>
          <h2 className={styles.title}>Answer choices:</h2>
          <div className={styles.answers}>
            {Array.from({ length: 4 }).map((_, index) => {
              return (
                <div className={styles.answer} key={index}>
                  <input
                    type="radio"
                    name={`question${questionNumber}`}
                    onChange={handleRadioInput}
                    value={index}
                    required
                  />
                  <input
                    className={styles.input}
                    id={`answer${index}`}
                    type="text"
                    placeholder="Add answer choice..."
                    onChange={(event) => handleAnswerInput(event, index)}
                    required
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.button_parent}>
        <Button text={action} />
      </div>
    </form>
  );
}

export default QuestionForm;
