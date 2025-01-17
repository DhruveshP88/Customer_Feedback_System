import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import FeedbackForm from "./FeedbackForm";
import UserManagement from "./Usermanagement";
import Sentimentchart from "./sentimentchart";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Use 'element' instead of 'component' and no 'exact' */}
        <Route path="/feedbackform" element={<FeedbackForm />} />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/sentiment-chart" element={<Sentimentchart />} />
      </Routes>
    </Router>
  );
};

export default App;
