import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem("token"); // Get the token from local storage

      if (!token) {
        setError("No token found, please log in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch user data to get the role
        const userResponse = await axios.get(
          "http://localhost:8000/api/user/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );

        const userRole = userResponse.data.role; // Assuming role is in the response

        // Check if the role is admin
        if (userRole !== "admin") {
          navigate("/unauthorized"); // Redirect unauthorized users
          return;
        }

        // Fetch feedbacks if the role is admin
        const feedbackResponse = await axios.get(
          "http://localhost:8000/api/feedback/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );

        setFeedbacks(feedbackResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching feedbacks.");
        setLoading(false);
        console.error("Error fetching feedbacks:", err);
      }
    };

    fetchFeedbacks();
  }, [navigate]); // Add navigate as a dependency

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
      <ul>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
              <li key={feedback.id}>
              <strong>User:</strong>{feedback.user}<br />
              <strong>Name:</strong> {feedback.name} <br />
              <strong>Email:</strong> {feedback.email} <br />
              <strong>Feedback Type:</strong> {feedback.feedback_type} <br />
              <strong>Comments:</strong> {feedback.comments} <br />
              <strong>Sentiment:</strong>{" "}
              {feedback.sentiment ? feedback.sentiment : "Not analyzed"} <br />
              <hr />
            </li>
          ))
        ) : (
          <p>No feedback available.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;
