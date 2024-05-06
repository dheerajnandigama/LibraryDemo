import React from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import ChooseUser from "./pages/ChooseUser";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

const App = () => {
  const { currentRole } = useSelector((state) => state.user);

  return (
    <Router>
      {currentRole === null && (
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser visitor="normal" />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/Adminregister" element={<AdminRegisterPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}

      {currentRole === "Admin" && (
        <>
          <AdminDashboard />
        </>
      )}

      {currentRole === "Student" && (
        <>
          <StudentDashboard />
        </>
      )}

      {currentRole === "Teacher" && (
        <>
          <TeacherDashboard />
        </>
      )}
    </Router>
  );
};

export default App;