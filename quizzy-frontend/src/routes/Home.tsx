import styles from "../styles/Home.module.css";
import Button from "../components/Button";
import MyLink from "../components/MyLink";
import { Link } from "react-router-dom";
import { CSSProperties, useState } from "react";

type ActiveTabType = "take" | "create";

type TabContentType = {
  title: string;
  state: ActiveTabType;
  steps: string[];
  button: {
    name: "Result" | "Info";
    link: "/quiz" | "/info";
  };
};

function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("take");

  const tabContents: TabContentType[] = [
    {
      title: "Taking a quiz",
      state: "take",
      steps: [
        'Click on the "Take" button above.',
        "Enter the ID and Password of the quiz.",
        'Click on "Result" below to view all taken quiz result.',
      ],
      button: {
        name: "Result",
        link: "/quiz",
      },
    },
    {
      title: "Creating a quiz",
      state: "create",
      steps: [
        'Click on the "Create" button above.',
        "Fill up the questions and answers for your quiz.",
        'Click on "Info" below to view all created quiz info.',
      ],
      button: {
        name: "Info",
        link: "/info",
      },
    },
  ];

  const activeTabStyles: CSSProperties = {
    width: "100%",
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.nav_body}>
          <div className={styles.logo}>
            <h1>Quizzy</h1>
          </div>
          <div className={styles.button_parent}>
            <Link to={"/quiz"}>
              <Button text="Take" />
            </Link>
            <Link to={"/register"}>
              <Button text="Sign up" />
            </Link>
          </div>
        </div>
      </nav>
      <div className={styles.body}>
        <div className={styles.tabs}>
          {tabContents.map((tab, index) => (
            <button
              className={styles.tab}
              key={index}
              onClick={() => setActiveTab(tab.state)}
            >
              <div className={styles.tab_title}>{tab.title}</div>
              <div
                className={styles.underline}
                style={tab.state === activeTab ? activeTabStyles : undefined}
              ></div>
            </button>
          ))}
        </div>
        <div className={styles.list}>
          {tabContents[activeTab === "take" ? 0 : 1].steps.map(
            (item, index) => (
              <p key={index} className={styles.item}>
                <span className={styles.item_marker}>{index + 1}</span>
                <span className={styles.item_text}>{item}</span>
              </p>
            )
          )}
        </div>
        <div className={styles.link}>
          <MyLink
            name={tabContents[activeTab === "take" ? 0 : 1].button.name}
            path={tabContents[activeTab === "take" ? 0 : 1].button.link}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
