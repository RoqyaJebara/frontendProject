import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../Components/CourseSlider.css";

const API_BASE = "http://localhost:5000";

export const Courses = () => {
  const [sliderCourses, setSliderCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch slider courses once
  useEffect(() => {
    async function fetchSliderCourses() {
      try {
        const res = await fetch(`${API_BASE}/courses?is_published=true&is_approved=true`);
        const data = await res.json();
        const shuffled = data.sort(() => 0.5 - Math.random());
        setSliderCourses(shuffled.slice(0, 10));
      } catch (err) {
        console.error("Error fetching slider courses:", err);
        setSliderCourses([]);
      }
    }
    fetchSliderCourses();
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Fetch available courses based on search or category
  useEffect(() => {
    let url = `${API_BASE}/courses?is_published=true&is_approved=true`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (searchTerm) {
          const filtered = data.filter(
            (course) =>
              course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setAvailableCourses(filtered);
        } else if (activeCategory !== null) {
          const filtered = data.filter((course) => course.category_id === activeCategory);
          setAvailableCourses(filtered);
        } else {
          setAvailableCourses(data);
        }
      })
      .catch(() => setAvailableCourses([]));
  }, [searchTerm, activeCategory]);

  const handleEnroll = (course) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first to enroll in a course.");
      window.location.href = "/login";
      return;
    }
    alert(`Enrolled in course: ${course.title}`);
  };

  const renderCategories = () => (
    <div className="d-flex justify-content-center mt-5 mb-4">
      <div className="text-center">
        <h5 className="fw-bold" style={{ color: "#18547a" }}>
          Categories
        </h5>
        <div className="d-flex flex-wrap justify-content-center gap-2">
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
    </div>
  );

  return (
    <div className="container my-5">
      
 <div className="mb-1 text-center">
        <input
          type="text"
          className="form-control w-50 mx-auto border border-info"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
            {renderCategories()}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        }}
        loop
      >
        {sliderCourses.map((course) => (
          <SwiperSlide key={course.id}>
            <div
              className="course-slide position-relative cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleEnroll(course)}
              style={{ overflow: "hidden", borderRadius: "8px" }}
            >
              <img
                src={`${API_BASE}/uploads/${encodeURIComponent(course.thumbnail_url)}`}
                alt={course.title}
                style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
              />
              <div className="course-detail-overlay d-flex flex-column justify-content-center align-items-center text-white p-3">
                <h5 className="mb-2">{course.title}</h5>
                <h6 className="mb-1">Instructor: {course.instructor_name || "Unknown"}</h6>
                <p className="small text-center">{course.description}</p>
                <button
                  className="btn btn-sm btn-outline-light mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnroll(course);
                  }}
                >
                  Enroll
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <hr className="my-4" />

    

 

      <div className="row mt-4">
        {availableCourses.length === 0 && (
          <p className="text-center">No courses found.</p>
        )}
        {availableCourses.map((course) => (
          <div className="col-md-4 mb-4" key={course.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={`${API_BASE}/uploads/${encodeURIComponent(course.thumbnail_url)}`}
                className="card-img-top"
                alt={course.title}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text small">{course.description}</p>
               
               
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEnroll(course)}>
                  Enroll
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
