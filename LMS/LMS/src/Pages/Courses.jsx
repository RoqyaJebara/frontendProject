import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.css"; // تأكد أن به تعريفات hover

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

  // فرضية: الدورات الجديدة هي التي تم إضافتها مؤخراً
  // هنا نفترض أن الكائن course يحتوي على حقل created_at (تاريخ الإضافة)
  // إن لم يكن، يمكن تعديل حسب الـ API أو منطق تحديد الدورات الجديدة
  const newCourses = availableCourses
    .filter(course => {
      // تصفية حسب معايير جديدة (مثلاً أحدث 5 دورات)
      // أو فلترة حسب created_at إن كانت متوفرة
      return true; // ضع شرط هنا حسب متطلباتك
    })
    .slice(0, 5); // أحدث 5 دورات

  // باقي الدورات بدون الدورات الجديدة
  const otherCourses = availableCourses.filter(course => !newCourses.includes(course));

  // تطبيق البحث على otherCourses
  const filteredOtherCourses = otherCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      {renderCategories()}

      <div className="my-3 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search courses by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* سلايدر الدورات الجديدة */}
      {newCourses.length > 0 && (
        <>
          <h4 className="fw-bold mb-3 text-center" style={{ color: "#18547a" }}>
            New Courses
          </h4>
         <Swiper
  modules={[Navigation, Pagination, Autoplay]}
  navigation
  pagination={{ clickable: true }}
  autoplay={{ delay: 4000 }}
  spaceBetween={20}
  slidesPerView={3}
  breakpoints={{
    320: { slidesPerView: 1 },
    640: { slidesPerView: 2 },
    992: { slidesPerView: 3 },
  }}
  loop={true}
>
  {newCourses.map((course) => {
    const instructorName = course.instructor_name || "Unknown Instructor"; // Adjust based on your data

    return (
      <SwiperSlide key={course.id}>
        <div className="position-relative course-slide group h-100">
          <Link to={`/course/${course.id}`} className="text-decoration-none">
            <div className="card border-0 shadow-sm h-100 d-flex flex-column align-items-center">
              <img
                src={`http://localhost:5000/uploads/${encodeURIComponent(course.thumbnail_url)}`}
                className="card-img-top"
                alt={course.title}
                height={200}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
              <div className="card-body pt-2 text-center">
                <p className="text-muted small mb-0">{instructorName}</p>
              </div>
            </div>
          </Link>
        </div>
      </SwiperSlide>
    );
  })}
</Swiper>

        </>
      )}

      {/* قائمة الدورات الأخرى */}
      <h4 className="fw-bold my-4 text-center" style={{ color: "#18547a" }}>
        {activeCategory
          ? `Courses in "${categories.find((c) => c.id === activeCategory)?.name || ""}"`
          : "All Available Courses"}
      </h4>

      {filteredOtherCourses.length === 0 ? (
        <p className="text-center">No courses available.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredOtherCourses.map((course) => (
            <div key={course.id} className="col">
              <div className="position-relative course-slide group h-100">
                <Link to={`/course/${course.id}`} className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100">
                    <img
                      src={`http://localhost:5000/uploads/${encodeURIComponent(course.thumbnail_url)}`}
                      className="card-img-top"
                      alt={course.title}
                      height={200}
                      style={{ objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title text-truncate">{course.title}</h5>
                      <p className="text-muted small mb-1">
                        Category: {categories.find((c) => c.id === course.category_id)?.name}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Hover Description */}
                <div className="hover-description position-absolute top-0 start-0 w-100 h-100 text-white bg-dark bg-opacity-75 p-3 d-flex flex-column justify-content-center align-items-center text-center opacity-0 group-hover-opacity">
                  <p className="small mb-3">{course.description}</p>
                  <button
                    className="btn btn-sm btn-info fw-bold"
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

export default Courses;
