import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  InputAdornment,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Search, AccountCircle, ExitToApp, Delete } from "@mui/icons-material";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found, please log in.");
        setLoading(false);
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

        if (userResponse.data.role !== "admin") {
          navigate("/unauthorized");
          return;
        }

        const feedbackResponse = await axios.get(
          "http://localhost:8000/api/feedback/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const alertResponse = await axios.get(
          "http://localhost:8000/api/negative-feedback-alerts/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFeedbacks(feedbackResponse.data);
        setFilteredFeedbacks(feedbackResponse.data);
        setAlerts(alertResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const filtered = feedbacks.filter(
      (feedback) =>
        feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.feedback_type
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        feedback.comments.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.sentiment.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  }, [searchQuery, feedbacks]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDismissAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const handleDeleteFeedback = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found, please log in.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8000/api/feedback/${feedbackToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the deleted feedback from the state
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((feedback) => feedback.id !== feedbackToDelete.id)
      );
      setFilteredFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((feedback) => feedback.id !== feedbackToDelete.id)
      );
      setOpenDeleteDialog(false); // Close the dialog after deletion
    } catch (err) {
      setError("Error deleting feedback.");
    }
  };

  const openDeleteConfirmation = (feedback) => {
    setFeedbackToDelete(feedback);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteDialog(false);
    setFeedbackToDelete(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #42a5f5, #66bb6a)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 5,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f5f5f5",
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
      }}
    >
      {/* Navigation Bar */}
      <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => navigate("/user-management")}
            sx={{ mr: 2 }}
          >
            <AccountCircle />
          </IconButton>
          <TextField
            label="Search Feedbacks"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mr: 2,
              backgroundColor: "white",
              borderRadius: 1,
              width: 250,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            component="button"
            variant="body2"
            onClick={() => navigate("/sentiment-chart")}
            sx={{
              textDecoration: "none",
              color: "white",
              ml: 2,
            }}
          >
            Visualization
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

      {/* Negative Feedback Alerts */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#d32f2f",
              display: "flex",
              alignItems: "center",
              mb: 2,
              animation: "blink 1s infinite",
              "@keyframes blink": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.5 },
                "100%": { opacity: 1 },
              },
            }}
          >
            <Alert
              severity="error"
              icon={false}
              sx={{ fontSize: "inherit", py: 0 }}
            >
              Negative Feedback Alerts !!!!
            </Alert>
          </Typography>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              severity="error"
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                p: 2,
                border: "2px solid #d32f2f",
              }}
              icon={<AccountCircle />}
              action={
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => handleDismissAlert(alert.id)}
                >
                  Dismiss
                </Button>
              }
            >
              <Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {alert.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {alert.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Comments:</strong> {alert.comments}
                </Typography>
                <Typography variant="body2" sx={{ color: "#d32f2f" }}>
                  <strong>Sentiment:</strong> {alert.sentiment}
                </Typography>
              </Box>
            </Alert>
          ))}
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Feedbacks Table */}
      {currentItems.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>User</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Feedback Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Comments</strong>
                </TableCell>
                <TableCell>
                  <strong>Sentiment</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((feedback) => (
                <TableRow
                  key={feedback.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell>{feedback.user}</TableCell>
                  <TableCell>{feedback.name}</TableCell>
                  <TableCell>{feedback.email}</TableCell>
                  <TableCell>{feedback.feedback_type}</TableCell>
                  <TableCell>{feedback.comments}</TableCell>
                  <TableCell>{feedback.sentiment || "Not analyzed"}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => openDeleteConfirmation(feedback)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No feedback available.</Typography>
      )}

      {/* Pagination */}
      {filteredFeedbacks.length > itemsPerPage && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          {[
            ...Array(Math.ceil(filteredFeedbacks.length / itemsPerPage)).keys(),
          ].map((page) => (
            <Button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              variant="outlined"
              sx={{
                mx: 0.5,
                backgroundColor: currentPage === page + 1 ? "#1976d2" : "white",
                color: currentPage === page + 1 ? "white" : "black",
              }}
            >
              {page + 1}
            </Button>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={closeDeleteConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this feedback?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteFeedback} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
