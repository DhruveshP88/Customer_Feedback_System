import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import FeedbackForm from "./FeedbackForm";
import FeedbackDashboard from "./FeedbackDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Use 'element' instead of 'component' and no 'exact' */}
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        {/* <Route path="/dashboard" element={<FeedbackDashboard />} />*/}
      </Routes>
    </Router>
  );
};

export default App;
