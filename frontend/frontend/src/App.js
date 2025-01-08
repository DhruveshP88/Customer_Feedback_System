import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FeedbackForm from "./FeedbackForm";
import FeedbackDashboard from "./FeedbackDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Use 'element' instead of 'component' and no 'exact' */}
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/dashboard" element={<FeedbackDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
