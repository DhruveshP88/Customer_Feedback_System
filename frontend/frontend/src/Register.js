import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { AccountCircle, Email, Lock } from "@mui/icons-material";

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
        password,
      });

      setMessage("Registration successful! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Error registering. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Customer Feedback System
      </Typography>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AccountCircle sx={{ mr: 1, color: "gray" }} />
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Email sx={{ mr: 1, color: "gray" }} />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Lock sx={{ mr: 1, color: "gray" }} />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
      <Typography variant="body1" sx={{ mt: 3 }}>
        Already have an account?
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        onClick={handleLogin}
        sx={{ mt: 1 }}
      >
        Click Here!
      </Button>
      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Register;
