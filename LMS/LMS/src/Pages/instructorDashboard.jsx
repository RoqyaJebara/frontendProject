import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import InstructorSidebar from "../Components/InstructorSidebar";
import InstructorAnalytics from "../Components/InstructorAnalytics";
import html2pdf from "html2pdf.js";

const InstructorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [quizGrades, setQuizGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("courses");
  const [instructorName, setInstructorName] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const instructorId = user?.id;
  const analyticsRef = useRef(null);

  const handlePrint = () => {
    if (!analyticsRef.current) return;
    html2pdf()
      .from(analyticsRef.current)
      .set({
        margin: 1,
        filename: "Instructor_Analytics_Report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  // Fetch instructor details
  useEffect(() => {
    if (!instructorId) return;

    const fetchInstructorDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${instructorId}`);
        if (!res.ok) throw new Error("Failed to fetch instructor details");
        const data1 = await res.json();
        setInstructorName(
          (data1.name ?? `${(data1.first_name ?? "")} ${(data1.last_name ?? "")}`.trim()) || "Instructor"
        );
      } catch {
        setInstructorName("Instructor");
      }
    };

    fetchInstructorDetails();
  }, [instructorId]);

  // Fetch courses by instructor
  useEffect(() => {
    if (!instructorId) return;

    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://localhost:5000/courses/instructor/${instructorId}`);
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourses();
  }, [instructorId]);

  // Fetch enrollments and map students with progress
  useEffect(() => {
    if (courses.length === 0) {
      setStudents([]);
      setLoading(false);
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const res = await fetch("http://localhost:5000/enrollments");
        if (!res.ok) throw new Error("Failed to fetch enrollments");
        const allEnrollments = await res.json();

        const instructorCourseIds = courses.map((c) => c.course_id || c.id);

        const filteredEnrollments = allEnrollments.filter((enr) =>
          instructorCourseIds.includes(enr.course_id)
        );

        // Map students with their courses & progress
        const studentMap = {};
        filteredEnrollments.forEach(({ user_id, user_name, course_id, course_title, progress }) => {
          if (!studentMap[user_id]) {
            studentMap[user_id] = { id: user_id, name: user_name, enrolledCourses: [] };
          }
          studentMap[user_id].enrolledCourses.push({ courseId: course_id, courseTitle: course_title, progress });
        });

        setStudents(Object.values(studentMap));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [courses]);

  // Fetch submissions filtered by instructor courses
  useEffect(() => {
    if (courses.length === 0) {
      setSubmissions([]);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const res = await fetch("http://localhost:5000/submissions");
        if (!res.ok) throw new Error("Failed to fetch submissions");
        const data = await res.json();

        const instructorCourseIds = courses.map((c) => c.course_id || c.id);
        const filtered = data.filter((s) => instructorCourseIds.includes(s.course_id));

        setSubmissions(filtered);
      } catch (err) {
        console.error("Error fetching submissions:", err.message);
      }
    };

    fetchSubmissions();
  }, [courses]);

  // Fetch quiz grades for instructor's courses
  useEffect(() => {
    if (courses.length === 0) return;

    const fetchQuizGrades = async () => {
      try {
        const res = await fetch("http://localhost:5000/quizzes/grades");
        if (!res.ok) throw new Error("Failed to fetch quiz grades");
        const data = await res.json();

        const instructorCourseIds = courses.map((c) => c.course_id || c.id);
        const filtered = data.filter((grade) => 
          instructorCourseIds.includes(grade.course_id)
        );

        setQuizGrades(filtered);
      } catch (err) {
        console.error("Error fetching quiz grades:", err.message);
      }
    };

    fetchQuizGrades();
  }, [courses]);

  // Delete course handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`http://localhost:5000/courses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete course");
      setCourses((prev) => prev.filter((course) => (course.course_id || course.id) !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Update submission form inputs
  const handleSubmissionChange = (id, field, value) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Save submission grade and feedback update
  const saveSubmissionUpdate = async (submission) => {
    try {
      const res = await fetch(`http://localhost:5000/assignments/${submission.id}/grade`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: submission.grade,
          feedback: submission.feedback,
        }),
      });
      if (!res.ok) throw new Error("Failed to update submission");
      alert("Updated successfully");
    } catch (err) {
      alert("Error updating submission: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <div className="d-flex container-fluid p-0" style={{ gap: "2rem" }}>
      <InstructorSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main style={{ flexGrow: 1 }}>
        <h1 className="fw-bold mb-4 text-center" style={{ color: "#18547a" }}>
          👨‍🏫 {instructorName}'s Dashboard
        </h1>

        <div className="mb-3 text-center">
          {["courses", "students", "submissions", "quizGrades", "analytics"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`btn m-2 ${
                activeSection === section
                  ? "btn-primary"
                  : section === "courses"
                  ? "btn-outline-primary"
                  : section === "students"
                  ? "btn-outline-success"
                  : section === "submissions"
                  ? "btn-outline-secondary"
                  : section === "quizGrades"
                  ? "btn-outline-info"
                  : "btn-outline-dark"
              }`}
              aria-pressed={activeSection === section}
              type="button"
            >
              {{
                courses: "📚 Courses",
                students: "👨‍🎓 Students",
                submissions: "📩 Submissions",
                quizGrades: "📝 Quiz Grades",
                analytics: "📊 Analytics",
              }[section]}
            </button>
          ))}
        </div>

        {activeSection === "courses" && (
          <>
            <section className="mb-4">
              <h4>➕ Create New Course</h4>
              <Link to="/course_create" state={{ instructorId }}>
                <button className="btn btn-success btn-sm">Create Course</button>
              </Link>
            </section>

            <section className="mb-5">
              <h4>📚 My Courses</h4>
              <div
                style={{
                  width: "100%",
                  minWidth: "300px",
                  maxWidth: "100%",
                  resize: "horizontal",
                  border: "1px solid #ddd",
                }}
              >
                <table
                  className="table table-bordered table-hover align-middle"
                  style={{ minWidth: "900px" }}
                >
                  <thead className="table-light text-center">
                    <tr>
                      <th>ID</th>
                      <th>Thumbnail</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Created</th>
                      <th>Published</th>
                      <th>Approved</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.course_id || course.id}>
                        <td className="text-center">{course.course_id || course.id}</td>
                        <td className="text-center">
                          {course.thumbnail_url ? (
                            <img
                              src={`http://localhost:5000/uploads/${encodeURIComponent(
                                course.thumbnail_url
                              )}`}
                              alt={course.title}
                              style={{
                                width: "80px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              title={course.title}
                            />
                          ) : (
                            <span className="text-muted">No Image</span>
                          )}
                        </td>
                        <td
                          style={{
                            maxWidth: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={course.title}
                        >
                          {course.title}
                        </td>
                        <td
                          style={{
                            maxWidth: "300px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={course.description}
                        >
                          {course.description}
                        </td>
                        <td className="text-center">{course.category_name}</td>
                        <td className="text-center">{course.price} JD</td>
                        <td className="text-center">
                          {new Date(course.created_at).toLocaleDateString()}
                        </td>
                        <td className="text-center">
                          {course.is_published ? "Yes" : "No"}
                        </td>
                        <td className="text-center">
                          {course.is_approved==='true' ? "Yes" : "No"}
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/course_update/${course.course_id || course.id}`}
                            state={{ instructorId }}
                            className="btn btn-info btn-sm me-2 mb-1"
                            title="Edit Course"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/course_editor/${course.course_id || course.id}`}
                            className="btn btn-warning btn-sm me-2 mb-1"
                            title="Manage Lessons"
                          >
                            Lessons
                          </Link>
                          <button
                            onClick={() => handleDelete(course.course_id || course.id)}
                            className="btn btn-danger btn-sm mb-1"
                            title="Delete Course"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeSection === "students" && (
          <section>
            <h4 className="mb-4">👨‍🎓 Student Progress</h4>
            <div className="row">
              {students.map((student) => (
                <div key={student.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body">
                      <h5 className="card-title fw-bold text-primary">{student.name}</h5>
                      <ul className="list-group list-group-flush mt-3">
                        {student.enrolledCourses.map((enrolled) => (
                          <li
                            key={enrolled.courseId}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <span>{enrolled.courseTitle}</span>
                            <span className="badge bg-success rounded-pill">{enrolled.progress}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "submissions" && (
          <section>
            <h4 className="mb-4">📩 Assignment Submissions</h4>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Assignment</th>
                    <th>Content</th>
                    <th>File</th>
                    <th>Grade</th>
                    <th>Feedback</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.student_name}</td>
                      <td>{submission.course_title}</td>
                      <td>{submission.lesson_name}</td>
                      <td>{submission.lesson_content}</td>
                      <td>
                        {submission.submission_url ? (
                          <a
                            href={`http://localhost:5000/uploads/${encodeURIComponent(submission.submission_url)}`}
                            download
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-muted">No file</span>
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={submission.grade || ""}
                          className="form-control"
                          onChange={(e) =>
                            handleSubmissionChange(submission.id, "grade", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={submission.feedback || ""}
                          className="form-control"
                          onChange={(e) =>
                            handleSubmissionChange(submission.id, "feedback", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => saveSubmissionUpdate(submission)}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No submissions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "quizGrades" && (
          <section>
            <h4 className="mb-4">📝 Quiz Grades</h4>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Total</th>
                    <th>Percentage</th>
                    {/* <th>Completed At</th> */}
                  </tr>
                </thead>
                <tbody>
                  {quizGrades.map((grade) => (
                    <tr key={grade.id}>
                      <td>{grade.student_name}</td>
                      <td>{grade.course_title}</td>
                      <td>{grade.lesson_title}</td>
                      <td>{grade.grade }</td>
                      <td>{grade.max_score}</td>
                      <td>{Math.round((parseInt(grade.grade )/ parseInt(grade.max_score)) * 100)}%</td>
                      {/* <td>{new Date(grade.completed_at).toLocaleString()}</td> */}
                    </tr>
                  ))}
                  {quizGrades.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No quiz grades found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "analytics" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="m-0">📊 Instructor Analytics</h3>
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => window.print()}
                  title="Print"
                  aria-label="Print dashboard"
                >
                  🖨️ Print
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={handlePrint}
                  title="Export PDF"
                  aria-label="Export dashboard as PDF"
                >
                  📄 Report PDF
                </button>
              </div>
            </div>
            <div ref={analyticsRef}>
              <InstructorAnalytics 
                courses={courses} 
                students={students} 
                quizGrades={quizGrades}
                role="instructor" 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;