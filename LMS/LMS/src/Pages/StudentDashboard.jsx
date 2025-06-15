import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { CourseEnrolled } from "../Components/CourseEnrolled";
import StudentSidebar from "../Components/StudentSidebar";

export const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || null;

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeSection, setActiveSection] = useState("allCourses");
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleNavigate = (courseId) => {
    navigate(`/student_course/${courseId}`, { state: { userId } });
  };

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/users/${userId}`)
      .then((res) => res.json())
      .then((data) =>
        setStudentName(data.name || `${data.first_name} ${data.last_name}`)
      )
      .catch(() => setStudentName("Student"));
  }, [userId]);

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (activeSection === "enrolledCourses") {
      setAvailableCourses([]);
      return;
    }

    let url =
      "http://localhost:5000/courses?is_published=true&is_approved=true";
    if (activeCategory !== null) {
      const id = parseInt(activeCategory);
      url = `http://localhost:5000/courses/category/${id}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then(setAvailableCourses)
      .catch(() => setAvailableCourses([]));
  }, [activeCategory, activeSection]);

  useEffect(() => {
    if (
      !userId ||
      (activeSection !== "enrolledCourses" && activeSection !== "allCourses")
    ) {
      setEnrolledCourses([]);
      return;
    }

    fetch(`http://localhost:5000/enrollments/${userId}`)
      .then((res) => res.json())
      .then((data) =>
        setEnrolledCourses(Array.isArray(data) ? data : data ? [data] : [])
      )
      .catch(() => setEnrolledCourses([]));
  }, [userId, activeSection]);

  const enroll = async (course) => {
    if (
      enrolledCourses.find((c) => c.course_id === course.id) ||
      enrollingCourseId === course.id
    )
      return;

    setEnrollingCourseId(course.id);
    try {
      await fetch("http://localhost:5000/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, userId }),
      });

      setEnrolledCourses((prev) => [
        ...prev,
        {
          enrollment_id: Date.now(),
          user_id: userId,
          course_id: course.id,
          progress: 0,
          title: course.title,
          description: course.description,
          thumbnail_url: course.thumbnail_url,
          category_id: course.category_id,
        },
      ]);
    } catch {
      alert("Enrollment failed. Please try again.");
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const updateProgress = (courseId, amount) => {
    setEnrolledCourses((prev) =>
      prev.map((course) =>
        course.course_id === courseId
          ? { ...course, progress: Math.min(course.progress + amount, 100) }
          : course
      )
    );
  };

  const renderCategories = () => (
    <div className="mb-4">
      <h5 className="fw-bold" style={{ color: "#18547a" }}>
        Categories
      </h5>
      <div className="d-flex flex-wrap gap-2">
        <button
          className={`btn btn-sm ${
            activeCategory === null ? "btn-info" : "btn-outline-info"
          }`}
          onClick={() => {
            setActiveCategory(null);
            setSearchTerm("");
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`btn btn-sm ${
              activeCategory === cat.id ? "btn-info" : "btn-outline-info"
            }`}
            onClick={() => {
              setActiveCategory(cat.id);
              setSearchTerm("");
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSearchBar = () => (
    <div className="my-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search courses by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );

  const renderContent = () => {
    const filteredCourses = (
      activeSection === "enrolledCourses" ? enrolledCourses : availableCourses
    ).filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeSection === "enrolledCourses") {
      return (
        <>
          <h4 className="fw-bold mb-4" style={{ color: "#18547a" }}>
            Enrolled Courses
          </h4>
          {renderSearchBar()}
          {filteredCourses.length === 0 ? (
            <p>No enrolled courses found.</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {filteredCourses.map((course) => {
                const category = categories.find(
                  (c) => c.id === course.category_id
                );
                return (
                  <div
                    key={course.enrollment_id}
                    onClick={() => handleNavigate(course.course_id)}
                    style={{
                      color: "#f97316",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    <CourseEnrolled
                      courseName={course.title}
                      course_thumbnail_url={course.thumbnail_url}
                      courseId={course.course_id}
                      course_category_id={course.category_id}
                      progress={course.progress}
                      updateProgress={(amount) =>
                        updateProgress(course.course_id, amount)
                      }
                      categoryName={category ? category.name : "Uncategorized"}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      );
    }

    return (
      <>
        {renderCategories()}
        {renderSearchBar()}
        <h4 className="fw-bold mb-3" style={{ color: "#18547a" }}>
          {activeCategory
            ? `Courses in "${
                categories.find((c) => c.id === activeCategory)?.name
              }"`
            : "All Available Courses"}
        </h4>
        {filteredCourses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
            {filteredCourses.map((course) => {
              const isAlreadyEnrolled = enrolledCourses.some(
                (c) => c.course_id === course.id
              );
              return (
                <div key={course.id} className="col">
                  <div
                    className="card shadow-sm border-0 d-flex flex-column"
                    style={{ height: "450px" }} // يمكنك تعديل الرقم حسب حاجتك
                  >
                    <img
                      src={`http://localhost:5000/uploads/${encodeURIComponent(
                        course.thumbnail_url
                      )}`}
                      className="card-img-top w-100"
                      style={{ height: "200px", objectFit: "cover" }}
                      alt={course.title}
                    />

                    <div className="card-body overflow-auto">
                      <h5 className="card-title text-truncate">
                        {course.title}
                      </h5>
                      <p
                        className="card-text small text-truncate"
                        title={course.description}
                      >
                        {course.description}
                      </p>
                      <p className="text-muted small mb-0">
                        Category:{" "}
                        {categories.find((c) => c.id === course.category_id)
                          ?.name || "Uncategorized"}
                      </p>
                    </div>

                    <div className="card-footer bg-white border-0 mt-auto">
                      <button
                        className="btn w-100 fw-bold"
                        style={{
                          backgroundColor: isAlreadyEnrolled
                            ? "#ccc"
                            : "#18547a",
                          color: "#c7f6f4",
                          cursor: isAlreadyEnrolled ? "not-allowed" : "pointer",
                        }}
                        onClick={() => !isAlreadyEnrolled && enroll(course)}
                        disabled={
                          isAlreadyEnrolled || enrollingCourseId === course.id
                        }
                      >
                        {isAlreadyEnrolled
                          ? "Enrolled"
                          : enrollingCourseId === course.id
                          ? "Enrolling..."
                          : "Enroll"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="d-flex">
      <StudentSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="container" style={{ maxWidth: "900px" }}>
        <h1 className="fw-bold mb-4 text-center" style={{ color: "#18547a" }}>
          🎓 {studentName}'s Dashboard
        </h1>
        {renderContent()}
      </div>
    </div>
  );
};
