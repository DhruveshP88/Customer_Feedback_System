import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackDashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/feedback/");
        setFeedback(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const filteredFeedback = feedback.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.comments.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="feedback-dashboard">
      <h2>Feedback Dashboard</h2>
      <input
        type="text"
        placeholder="Search feedback"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <p>Loading feedback...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Feedback Type</th>
              <th>Sentiment</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedback.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.feedback_type}</td>
                <td>{item.sentiment}</td>
                <td>{item.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbackDashboard;
