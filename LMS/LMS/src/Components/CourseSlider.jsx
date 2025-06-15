import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_BASE = "http://localhost:5000";

const CourseSlider = ({ courses }) => {
  const navigate = useNavigate();

  const handleClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <>
      <h4 className="fw-bold mb-3 text-center" style={{ color: "#18547a" }}>
        Courses
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
        loop
      >
        {courses.map((course) => (
          <SwiperSlide key={course.id}>
            <div
              className="card border-0 shadow-sm h-100 cursor-pointer"
              onClick={() => handleClick(course.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`${API_BASE}/uploads/${encodeURIComponent(course.thumbnail_url)}`}
                className="card-img-top rounded-top"
                alt={course.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h6 className="text-primary fw-bold">{course.title}</h6>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default CourseSlider;
