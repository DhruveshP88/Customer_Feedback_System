import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";

const UserDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/feedbackform"); // Navigate to the feedback form page
  };

  useEffect(() => {
    const fetchUserFeedback = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/feedback/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFeedbacks(response.data);
      } catch (err) {
        setError("Error fetching feedback. Please try again.");
        console.error("Error fetching user feedback:", err);
      }
    };

    fetchUserFeedback();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 800,
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
        User Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Feedbacks
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <List>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <ListItem key={feedback.id}>
              <ListItemText
                primary={`Feedback Type: ${feedback.feedback_type}`}
                secondary={`Comments: ${feedback.comments}`}
              />
              <Divider />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">No feedback available.</Typography>
        )}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        sx={{ mt: 3 }}
      >
        Submit a Feedback
      </Button>
    </Box>
  );
};

export default UserDashboard;
