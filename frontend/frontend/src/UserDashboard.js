import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Feedback, ExitToApp, Search } from "@mui/icons-material";

const UserDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmitFeedback = () => {
    navigate("/feedbackform"); // Navigate to the feedback form page
  };

  const handleLogout = () => {
    // Remove the token and role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Redirect to the login page
    navigate("/login");
  };

  useEffect(() => {
    const verifyUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token is found
        return;
      }

      try {
        const userResponse = await axios.get(
          "http://localhost:8000/api/user-detail/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userResponse.data.role !== "staff") {
          navigate("/unauthorized"); // Redirect to unauthorized page if role is not admin
          return;
        }
      } catch (err) {
        setError("Error fetching user data.");
        console.error("Error verifying user role:", err);
      }
    };
    verifyUserRole();
  }, [navigate]);

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

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.feedback_type
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      feedback.comments.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={handleSubmitFeedback}
            startIcon={<Feedback />}
          >
            Submit Feedback
          </Button>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ ml: 2 }}
            startIcon={<ExitToApp />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: 5,
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#f5f5f5",
          background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>

        <TextField
          label="Search Feedback"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 3,
            width: "100%",
            backgroundColor: "white",
            borderRadius: 1,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" gutterBottom>
          Your Feedbacks
        </Typography>

        <List>
          {filteredFeedbacks.length > 0 ? (
            filteredFeedbacks.map((feedback) => (
              <ListItem key={feedback.id} sx={{ mb: 2 }}>
                <Card
                  sx={{
                    width: "100%",
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <ListItemText
                      primary={`Feedback Type: ${feedback.feedback_type}`}
                      secondary={`Comments: ${feedback.comments}`}
                    />
                    <Divider />
                  </CardContent>
                </Card>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1">No feedback available.</Typography>
          )}
        </List>
      </Box>
    </>
  );
};

export default UserDashboard;
