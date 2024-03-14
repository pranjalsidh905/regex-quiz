import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Admin: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const formStyle = {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    width: "20rem",
  };

  const inputGroupStyle = {
    marginBottom: "1.5rem",
  };

  const labelStyle = {
    display: "block",
    color: "#333",
    fontSize: "0.875rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const submitButtonStyle = {
    width: "100%",
    background: "#3490dc",
    color: "#fff",
    padding: "0.75rem",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  };

  const toggleForm = () => {
    setIsRegistering((prev) => !prev);
    setError(null);
  };

  const handleAdminAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const endpoint = isRegistering ? "/api/admin/register" : "/auth/login";

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        const token = data.token;
        // Save token in localStorage
        localStorage.setItem("accessToken", token);

        // Handle success based on your needs
        console.log(
          isRegistering
            ? "Admin registered successfully"
            : "Admin logged in successfully"
        );

        // Redirect to the admin dashboard after successful registration or login
        navigate("/create");
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error(
        `Error during ${isRegistering ? "admin registration" : "admin login"}:`,
        error
      );
      setError("Internal Server Error");
    }
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleAdminAuth}>
        {isRegistering && (
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="username">
              Username:
            </label>
            <input
              type="text"
              id="username"
              style={inputStyle}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            style={inputStyle}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            style={inputStyle}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegistering && (
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              style={inputStyle}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <button type="submit" style={submitButtonStyle}>
            {isRegistering ? "Register" : "Log In"}
          </button>
        </div>
        <p className="mt-2 text-center">
          {isRegistering
            ? "Already have an admin account?"
            : "Don't have an admin account?"}{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={toggleForm}
          >
            {isRegistering ? "Log In" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Admin;
