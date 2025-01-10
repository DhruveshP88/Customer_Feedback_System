import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchUserFeedback = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/feedback/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(response.data);
      } catch (err) {
        console.error("Error fetching user feedback:", err);
      }
    };

    fetchUserFeedback();
  }, []);

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
    </div>
  );
};

export default UserDashboard;
