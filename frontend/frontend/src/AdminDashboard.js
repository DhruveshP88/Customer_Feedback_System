import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SentimentChart from "./sentimentchart";
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
} from "@mui/material";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found, please log in.");
        setLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(
          "http://localhost:8000/api/user/",
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

        setFeedbacks(feedbackResponse.data);
        setFilteredFeedbacks(feedbackResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching feedbacks.");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  useEffect(() => {
    const filtered = feedbacks.filter(
      (feedback) =>
        feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.feedback_type
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        feedback.comments.toLowerCase().includes(searchQuery.toLowerCase())
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
    // Clear the token from localStorage
    localStorage.removeItem("token");
    // Redirect to the login page
    navigate("/login");
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
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        All Feedbacks
      </Typography>

      {/* Logout Button */}
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{ mb: 3 }}
      >
        Logout
      </Button>

      {/* Search bar */}
      <TextField
        label="Search Feedbacks"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Feedbacks table */}
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

      <SentimentChart />

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
