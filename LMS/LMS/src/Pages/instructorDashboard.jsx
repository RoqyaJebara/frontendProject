import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InstructorSidebar from "../Components/InstructorSidebar";

export const InstructorDashboard = () => {
  // State declarations at the top (consistent order)
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("courses");
  const [instructorName, setInstructorName] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const instructorId = user?.id;
  useEffect(() => {
    const fetchInstructorDetails = async () => {
      if (!instructorId) return;

      try {
        const response = await fetch(
          `http://localhost:5000/users/${instructorId}`
        );
        if (!response.ok) throw new Error("Failed to fetch instructor details");
        const data = await response.json();
        setInstructorName(data.name || `${data.first_name} ${data.last_name}`);
      } catch (error) {
        console.error("Error fetching instructor details:", error);
        setInstructorName("Instructor");
      }
    };

    fetchInstructorDetails();
  }, [instructorId]);
  // Fetch enrollments (students data)
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await fetch("http://localhost:5000/enrollments");
        if (!response.ok) {
          throw new Error("Failed to fetch enrollments");
        }
        const data = await response.json();

        const studentMap = {};
        data.forEach((enrollment) => {
          if (!studentMap[enrollment.user_id]) {
            studentMap[enrollment.user_id] = {
              id: enrollment.user_id,
              name: enrollment.user_name,
              enrolledCourses: [],
            };
          }

          studentMap[enrollment.user_id].enrolledCourses.push({
            courseId: enrollment.course_id,
            courseTitle: enrollment.course_title,
            progress: enrollment.progress,
          });
        });

        setStudents(Object.values(studentMap));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/courses/instructor/${instructorId}`
        );
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (instructorId) {
      fetchCourses();
    }
  }, [instructorId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const courseMap = Object.fromEntries(
    courses.map((course) => [course.id, course.title])
  );
  const getCourseTitle = (id) => courseMap[id] || "Unknown Course";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="d-flex container-fluid p-0" style={{ gap: "2rem" }}>
      <InstructorSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main style={{ flexGrow: 1 }}>
        <h1 className="fw-bold mb-4 text-center" style={{ color: "#18547a" }}>
          👨‍🏫 {instructorName}'s Dashboard
        </h1>

        {activeSection === "courses" && (
          <>
            <section className="mb-4">
              <h4>➕ Create New Course</h4>
              <Link to="/course_create">
                <button className="btn btn-success btn-sm">
                  Create Course
                </button>
              </Link>
            </section>

            <section className="mb-5">
              <h4>📚 My Courses</h4>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
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
                      <tr key={course.course_id}>
                        <td>{course.course_id}</td>
                        <td>
                          {course.thumbnail_url && (
                            <img
                              src={`http://localhost:5000/uploads/${encodeURIComponent(
                                course.thumbnail_url
                              )}`}
                              alt={course.title}
                              width="80"
                              height="50"
                              style={{ objectFit: "cover" }}
                            />
                          )}
                        </td>
                        <td>{course.title}</td>
                        <td>{course.description}</td>
                        <td>{course.category_name}</td>
                        <td>{course.price} JD</td>
                        <td>
                          {new Date(course.created_at).toLocaleDateString()}
                        </td>
                        <td>{course.is_published === "true" ? "Yes" : "No"}</td>
                        <td>{course.is_approved === "true" ? "Yes" : "No"}</td>
                        <td>
                          <Link
                            to={`/course_update/${course.course_id}`}
                            className="btn btn-info btn-sm me-2"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/course_editor/${course.course_id}`}
                            className="btn btn-warning btn-sm me-2"
                          >
                            Lessons
                          </Link>
                          <button
                            onClick={() => handleDelete(course.course_id)}
                            className="btn btn-danger btn-sm"
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
            <h4>👨‍🎓 Student Progress</h4>
            {students.map((student) => (
              <div key={student.id} className="mb-4">
                <h5>{student.name}</h5>
                <ul className="list-group">
                  {student.enrolledCourses.map((enrolled) => (
                    <li key={enrolled.courseId} className="list-group-item">
                      {enrolled.courseTitle} - {enrolled.progress}% complete
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;
