import { FaPuzzlePiece, FaBookOpen } from "react-icons/fa";

const CourseSidebar = ({ modules, lessons, scrollToSection, onModuleSelect, activeModuleId }) => {
  return (
    <div
      className="bg-light p-3"
      style={{ width: "250px",   
         // fixed width
        minWidth: "220px", // prevents shrinking
        minHeight: "100vh",
       borderRight: "1px solid #ddd", height: "100vh", overflowY: "auto" }}
    >
      <h5 className="fw-bold mb-3">
        <FaPuzzlePiece className="me-2" /> Modules
      </h5>
      <ul className="list-unstyled">
        {modules.map((mod) => (
          <li key={mod.id} className="mb-2">
            <button
              className={`btn btn-link text-decoration-none p-0 ${activeModuleId === mod.id ? "text-info fw-bold" : "text-black"}`}
              onClick={() => {
                onModuleSelect(mod.id);
              }}
            >
              {mod.title}
            </button>
          </li>
        ))}
      </ul>

      <h5 className="fw-bold mt-4 mb-3">
        <FaBookOpen className="me-2" /> Lessons
      </h5>
      <ul className="list-unstyled">
        {lessons.map((les) => (
          <li key={les.id} className="mb-2">
            <button
              className="btn btn-link text-decoration-none text-secondary p-0"
              onClick={() => scrollToSection(`lesson-${les.id}`)}
            >
              {les.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseSidebar;
