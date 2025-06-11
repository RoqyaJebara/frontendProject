import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CourseCreate = ({ onCreate }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor_id: "",
    category_id: "",
    price: "",
    is_published: "false",
    is_approved: "false"
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, instRes] = await Promise.all([
          fetch("http://localhost:5000/categories"),
          fetch("http://localhost:5000/users/role/instructors"),
        ]);

        const categoriesData = await catRes.json();
        const instructorsData = await instRes.json();

        setCategories(categoriesData);
        setInstructors(instructorsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = { ...formData, is_published: "false" ,is_approved:"false"};

    const formPayload = new FormData();
    for (const key in dataToSend) {
      formPayload.append(key, dataToSend[key]);
    }
    if (thumbnailFile) {
      formPayload.append("thumbnail", thumbnailFile);
    }

    try {
      const response = await fetch("http://localhost:5000/courses", {
        method: "POST",
        body: formPayload,
      });

      if (response.ok) {
        alert("✅ Course created!");
        if (onCreate) onCreate(formData);
        navigate("/instructor");
      } else {
        alert("❌ Failed to create course.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error occurred while creating course.");
    }
  };

  return (
    <div className="container card p-4 mb-4 mt-5">
      <h4 className="mb-3 text-success">➕ Add New Course</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-2">
          <label className="form-label">Course Title</label>
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
          <select
            name="instructor_id"
            className="form-select"
            value={formData.instructor_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Instructor --</option>
            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
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
            required
          />
        </div>

        {preview && (
          <div className="mb-3">
            <img src={preview} alt="Preview" width={200} />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Create Course
        </button>
      </form>
    </div>
  );
};
