import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import QuizViewer from "../Components/QuizViewer";

export const CourseViewer = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessonsByModule, setLessonsByModule] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});
  const [progress, setProgress] = useState(0);
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("idle");

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const [courseRes, modulesRes] = await Promise.all([
          axios.get(`http://localhost:5000/courses/${courseId}`),
          axios.get(`http://localhost:5000/modules/${courseId}`),
        ]);

        setCourse(courseRes.data);
        const sortedModules = modulesRes.data.sort((a, b) => a.order - b.order);
        setModules(sortedModules);

        const lessonsData = {};
        for (const mod of sortedModules) {
          const lessonsRes = await axios.get(
            `http://localhost:5000/lessons/${mod.id}`
          );
          lessonsData[mod.id] = lessonsRes.data.sort(
            (a, b) => a.order - b.order
          );
        }

        setLessonsByModule(lessonsData);

        if (sortedModules.length > 0) setSelectedModuleId(sortedModules[0].id);
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (!userId || !courseId || Object.keys(lessonsByModule).length === 0)
      return;

    const fetchProgressData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/enrollment/progress/${userId}/${courseId}`
        );
        const progressFromDB = res.data?.[0]?.progress || 0;
        setProgress(progressFromDB);

        const totalLessons = Object.values(lessonsByModule).reduce(
          (sum, lessons) => sum + lessons.length,
          0
        );
        const completedCount = Math.round(
          (progressFromDB / 100) * totalLessons
        );

        const newCompleted = {};
        let count = 0;
        for (const moduleId in lessonsByModule) {
          for (const lesson of lessonsByModule[moduleId]) {
            newCompleted[lesson.id] = count < completedCount;
            count++;
          }
        }

        setCompletedLessons(newCompleted);
      } catch (error) {
        console.error("Error loading progress:", error.message);
      }
    };

    fetchProgressData();
  }, [userId, courseId, lessonsByModule]);

  const isModuleCompleted = (moduleId) => {
    const lessons = lessonsByModule[moduleId] || [];
    return lessons.every((lesson) => completedLessons[lesson.id]);
  };

  const isModuleAccessible = (module, index) => {
    if (index === 0) return true;
    for (let i = 0; i < index; i++) {
      if (!isModuleCompleted(modules[i].id)) return false;
    }
    return true;
  };

  const calculateProgress = (completed) => {
    const total = Object.values(lessonsByModule).reduce(
      (sum, lessons) => sum + lessons.length,
      0
    );
    const done = Object.values(completed).filter(Boolean).length;
    setProgress(total ? Math.round((done / total) * 100) : 0);
  };

  const handleLessonToggle = (lessonId, moduleId, index) => {
    const lessons = lessonsByModule[moduleId];
    if (index > 0 && !completedLessons[lessons[index - 1].id]) {
      alert("Please complete the previous lesson first");
      return;
    }

    const updated = {
      ...completedLessons,
      [lessonId]: !completedLessons[lessonId],
    };

    setCompletedLessons(updated);
    calculateProgress(updated);
  };

  const saveProgress = async () => {
    if (!userId || !courseId) return;
    setSaveStatus("saving");

    try {
      await axios.put(`http://localhost:5000/enrollments/progress/`, {
        userId,
        courseId,
        progress,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving progress:", error);
      setSaveStatus("error");
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (!course)
    return <div className="alert alert-danger">Course not found</div>;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <aside className="bg-light border-end p-3" style={{ width: 250 }}>
        <h5>{course.title}</h5>
        {modules.map((module, index) => {
          const accessible = isModuleAccessible(module, index);
          const completed = isModuleCompleted(module.id);

          return (
            <div key={module.id} className="mb-2">
              <div
                className={`d-flex justify-content-between align-items-center ${
                  !accessible ? "text-muted" : ""
                }`}
                style={{
                  cursor: accessible ? "pointer" : "not-allowed",
                  opacity: accessible ? 1 : 0.6,
                }}
                onClick={() => {
                  if (!accessible)
                    return alert("Complete previous module first");
                  setExpandedModules((prev) => ({
                    ...prev,
                    [module.id]: !prev[module.id],
                  }));
                  setSelectedModuleId(module.id);
                }}
              >
                <strong>{module.title}</strong>
                {completed && <span className="text-success">✓</span>}
              </div>
              {expandedModules[module.id] && (
                <ul className="list-unstyled ms-3">
                  {lessonsByModule[module.id]?.map((lesson) => (
                    <li key={lesson.id}>{lesson.title}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </aside>

      <main className="flex-grow-1 p-4">
        <h2>{course.title}</h2>
        <p>{course.description}</p>

        <div className="mb-4">
          <strong>Progress: {progress}%</strong>
          <div className="progress mt-2" style={{ height: 8 }}>
            <div
              className={`progress-bar ${
                progress === 100 ? "bg-success" : "bg-primary"
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <button
            className="btn btn-sm btn-primary mt-2"
            onClick={saveProgress}
          >
            {saveStatus === "saving" ? "Saving..." : "Save Progress"}
          </button>
          {saveStatus === "saved" && (
            <div className="text-success mt-2">Progress saved!</div>
          )}
          {saveStatus === "error" && (
            <div className="text-danger mt-2">Error saving progress.</div>
          )}
        </div>

        {selectedModuleId && (
          <>
            <h4>{modules.find((m) => m.id === selectedModuleId)?.title}</h4>
            {lessonsByModule[selectedModuleId]?.map(
              (lesson, index, lessonsArray) => {
                const isPreviousLessonCompleted =
                  index === 0 || completedLessons[lessonsArray[index - 1].id];

                const isLessonCompleted = completedLessons[lesson.id];

                return (
                  <div
                    key={lesson.id}
                    className={`border p-3 mb-3 rounded ${
                      isLessonCompleted ? "bg-light" : ""
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{lesson.title}</h5>
                      {isPreviousLessonCompleted ? (
                        <button
                          className={`btn btn-sm ${
                            isLessonCompleted
                              ? "btn-success"
                              : "btn-outline-primary"
                          }`}
                          onClick={() =>
                            handleLessonToggle(
                              lesson.id,
                              selectedModuleId,
                              index
                            )
                          }
                        >
                          {isLessonCompleted ? "Completed" : "Mark Complete"}
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-secondary" disabled>
                          Complete previous lesson first
                        </button>
                      )}
                    </div>

                    {isPreviousLessonCompleted && (
                      <>
                        {lesson.content_type === "text" && (
                          <div
                            className="mt-2"
                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                          />
                        )}

                        {lesson.content_type === "video" && (
                          <div className="ratio ratio-16x9 mt-3">
                            <iframe
                              src={lesson.content}
                              title={lesson.title}
                              allowFullScreen
                            ></iframe>
                          </div>
                        )}

                        {lesson.content_type === "quiz" && (
                          <div className="mt-3">
                            <QuizViewer lessonId={lesson.id} />
                          </div>
                        )}
                        {lesson.content_type === "assignment" && (
                          <div className="mt-3 p-3 border rounded bg-warning-subtle">
                            <h6 className="mb-2 text-dark">
                              📎 Assignment Instructions
                            </h6>

                            {/* ✅ عرض محتوى الدرس */}
                            <div
                              className="mb-3"
                              dangerouslySetInnerHTML={{
                                __html: lesson.content,
                              }}
                            />

                            <h6>Upload Your Assignment</h6>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const fileInput =
                                  e.target.elements.assignmentFile;
                                const formData = new FormData();
                                formData.append("file", fileInput.files[0]);
                                formData.append("userId", userId);
                                formData.append("lessonId", lesson.id);

                                axios
                                  .post(
                                    `http://localhost:5000/assignments/${userId}/submit`,
                                    formData,
                                    {
                                      headers: {
                                        "Content-Type": "multipart/form-data",
                                      },
                                    }
                                  )
                                  .then(() =>
                                    alert("File uploaded successfully")
                                  )
                                  .catch((err) => {
                                    console.error("Upload error:", err);
                                    alert("Failed to upload file");
                                  });
                              }}
                            >
                              <input
                                type="file"
                                name="assignmentFile"
                                className="form-control mb-2"
                                required
                              />
                              <button
                                type="submit"
                                className="btn btn-success btn-sm"
                              >
                                📤 Upload Assignment
                              </button>
                            </form>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              }
            )}
          </>
        )}
      </main>
    </div>
  );
};
