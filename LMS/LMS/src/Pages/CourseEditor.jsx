import React, { useEffect, useState, useRef } from "react";
import CourseSidebar from "../Components/CourseSidebar";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export const CourseEditor = () => {
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

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await axios.delete(`http://localhost:5000/modules/${id}`);
      await fetchModulesAndLessons();
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const handleLessonDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`http://localhost:5000/lessons/${id}`);
      await fetchModulesAndLessons();
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  // دالة اختيار الموديل من السايدبار
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
        <h2 className="mb-4">Editor : Course #{courseId}  - Modules</h2>

        <Link to={`/module_create/${courseId}`} className="btn btn-success mb-4">
          Add Module
        </Link>

        {/* عرض الموديل النشط فقط */}
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

                <div className="mb-3">
                  <Link to={`/module_update/${mod.id}`} state={{ courseId }}>
                    <button className="btn btn-sm btn-info me-2">Edit</button>
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteModule(mod.id)}
                  >
                    Delete
                  </button>
                </div>

                <h5>Lessons:</h5>
                <Link to={`/lesson_create/${mod.id}`} state={{ courseId }}>
                  <button className="btn btn-sm btn-success mb-3">Add Lesson</button>
                </Link>

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
                        <div>
                          <Link to={`/lesson_update/${les.id}`} state={mod.id }>
                          {/* {console.log("les.id"+les.id) }*/}
                          
                            <button className="btn btn-sm btn-info me-2">Edit</button>
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleLessonDelete(les.id)}
                          >
                            Delete
                          </button>
                        </div>
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
