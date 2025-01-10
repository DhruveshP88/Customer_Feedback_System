import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  // Function to handle button click
  const handleButtonClick = () => {
    // Navigate to the feedback form page
    navigate("/feedbackform");
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
        console.error("Error fetching user feedback:", err);
      }
    };

    fetchUserFeedback();
  }, []); // No dependencies required here

  return (
    <div>
      <h2>User Dashboard</h2>
      <h3>Your Feedbacks</h3>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id}>
            <strong>Feedback Type:</strong> {feedback.feedback_type} <br />
            <strong>Comments:</strong> {feedback.comments} <br />
            <hr />
          </li>
        ))}
      </ul>
      <button onClick={handleButtonClick}>Submit a Feedback</button>
    </div>
  );
};

export default UserDashboard;
