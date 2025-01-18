import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Container,
} from "@mui/material";
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
        minHeight: "100vh",
        backgroundImage:
          'url("https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2655.jpg?t=st=1737186275~exp=1737189875~hmac=1401dcd0be4506126c55251d125fac20cf7c3499ce58f8f673b3674892031ea0&w=1480")', // Replace with your image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 3,
          padding: 4,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Customer Feedback System
        </Typography>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: "#1976d2" }}
        >
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
              sx={{ borderRadius: 2 }}
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
              sx={{ borderRadius: 2 }}
            />
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              mt: 2,
              padding: "10px",
              fontSize: "16px",
              borderRadius: 3,
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body1" sx={{ mt: 3, textAlign: "center" }}>
          Don't have an account?
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleRegister}
          sx={{
            mt: 1,
            padding: "10px",
            fontSize: "16px",
            borderRadius: 3,
            "&:hover": { backgroundColor: "#ff4081" },
          }}
        >
          Click Here!
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default Login;
