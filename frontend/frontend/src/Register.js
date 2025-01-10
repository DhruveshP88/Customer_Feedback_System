import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username,
        email,
        password
      });

      // Handle success (e.g., redirect to login page)
      setMessage("Registration successful! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      // Handle errors
      setError("Error registering. Please try again.");
    }
  };

  return (
    <div className="register-form">
      <h1>Customer Feedback System</h1>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <h2>Already have an account ?</h2>
      <button onClick={handleLogin}>Click Here !</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;
