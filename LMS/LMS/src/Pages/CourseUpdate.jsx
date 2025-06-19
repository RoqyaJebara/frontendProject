import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export const CourseUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const instructorIdFromLink = location.state?.instructorId || "";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor_id: instructorIdFromLink,
    category_id: "",
    price: "",
    is_published: "false", // نص وليس boolean
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);

  // Fetch current course data + instructors + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes, instRes] = await Promise.all([
          fetch(`http://localhost:5000/courses/${id}`),
          fetch("http://localhost:5000/categories"),
          fetch("http://localhost:5000/users/role/instructors"),
        ]);

        const courseData = await courseRes.json();
        const categoriesData = await catRes.json();
        const instructorsData = await instRes.json();

        setFormData({
          title: courseData.title,
          description: courseData.description,
          instructor_id: courseData.instructor_id,
          category_id: courseData.category_id,
          price: courseData.price,
          is_published: courseData.is_published || "false", // نص كما هو
        });

        // setPreview(`http://localhost:5000/uploads/${courseData.thumbnail_url}`);

        setCategories(categoriesData);
        setInstructors(instructorsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // عند تغيير checkbox: نخزن "true" أو "false" نصيًا
      setFormData((prev) => ({
        ...prev,
        [name]: checked ? "true" : "false",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formPayload = new FormData();

  // تأكد من إرسال is_published = "true" دائماً
  for (const key in formData) {
    if (key === "is_published") {
      formPayload.append(key, "true");
    } else {
      formPayload.append(key, formData[key]);
    }
  }

  if (thumbnailFile) {
    formPayload.append("thumbnail", thumbnailFile);
  }

  try {
    const response = await fetch(`http://localhost:5000/courses/${id}`, {
      method: "PUT",
      body: formPayload,
    });

    if (response.ok) {
      alert("✅ Course updated successfully!");
      navigate("/instructor");
    } else {
      alert("❌ Failed to update course.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error occurred while updating course.");
  }
};


  return (
    <div className="container card p-4 my-5">
      <h4 className="mb-3 text-info">✏️ Update Course</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Instructor</label>

          <input
            type="text"
            name="instructor_id"
            className="form-control"
            value={
              instructors.find((inst) => inst.id === formData.instructor_id)
                ?.name || ""
            }
            disabled
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Category</label>
          <select
            name="category_id"
            className="form-select"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="form-label">Price (JD)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Thumbnail Image</label>
          <input
            type="file"
            name="thumbnail"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="mb-3">
            <img src={preview} alt="Preview" width={200} />
          </div>
        )}

        <div className="form-check mb-2">
          <input
            type="checkbox"
            name="is_published"
            className="form-check-input"
            checked={formData.is_published === "true"} // 
            onChange={handleChange}
          />
          <label className="form-check-label">Published</label>
        </div>

        <button type="submit" className="btn btn-info">
          Update Course
        </button>
      </form>
    </div>
  );
};
