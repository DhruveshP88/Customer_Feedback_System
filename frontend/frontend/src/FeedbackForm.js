import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Retrieve the token from local storage

    try {
      const response = await axios.post("http://localhost:8000/api/feedback/",
        {
          user,
          name,
          email,
          feedback_type: feedbackType,
          comments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      setMessage("Feedback submitted successfully!");
      setUser("");
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
          placeholder="User"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
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
