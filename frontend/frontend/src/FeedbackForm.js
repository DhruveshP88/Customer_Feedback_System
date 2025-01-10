import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if token is missing
      return;
    }

    // Verify user role
    axios
      .get("http://localhost:8000/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.role !== "staff") {
          navigate("/unauthorized"); // Redirect unauthorized users
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirect to login on error
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/feedback/",
        {
          name,
          email,
          feedback_type: feedbackType,
          comments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request
          },
        }
      );
      setMessage("Feedback submitted successfully!");
      setName("");
      setEmail("");
      setFeedbackType("");
      setComments("");
    } catch (error) {
      setMessage("Error submitting feedback.");
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="feedback-form">
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          value={feedbackType}
          onChange={(e) => setFeedbackType(e.target.value)}
          required
        >
          <option value="">Select Feedback Type</option>
          <option value="product">Product</option>
          <option value="service">Service</option>
          <option value="other">Other</option>
        </select>
        <textarea
          placeholder="Your Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FeedbackForm;
