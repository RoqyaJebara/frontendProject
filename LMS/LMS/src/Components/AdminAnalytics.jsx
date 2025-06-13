import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import InstructorAnalytics from "./InstructorAnalytics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState({ count: 0, names: [] });
  const [instructors, setInstructors] = useState({ count: 0, names: [] });
  const [allStudentsEnrollments, setAllStudentsEnrollments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/analytics/summary")
      .then((res) => {
        setCourses(res.data.courses);
        setStudents(res.data.students);
        setInstructors(res.data.instructors);
      })
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/students-progress")
      .then((res) => {
        setAllStudentsEnrollments(res.data);
      })
      .catch((err) =>
        console.error("Error fetching all students enrollments:", err)
      );
  }, []);

  const coursesWithEnrollments = courses.filter(
    (c) => parseInt(c.enrollments_count) > 0
  );

  const coursesWithoutEnrollments = courses.filter(
    (c) => parseInt(c.enrollments_count) === 0
  );

  const totalEnrollments = courses.reduce(
    (sum, course) => sum + parseInt(course.enrollments_count),
    0
  );

  // Chart data configurations
  const courseData = {
    labels: coursesWithEnrollments.map(
      (course) => `${course.title} (${course.instructor_name})`
    ),
    datasets: [
      {
        label: "Enrollments",
        data: coursesWithEnrollments.map((course) =>
          parseInt(course.enrollments_count)
        ),
        backgroundColor: "#18547a",
      },
    ],
  };

  const usersData = {
    labels: ["Students", "Instructors"],
    datasets: [
      {
        label: "Users Count",
        data: [students.count, instructors.count],
        backgroundColor: ["#f97316", "#18547a"],
      },
    ],
  };

  const filteredProgress = allStudentsEnrollments.filter(
    (item) => item.progress > 50
  );

  const studentProgressChart = {
    labels: filteredProgress.map(
      (item) => `${item.student_name} (${item.course_title})`
    ),
    datasets: [
      {
        label: "Progress (%)",
        data: filteredProgress.map((item) => Math.round(item.progress)),
        backgroundColor: "#16a34a", // Green for good progress
      },
    ],
  };

  const commonChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        font: { size: 18 },
        color: "#18547a",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10 },
      },
    },
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-warning mb-3 no-print"
        style={{ fontWeight: "600", letterSpacing: "0.05em" }}
        onClick={() => window.print()}
      >
        🖨️ Print Report
      </button>

      <h3 style={{ color: "#f97316", fontWeight: "bold", marginBottom: "1rem" }}>
        📊 Course Enrollment Analytics
      </h3>

      <Bar data={courseData} options={{ ...commonChartOptions, plugins: { ...commonChartOptions.plugins, title: { ...commonChartOptions.plugins.title, text: "Course Enrollment Analytics" } } }} height={100} />

      <div className="mt-4">
        <h5 style={{ color: "#f97316", fontWeight: "bold", marginBottom: "0.75rem" }}>
          🚫 Courses Without Any Enrollment:
        </h5>
        {coursesWithoutEnrollments.length > 0 ? (
          <ul className="list-group">
            {coursesWithoutEnrollments.map((course) => (
              <li key={course.course_id} className="list-group-item">
                {course.title} ({course.instructor_name})
              </li>
            ))}
          </ul>
        ) : (
          <p>All courses have enrollments 🎉</p>
        )}
      </div>

      <div className="mt-4">
        <h5 style={{ color: "#f97316", fontWeight: "bold" }}>
          📦 Total Enrollments: {totalEnrollments}
        </h5>
      </div>

      <div className="mt-5">
        <h4 style={{ color: "#f97316", fontWeight: "bold", marginBottom: "1rem" }}>
          👤 Users Summary
        </h4>

        <Bar
          data={usersData}
          options={{
            ...commonChartOptions,
            indexAxis: "y",
            plugins: {
              ...commonChartOptions.plugins,
              title: {
                ...commonChartOptions.plugins.title,
                display: true,
                text: "Users Count",
              },
            },
          }}
          height={100}
        />

        <div className="row mt-4">
          <div className="col-md-6">
            <h5 style={{ color: "#18547a", fontWeight: "bold", marginBottom: "0.5rem" }}>
              📘 Students ({students.count})
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {students.names.map((name, idx) => (
                <span
                  key={idx}
                  className="badge rounded-pill bg-info text-white px-3 py-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <h5 style={{ color: "#18547a", fontWeight: "bold", marginBottom: "0.5rem" }}>
              📗 Instructors ({instructors.count})
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {instructors.names.map((name, idx) => (
                <span
                  key={idx}
                  className="badge rounded-pill bg-info text-white px-3 py-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h4 style={{ color: "#f97316", fontWeight: "bold", marginBottom: "1rem" }}>
          👥 All Students Enrollments & Progress
        </h4>

        {allStudentsEnrollments.length === 0 ? (
          <p>No student enrollments found.</p>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="table table-bordered table-hover" style={{ minWidth: "700px" }}>
                <thead className="table-light">
                  <tr>
                    <th>Student Name</th>
                    <th>Course Title</th>
                    <th>Enrolled At</th>
                    <th>Progress (%)</th>
                    <th>Completed At</th>
                  </tr>
                </thead>
                <tbody>
                  {allStudentsEnrollments.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.student_name}</td>
                      <td>{item.course_title}</td>
                      <td>{new Date(item.enrolled_at).toLocaleDateString()}</td>
                      <td>{Math.round(item.progress)}%</td>
                      <td>{item.completed_at ? new Date(item.completed_at).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5">
              <h4 style={{ color: "#f97316", fontWeight: "bold", marginBottom: "1rem" }}>
                📈 Students with Progress Greater than 50%
              </h4>
              <div style={{ maxWidth: "100%", overflowX: "auto", paddingBottom: "1rem" }}>
                <div style={{ width: `${Math.max(filteredProgress.length * 150, 600)}px` }}>
                  <Bar data={studentProgressChart} options={commonChartOptions} height={100} />
                </div>
              </div>
            </div>
          </>
        )}

        <section className="mt-5">
          <InstructorAnalytics courses={courses} students={students}  role="admin" />
        </section>
      </div>
    </div>
  );
};

export default AdminAnalytics;
