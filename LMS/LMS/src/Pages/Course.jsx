// import React, { useState } from "react";
// import { Quiz } from "../Components/Quiz";
// import { Link } from "react-router-dom";

// export const Course = () => {
//   const [assignmentFile, setAssignmentFile] = useState(null);
//   const [uploadError, setUploadError] = useState("");

//   const handleFileChange = (e) => {
//     setAssignmentFile(e.target.files[0]);
//     setUploadError("");
//   };

//   const handleSubmitAssignment = () => {
//     if (!assignmentFile) {
//       setUploadError("Please select a file before submitting.");
//       return;
//     }

//     // TODO: Here you can implement actual file upload logic (e.g., API call)

//     // For now, just mark assignment as done:
//     markComplete("assignment");

//     // Clear file input
//     setAssignmentFile(null);
//     setUploadError("");
//   };
//   const [progress, setProgress] = useState(0);
//   const [completed, setCompleted] = useState({
//     text1: false,
//     text2: false,
//     video: false,
//     quiz: false,
//     assignment: false,
//   });

//   const markComplete = (key) => {
//     if (!completed[key]) {
//       setCompleted((prev) => ({ ...prev, [key]: true }));
//       setProgress((prev) => Math.min(prev + 20, 100));
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h2 className="text-info fw-bold text-center mb-4">
//         💻 Full Stack Development Course
//       </h2>

//       {/* Progress Bar */}
//       <div className="progress mb-4" style={{ height: "25px" }}>
//         <div
//           className="progress-bar progress-bar-striped bg-success"
//           role="progressbar"
//           style={{ width: `${progress}%` }}
//           aria-valuenow={progress}
//           aria-valuemin="0"
//           aria-valuemax="100"
//         >
//           {progress}% Completed
//         </div>
//       </div>

//       {/* Text 1 */}
//       <section className="mb-4">
//         <h4>📘 Text 1: Introduction to Full Stack</h4>
//         <p>
//           Full stack development means handling both frontend and backend,
//           integrating databases, servers, APIs, and client-side interfaces.
//         </p>
//         <button
//           className="btn btn-outline-success btn-sm"
//           onClick={() => markComplete("text1")}
//           disabled={completed.text1}
//         >
//           {completed.text1 ? "✅ Done" : "Mark as Done"}
//         </button>
//       </section>

//       {/* Text 2 */}
//       <section className="mb-4">
//         <h4>📙 Text 2: Technologies Used</h4>
//         <p>
//           Technologies include React, Node.js, Express, and MongoDB. Frontend
//           with React, backend with Node.js/Express, and database with MongoDB.
//         </p>
//         <button
//           className="btn btn-outline-success btn-sm"
//           onClick={() => markComplete("text2")}
//           disabled={completed.text2}
//         >
//           {completed.text2 ? "✅ Done" : "Mark as Done"}
//         </button>
//       </section>

//       {/* Video */}
//       <section className="mb-4">
//         <h4>🎥 Video: Full Stack Overview</h4>
//         <div className="ratio ratio-16x9">
//           <iframe
//             src="https://www.youtube.com/embed/nu_pCVPKzTk"
//             title="Full Stack Video"
//             allowFullScreen
//           ></iframe>
//         </div>
//         <button
//           className="btn btn-outline-success btn-sm mt-2"
//           onClick={() => markComplete("video")}
//           disabled={completed.video}
//         >
//           {completed.video ? "✅ Done" : "Mark as Done"}
//         </button>
//       </section>

//       {/* Quiz */}
//       <section className="mb-4">
//         <h4>📝 Quiz</h4>
//         <p>Test your knowledge about frontend/backend roles and tools.</p>
//         <Quiz />
//         <button
//           className="btn btn-outline-success btn-sm"
//           onClick={() => markComplete("quiz")}
//           disabled={completed.quiz}
//         >
//           {completed.quiz ? "✅ Done" : "Mark as Done"}
//         </button>
//       </section>

//       {/* Assignment */}
//       <section className="mb-4">
//         <h4>📂 Assignment</h4>
//         <p>
//           Create a simple CRUD app using React for frontend and Node.js for
//           backend.
//         </p>

//         <input
//           type="file"
//           accept=".zip,.rar,.7z,.pdf,.doc,.docx"
//           onChange={handleFileChange}
//           disabled={completed.assignment}
//         />

//         <br />

//         {uploadError && <small className="text-danger">{uploadError}</small>}

//         <br />

//         <button
//           className="btn btn-outline-success btn-sm mt-2"
//           onClick={handleSubmitAssignment}
//           disabled={completed.assignment || !assignmentFile}
//         >
//           {completed.assignment ? "✅ Submitted" : "Submit Assignment"}
//         </button>
//       </section>
//     </div>
//   );
// };
import React, { useEffect, useState, useRef } from "react";
import CourseSidebar from "../Components/CourseSidebar";
import axios from "axios";
import { useParams } from "react-router-dom";

export const Course = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [lessonsByModule, setLessonsByModule] = useState({});
  const [activeModuleId, setActiveModuleId] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    if (courseId) {
      fetchModulesAndLessons();
    }
  }, [courseId]);

  const fetchModulesAndLessons = async () => {
    try {
      const modRes = await axios.get(`http://localhost:5000/modules/${courseId}`);
      const sortedModules = modRes.data.sort((a, b) => a.order - b.order);
      setModules(sortedModules);

      if (sortedModules.length > 0) {
        setActiveModuleId((prev) => prev || sortedModules[0].id);
      } else {
        setActiveModuleId(null);
      }

      const lessonsData = {};
      for (let mod of sortedModules) {
        const lesRes = await axios.get(`http://localhost:5000/lessons/${mod.id}`);
        lessonsData[mod.id] = lesRes.data;
      }
      setLessonsByModule(lessonsData);
    } catch (error) {
      console.error("Error fetching modules or lessons:", error);
    }
  };

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // select module from sidebar and scroll to section
  const handleModuleSelect = (id) => {
    setActiveModuleId(id);
    scrollToSection(`module-${id}`);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <CourseSidebar
        modules={modules}
        lessons={activeModuleId ? lessonsByModule[activeModuleId] || [] : []}
        scrollToSection={scrollToSection}
        onModuleSelect={handleModuleSelect}
        activeModuleId={activeModuleId}
      />

      <div className="p-4 flex-grow-1" style={{ overflowY: "auto" }}>
        <h2 className="mb-4">Course #{courseId} - Modules</h2>

        {activeModuleId ? (
          modules
            .filter((mod) => mod.id === activeModuleId)
            .map((mod) => (
              <div
                key={mod.id}
                ref={(el) => (sectionRefs.current[`module-${mod.id}`] = el)}
                className="mb-5 border p-3"
              >
                <h4>{mod.title}</h4>
                <p>{mod.description}</p>

                <h5>Lessons:</h5>
                {lessonsByModule[mod.id] && lessonsByModule[mod.id].length > 0 ? (
                  <div className="ms-3">
                    {lessonsByModule[mod.id].map((les) => (
                      <div
                        key={les.id}
                        ref={(el) => (sectionRefs.current[`lesson-${les.id}`] = el)}
                        className="border rounded p-2 mb-2"
                      >
                        <h6>{les.title}</h6>
                        <p>{les.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="fst-italic text-muted">No lessons for this module.</p>
                )}
              </div>
            ))
        ) : (
          <p>No module selected.</p>
        )}
      </div>
    </div>
  );
};
