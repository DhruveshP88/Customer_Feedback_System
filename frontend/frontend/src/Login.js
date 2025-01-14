import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


    const handleRegister = async (e) => {
      e.preventDefault();
      navigate("/");
    };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
      });

      // Store the JWT token in local storage
      localStorage.setItem("token", response.data.token);

      // Redirect based on the role
      const role = response.data.role;
      if (role === "admin") {
        navigate("/admin-dashboard"); // Admin dashboard
      } else if (role === "staff") {
        navigate("/user-dashboard"); // User dashboard
      } else {
        navigate("/dashboard"); // Default dashboard if role is unknown
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
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
        Login
      </Typography>
      <form onSubmit={handleLogin}>
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
          Login
        </Button>
      </form>
      <Typography variant="body1" sx={{ mt: 3 }}>
          Don't have an Account ? 
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        onClick={handleRegister}
        sx={{ mt: 1 }}
      >
        Click Here!
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Login;
