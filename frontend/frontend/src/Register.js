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
        minHeight: "100vh",
        backgroundImage:
          'url("https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2655.jpg?t=st=1737186275~exp=1737189875~hmac=1401dcd0be4506126c55251d125fac20cf7c3499ce58f8f673b3674892031ea0&w=1480")',
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
              sx={{ borderRadius: 2 }}
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
            Register
          </Button>
        </form>
        <Typography variant="body1" sx={{ mt: 3, textAlign: "center" }}>
          Already have an account?
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleLogin}
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
      </Container>
    </Box>
  );
};

export default Register;
