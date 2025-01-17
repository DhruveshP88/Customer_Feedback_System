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
  Grid,
  Divider,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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
      }}
    >
      {/* Navigation Bar */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate("/user-management")}
            sx={{ mr: 2 }}
          >
            Manage Users
          </Button>
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
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Negative Feedback Alerts */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 3, p: 2, border: "1px solid red", borderRadius: 2 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Negative Feedback Alerts
          </Typography>
          <ul>
            {alerts.map((alert) => (
              <li key={alert.id}>
                <Typography variant="body2">
                  <strong>Name:</strong> {alert.name} <br />
                  <strong>Email:</strong> {alert.email} <br />
                  <strong>Comments:</strong> {alert.comments} <br />
                  <strong>Sentiment:</strong>{" "}
                  <span style={{ color: "red" }}>{alert.sentiment}</span>
                </Typography>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => handleDismissAlert(alert.id)}
                >
                  Dismiss
                </Button>
              </li>
            ))}
          </ul>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{feedback.user}</TableCell>
                  <TableCell>{feedback.name}</TableCell>
                  <TableCell>{feedback.email}</TableCell>
                  <TableCell>{feedback.feedback_type}</TableCell>
                  <TableCell>{feedback.comments}</TableCell>
                  <TableCell>{feedback.sentiment || "Not analyzed"}</TableCell>
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
                backgroundColor: currentPage === page + 1 ? "#1976d2" : "#fff",
                color: currentPage === page + 1 ? "#fff" : "#000",
              }}
            >
              {page + 1}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;
