import React, { useState, useEffect } from "react";

export const CourseEnrolled = ({
  courseName,
  course_thumbnail_url,
  course_category_id,
  initialCategoryName,
  progress,
}) => {
  const [categoryName, setCategoryName] = useState(initialCategoryName);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (!course_category_id || initialCategoryName !== "Uncategorized") return;

      try {
        const res = await fetch(`http://localhost:5000/categories/${course_category_id}`);
                // alert("fetch " );

        if (!res.ok) throw new Error("Failed to fetch category");
                // alert("!res.ok " );

        const data = await res.json();
        // alert("data.name "+data.name );
        
        setCategoryName(data.name || "Uncategorized");
      } catch {
        setCategoryName("Uncategorized");
      }
    };

    fetchCategoryName();
  }, [course_category_id, initialCategoryName]);

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
      <img
        src={`http://localhost:5000/uploads/${encodeURIComponent(course_thumbnail_url)}`}
        className="card-img-top object-fit-cover"
        style={{ height: "180px", objectFit: "cover" }}
        alt={courseName}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-semibold text-dark">{courseName}</h5>
        <p className="text-muted mb-2">
          {/* <span className="fw-medium">Category:</span> {categoryName} */}
        </p>
        <div className="mb-2">
          <div className="progress" style={{ height: "18px" }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
        </div>
        {progress === 100 && (
          <div className="mt-2 text-success fw-bold">✅ Course Completed</div>
        )}
      </div>
    </div>
  );
};
