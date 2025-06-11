import React from "react";
import { Link } from "react-router-dom";

const StudentSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div
      className="bg-light border-end p-3"
      style={{ minHeight: "100vh", width: "220px" }}
    >
      <h4 className="fw-bold text-center mb-4" style={{ color: "#18547a" }}>
        Student Panel
      </h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${
              activeSection === "allCourses"
                ? "fw-bold text-info"
                : "fw-bold text-black"
            }`}
            onClick={() => setActiveSection("allCourses")}
          >
            📚 All Courses
          </button>
        </li>

        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${
              activeSection === "enrolledCourses"
                ? "fw-bold text-info"
                : "fw-bold text-black"
            }`}
            onClick={() => setActiveSection("enrolledCourses")}
          >
            🎓 Enrolled Courses
          </button>
        </li>

       
      </ul>
    </div>
  );
};

export default StudentSidebar;
