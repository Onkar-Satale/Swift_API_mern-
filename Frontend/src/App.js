import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostmanClone from "./components/PostmanClone";
import AccountPage from "./components/AccountPage";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute"; // Make sure this exists

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PostmanClone />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
