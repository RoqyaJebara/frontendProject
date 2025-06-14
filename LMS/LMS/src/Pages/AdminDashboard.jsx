import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import AdminSidebar from "../Components/AdminSidebar";
import AdminAnalytics from "../Components/AdminAnalytics";

export const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeSection, setActiveSection] = useState("students");
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();
  const analyticsRef = useRef();

  const admin = JSON.parse(sessionStorage.getItem("user"));
  const adminId = admin?.id;

  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (!adminId) return;
      try {
        const response = await fetch(`http://localhost:5000/users/${adminId}`);
        if (!response.ok) throw new Error("Failed to fetch admin details");
        const data = await response.json();
        setAdminName(data.name || `${data.first_name} ${data.last_name}`);
      } catch (error) {
        console.error("Error fetching admin details:", error);
        setAdminName("Admin");
      }
    };

    fetchAdminDetails();
  }, [adminId]);

  useEffect(() => {
    fetch("http://localhost:5000/users/role/students")
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);

    fetch("http://localhost:5000/courses")
      .then((res) => res.json())
      .then(setCourses)
      .catch(console.error);

    fetch("http://localhost:5000/users/role/instructors")
      .then((res) => res.json())
      .then(setInstructors)
      .catch(console.error);

    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleEditStudent = (student) => {
    navigate("/student_update", { state: student });
  };

  const handleEditInstructor = (instructor) => {
    navigate("/instructor_update", { state: instructor });
  };

  const deleteStudent = (id) => {
    fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
      .then(() => setStudents(students.filter((s) => s.id !== id)))
      .catch(console.error);
  };

  const deleteInstructor = (id) => {
    fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
      .then(() => setInstructors(instructors.filter((i) => i.id !== id)))
      .catch(console.error);
  };

  const approveCourse = (id) => {
    fetch(`http://localhost:5000/courses/${id}/approval`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: 'true' }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to approve course");
        return res.json();
      })
      .then(() => {
        setCourses(courses.map((c) => (c.id === id ? { ...c, is_approved: true } : c)));
      })
      .catch(console.error);
  };

  const rejectCourse = (id) => {
    fetch(`http://localhost:5000/courses/${id}/approval`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: 'false' }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to reject course");
        return res.json();
      })
      .then(() => {
        setCourses(courses.map((c) => (c.id === id ? { ...c, is_approved: false } : c)));
      })
      .catch(console.error);
  };

  const deleteCategory = (id) => {
    fetch(`http://localhost:5000/categories/${id}`, { method: "DELETE" })
      .then(() => setCategories(categories.filter((cat) => cat.id !== id)))
      .catch(console.error);
  };

  const handleDownloadPDF = () => {
    const element = analyticsRef.current;
    const options = {
      filename: "course-analytics-report.pdf",
      margin: 0.5,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <>
     

      <div className="d-flex">
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-grow-1 p-4">
          <h1 className="fw-bold mb-4 text-center" style={{ color: "#18547a" }}>
            🧑‍💼 {adminName}'s Dashboard
          </h1>

          {activeSection === "students" && (
            <section>
              <h3>Students</h3>
              <Link to="/student_create">
                <button className="btn btn-success me-2">Add Student</button>
              </Link>
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEditStudent(s)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteStudent(s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeSection === "instructors" && (
            <section>
              <h3>Instructors</h3>
              <Link to="/instructor_create">
                <button className="btn btn-success me-2">Add Instructor</button>
              </Link>
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((i) => (
                    <tr key={i.id}>
                      <td>{i.name}</td>
                      <td>{i.email}</td>
                      <td>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEditInstructor(i)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteInstructor(i.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeSection === "courses" && (
            <section>
              <h3>Courses</h3>
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td>{c.title}</td>
                      <td>{c.is_approved ? "✅ Approved" : "❌ Not Approved"}</td>
                      <td>
                        {!c.is_approved ? (
                          <button className="btn btn-sm btn-success me-2" onClick={() => approveCourse(c.id)}>Approve</button>
                        ) : (
                          <button className="btn btn-sm btn-info me-2" onClick={() => rejectCourse(c.id)}>Reject</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeSection === "categories" && (
            <section>
              <h3>Categories</h3>
              <Link to="/category_create">
                <button className="btn btn-success me-2">Add Category</button>
              </Link>
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.name}</td>
                      <td>
                        <Link to={`/category_update/${cat.id}`} state={cat}>
                          <button className="btn btn-sm btn-info me-2">Edit</button>
                        </Link>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(cat.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeSection === "analytics" && (
            <section>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Course Analytics</h3>
                <div>
                  <button
                    className="btn btn-outline-primary me-2 no-print"
                    onClick={handleDownloadPDF}
                  >
                    📄 Report PDF
                  </button>
                  <button
                    className="btn btn-outline-primary no-print"
                    style={{ fontWeight: "600", letterSpacing: "0.05em" }}
                    onClick={() => window.print()}
                  >
                    🖨️ Print
                  </button>
                </div>
              </div>
              <div ref={analyticsRef}>
                <AdminAnalytics />
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};
