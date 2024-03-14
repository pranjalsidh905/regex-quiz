// App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import styles from "./styles/App.module.css";
import Create from "./routes/Create";
import QuizInfo from "./routes/QuizInfo";

import Quiz from "./routes/Quiz";

// import Admin from "./routes/Admin";
// import Login from "./routes/Login";

function App() {
  return (
    <div className={styles.wrapper}>
      <Routes>
        <Route element={<Home />} path={"/"} />
        <Route element={<Quiz />} path={"/quiz"} />
        <Route element={<Create />} path={"/create"} />
        <Route element={<QuizInfo />} path={"/info"} />

        {/* <Route element={<Login/>} path={"/login"} /> */}
        {/* <Route element={<Admin />} path={"/admin/register"} /> */}
      </Routes>
    </div>
  );
}

export default App;
