import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/feedback/", {
        name,
        email,
        feedback_type: feedbackType,
        comments,
      });
      setMessage("Feedback submitted successfully!");
    } catch (error) {
      setMessage("Error submitting feedback.");
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
