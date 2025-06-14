import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export const Courses = ({
  activeSection = "allCourses",
  enroll = () => {},
  enrollingCourseId = null,
}) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/categories");
        if (!res.ok) throw new Error("Network error while fetching categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (activeSection === "enrolledCourses") {
          setAvailableCourses([]);
          return;
        }

        let url =
          "http://localhost:5000/courses?is_published=true&is_approved=true";
        if (activeCategory !== null) {
          const activeCategoryId = Number(activeCategory);
          url = `http://localhost:5000/courses/category/${activeCategoryId}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Network error while fetching courses");
        const data = await res.json();
        setAvailableCourses(data);
      } catch (err) {
        console.error(err);
        setAvailableCourses([]);
      }
    };
    fetchCourses();
  }, [activeCategory, activeSection]);

  const renderCategories = () => (
    <div className="mb-4 text-center">
      <h5 className="fw-bold" style={{ color: "#18547a" }}>Categories</h5>
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        <button
          className={`btn btn-sm ${activeCategory === null ? "btn-info" : "btn-outline-info"}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`btn btn-sm ${activeCategory === cat.id ? "btn-info" : "btn-outline-info"}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );

  const filteredCourses = availableCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      {renderCategories()}

      {/* 🔍 Search bar centered */}
      <div className="my-3 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search courses by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h4 className="fw-bold mb-3 text-center" style={{ color: "#18547a" }}>
        {activeCategory
          ? `Courses in "${categories.find((c) => c.id === activeCategory)?.name || ""}"`
          : "All Available Courses"}
      </h4>

      {filteredCourses.length === 0 ? (
        <p className="text-center">No courses available.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
          {filteredCourses.map((course) => (
            <div key={course.id} className="col">
              <div className="card shadow-sm border-0 h-100">
                <img
                  src={`http://localhost:5000/uploads/${encodeURIComponent(course.thumbnail_url)}`}
                  className="card-img-top object-fit-cover"
                  width={300}
                  height={200}
                  alt={course.title}
                />
                <div className="card-body d-flex flex-column">
                  <div>
                    <h5 className="card-title text-truncate">{course.title}</h5>
                    <p className="card-text small">{course.description}</p>
                    <p className="text-muted small mb-2">
                      Category:{" "}
                      {categories.find((c) => c.id === course.category_id)?.name || "Uncategorized"}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <button
                      className="btn w-100 fw-bold btn-info"
                      onClick={() => {
                        const userId = localStorage.getItem("userId");
                        if (!userId) {
                          alert("Please login first to enroll in a course.");
                          window.location.href = "/login";
                          return;
                        }
                        enroll(course);
                      }}
                      disabled={enrollingCourseId === course.id}
                    >
                      {enrollingCourseId === course.id ? "Enrolling..." : "Enroll"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Courses.propTypes = {
  activeSection: PropTypes.string,
  enroll: PropTypes.func,
  enrollingCourseId: PropTypes.number,
};
