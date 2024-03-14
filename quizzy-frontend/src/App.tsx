import { Routes, Route } from "react-router-dom";
import Quiz from "./routes/Quiz";
import Home from "./routes/Home";
import styles from "./styles/App.module.css";
import Create from "./routes/Create";
import QuizInfo from "./routes/QuizInfo";
import Register from "./routes/Register";
// import LoginForm from "./routes/Login";
import Admin from "./routes/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import MiniDrawer from "./routes/Dashbord";

function App() {
  return (
    <div className={styles.wrapper}>
      <Routes>
        <Route element={<Home />} path={"/"} />
        <Route
          path="/quiz"
          element={<ProtectedRoute Component={Quiz} redirectPath="/register" />}
        />

        {/* <Route element={<Quiz />} path={"/quiz"} /> */}
        <Route element={<Create />} path={"/create"} />
        <Route element={<QuizInfo />} path={"/info"} />
        <Route element={<Register />} path={"/register"} />
        {/* <Route element={<LoginForm />} path={"/login"} /> */}

        <Route element={<Admin />} path={"/admin/register"} />
        <Route element={<MiniDrawer />} path={"/dashbord"} />
        
      </Routes>
    </div>
  );
}

export default App;
