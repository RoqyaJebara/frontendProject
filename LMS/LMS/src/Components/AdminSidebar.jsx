import React from "react";
import { Link } from "react-router-dom";
import ModuleForm from '../Components/Module'
import LessonForm from '../Components/Lesson'

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="bg-light border-end p-3" style={{ minHeight: "100vh", width: "220px" }}>
      <h4 style={{ color: "#18547a" }}className="fw-bold  text-center mb-4">Admin Panel</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${activeSection === "students" ? "fw-bold text-info" : "fw-bold text-black"}`}
            onClick={() => setActiveSection("students")}
          >
            🧑‍🎓 Students
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${activeSection === "instructors" ? "fw-bold text-info" : "fw-bold text-black"}`}
            onClick={() => setActiveSection("instructors")}
          >
            🧑‍🏫 Instructors
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${activeSection === "courses" ? "fw-bold text-info" : "fw-bold text-black"}`}
            onClick={() => setActiveSection("courses")}
          >
            📚 Courses
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${activeSection === "categories" ? "fw-bold text-info" : "fw-bold text-black"}`}
            onClick={() => setActiveSection("categories")}
          >
            🏷️ Categories
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
