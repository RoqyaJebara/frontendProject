import React from "react";

const InstructorSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div
      className="bg-light border-end"
      style={{
        width: "220px", // fixed width
        minWidth: "220px", // prevents shrinking
        minHeight: "100vh",
      }}
    >
      <h4
        style={{ color: "#18547a" }}
        className="fw-bold text-center mt-3 mb-4"
      >
        Instructor Panel
      </h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${
              activeSection === "courses"
                ? "fw-bold text-info"
                : "fw-bold text-black"
            }`}
            onClick={() => setActiveSection("courses")}
          >
            📚 Courses
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${
              activeSection === "students"
                ? "fw-bold text-info"
                : "fw-bold text-black"
            }`}
            onClick={() => setActiveSection("students")}
          >
            🧑‍🎓 Students
          </button>
        </li>
        
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${
              activeSection === "submissions"
                ? "fw-bold text-info"
                : "fw-bold text-black"
            }`}
            onClick={() => setActiveSection("submissions")}
          >
            📩 Submissions
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${
              activeSection === "quizGrades"
                ? "fw-bold text-info"
                : "fw-bold text-black"
            }`}
            onClick={() => setActiveSection("quizGrades")}
          >
            📝 Quiz Grades
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            className={`nav-link btn btn-link text-start ${
              activeSection === "analytics"
                ? "fw-bold text-info"
                : "fw-bold text-black"
            }`}
            onClick={() => setActiveSection("analytics")}
          >
            📊 Analytics
          </button>
        </li>
      </ul>
    </div>
  );
};

export default InstructorSidebar;
