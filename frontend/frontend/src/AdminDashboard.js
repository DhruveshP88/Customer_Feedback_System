import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Items per page
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

  // Search feedbacks
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
    setCurrentPage(1); // Reset to the first page on search
  }, [searchQuery, feedbacks]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>All Feedbacks</h3>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search feedbacks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px", width: "100%" }}
      />

      {/* Feedbacks table */}
      {currentItems.length > 0 ? (
        <table border="1" width="100%" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Name</th>
              <th>Email</th>
              <th>Feedback Type</th>
              <th>Comments</th>
              <th>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.user}</td>
                <td>{feedback.name}</td>
                <td>{feedback.email}</td>
                <td>{feedback.feedback_type}</td>
                <td>{feedback.comments}</td>
                <td>{feedback.sentiment || "Not analyzed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No feedback available.</p>
      )}

      {/* Pagination */}
      {filteredFeedbacks.length > itemsPerPage && (
        <div style={{ marginTop: "20px" }}>
          {[
            ...Array(Math.ceil(filteredFeedbacks.length / itemsPerPage)).keys(),
          ].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                backgroundColor: currentPage === page + 1 ? "#007bff" : "#fff",
                color: currentPage === page + 1 ? "#fff" : "#000",
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              {page + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
