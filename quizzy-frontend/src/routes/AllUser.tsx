import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AllUser.module.css";

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  quizScores: { score: number; _id: string }[];
}

function AllUser(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        // Make a GET request to fetch users from the /users endpoint
        const response = await axios.get<User[]>(
          "http://localhost:5000/auth/users"
        ); // Replace with your server address

        // Update the state with the fetched users
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Call the fetchUsers function
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.info_title}>All user</h2>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>isAdmin</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Quiz Scores</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Yes" : "No"}</td>
              <td>{user.createdAt}</td>
              <td>{user.updatedAt}</td>
              <td>
                <ul>
                  {user.quizScores.map((quizScore) => (
                    <li key={quizScore._id}>Score: {quizScore.score}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllUser;
