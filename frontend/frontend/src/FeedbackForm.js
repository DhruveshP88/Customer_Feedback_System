import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if token is missing
      return;
    }

    // Verify user role
    axios
      .get("http://localhost:8000/api/user-detail/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.role !== "staff") {
          navigate("/unauthorized"); // Redirect unauthorized users
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirect to login on error
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      // Get the user ID from the authenticated user
      const userResponse = await axios.get(
        "http://localhost:8000/api/user-detail/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userId = userResponse.data.id; // Assuming the user object has an 'id' field

      // Send the feedback data along with the user ID
      const response = await axios.post(
        "http://localhost:8000/api/feedback/",
        {
          user: userId, // Ensure user is passed as a single ID, not an array
          name,
          email,
          feedback_type: feedbackType,
          comments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request
          },
        }
      );

      setMessage("Feedback submitted successfully!");
      setName("");
      setEmail("");
      setFeedbackType("");
      setComments("");

      // Redirect to the user dashboard after successful feedback submission
      navigate("/user-dashboard"); // Replace with the actual user dashboard route
    } catch (error) {
      setMessage("Error submitting feedback.");
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Submit Feedback
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Your Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Your Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Feedback Type</InputLabel>
          <Select
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            required
          >
            <MenuItem value="product">Product</MenuItem>
            <MenuItem value="service">Service</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Your Comments"
          variant="outlined"
          multiline
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mb: 2 }}
        >
          Submit
        </Button>
      </form>
      {message && <Alert severity="success">{message}</Alert>}
    </Box>
  );
};

export default FeedbackForm;
