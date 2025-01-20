import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Feedback,
  ExitToApp,
  Search,
  AddComment,
  Edit,
  Delete,
} from "@mui/icons-material";

const UserDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("");
  const [comments, setComments] = useState("");
  const [userData, setUserData] = useState({ email: "" });
  const [name, setName] = useState("");
  const [editingFeedback, setEditingFeedback] = useState(null); // Track feedback being edited

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user-detail/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData({ email: response.data.email });
    } catch (err) {
      setError("Error fetching user data.");
    }
  };

  const fetchFeedbacks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8000/api/feedback/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(response.data);
    } catch (err) {
      setError("Error fetching feedbacks.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleSubmitFeedback = async () => {
    const token = localStorage.getItem("token");
    try {
      if (editingFeedback) {
        // Update existing feedback
        await axios.put(
          `http://localhost:8000/api/feedback/${editingFeedback.id}/`,
          {
            user: userData.id,
            name,
            email: userData.email,
            feedback_type: feedbackType,
            comments,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Create new feedback
        await axios.post(
          "http://localhost:8000/api/feedback/",
          {
            user: userData.id,
            name,
            email: userData.email,
            feedback_type: feedbackType,
            comments,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setFeedbackDialogOpen(false);
      fetchFeedbacks();
      setEditingFeedback(null); // Reset editing state
    } catch (err) {
      setError("Error submitting feedback.");
    }
  };

  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
    setName(feedback.name);
    setFeedbackType(feedback.feedback_type);
    setComments(feedback.comments);
    setFeedbackDialogOpen(true);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/feedback/${feedbackId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeedbacks(); // Refresh feedback list
    } catch (err) {
      setError("Error deleting feedback.");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchFeedbacks();
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
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              setEditingFeedback(null); // Reset editing state
              setFeedbackDialogOpen(true);
            }}
            startIcon={<AddComment />}
          >
            Submit Feedback
          </Button>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToApp />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {userData.email}
        </Typography>

        <TextField
          label="Search Feedback"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Typography variant="h6" gutterBottom>
          Your Feedbacks
        </Typography>

        <List>
          {filteredFeedbacks.length > 0 ? (
            filteredFeedbacks.map((feedback) => (
              <ListItem key={feedback.id}>
                <Card sx={{ width: "100%" }}>
                  <CardContent>
                    <ListItemText
                      primary={`Type: ${feedback.feedback_type}`}
                      secondary={`Comments: ${feedback.comments}`}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton
                        onClick={() => handleEditFeedback(feedback)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteFeedback(feedback.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))
          ) : (
            <Typography>No feedback available.</Typography>
          )}
        </List>
      </Box>

      {/* Feedback Form Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
      >
        <DialogTitle>
          {editingFeedback ? "Edit Feedback" : "Submit Feedback"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={userData.email}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="feedback-type-label">Feedback Type</InputLabel>
            <Select
              labelId="feedback-type-label"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <MenuItem value="Product">Product</MenuItem>
              <MenuItem value="Service">Service</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitFeedback}>
            {editingFeedback ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDashboard;
