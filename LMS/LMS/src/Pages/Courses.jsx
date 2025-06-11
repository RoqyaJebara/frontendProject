import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Courses component – lists all available courses filtered by category.
 *
 * Props
 * -----
 * @param {string}   activeSection       – either "allCourses" or "enrolledCourses" (defaults to "allCourses").
 * @param {Function} enroll              – callback invoked with a course object when a user clicks the Enroll button.
 * @param {number}   enrollingCourseId   – id of the course currently being enrolled (used to disable the button while waiting).
 */
export const Courses = ({ activeSection = "allCourses", enroll = () => {}, enrollingCourseId = null }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  // Fetch categories once on mount
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

  // Fetch courses when category or section changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Skip fetching if we are on the "enrolledCourses" section – that list is handled elsewhere.
        if (activeSection === "enrolledCourses") {
          setAvailableCourses([]);
          return;
        }

        let url = "http://localhost:5000/courses?is_published=true&is_approved=true";

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

  /* --------------------------------- RENDERING -------------------------------- */
  const renderCategories = () => (
    <div className="mb-4">
      <h5 className="fw-bold" style={{ color: "#18547a" }}>
        Categories
      </h5>
      <div className="d-flex flex-wrap gap-2">
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

  return (
    <div className="container mt-5">
      {renderCategories()}

      <h4 className="fw-bold mb-3" style={{ color: "#18547a" }}>
        {activeCategory
          ? `Courses in "${categories.find((c) => c.id === activeCategory)?.name || ""}"`
          : "All Available Courses"}
      </h4>

      {availableCourses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div className=" row row-cols-1 row-cols-md-3 g-4 mb-5">
          {availableCourses.map((course) => (
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
                      Category: {categories.find((c) => c.id === course.category_id)?.name || "Uncategorized"}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <button
                      className="btn w-100 fw-bold btn-info"
                      onClick={() => enroll(course)}
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
