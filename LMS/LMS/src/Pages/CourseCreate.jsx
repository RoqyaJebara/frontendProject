import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const CourseCreate = ({ onCreate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const instructorIdFromState = location.state?.instructorId || "";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor_id: instructorIdFromState,
    category_id: "",
    price: "",
    is_published: "false",
    is_approved: "false",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);

  // جديد: اسم المعلم فقط
  const [instructorName, setInstructorName] = useState("");

  useEffect(() => {
    // جلب التصنيفات فقط
    const fetchCategories = async () => {
      try {
        const catRes = await fetch("http://localhost:5000/categories");
        const categoriesData = await catRes.json();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // جلب اسم المعلم بناءً على instructor_id
  useEffect(() => {
    if (!instructorIdFromState) {
      setInstructorName("");
      return;
    }
    const fetchInstructorName = async () => {
      try {
        // استدعاء API لجلب بيانات المعلم حسب id
        const res = await fetch(`http://localhost:5000/users/${instructorIdFromState}`);
        if (!res.ok) throw new Error("Failed to fetch instructor");
        const data = await res.json();
        setInstructorName(data.name || "Unknown");
      } catch (error) {
        console.error("Error fetching instructor name:", error);
        setInstructorName("Unknown");
      }
    };
    fetchInstructorName();
  }, [instructorIdFromState]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, instructor_id: instructorIdFromState }));
  }, [instructorIdFromState]);

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

    if (!formData.instructor_id) {
      alert("Instructor ID is missing. Cannot create course.");
      return;
    }

    const dataToSend = {
      ...formData,
      is_published: "false",
      is_approved: "false",
    };

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

        {/* عرض اسم المعلم فقط بدون اختيار */}
        <div className="mb-2">
          <label className="form-label">Instructor</label>
          <input
            type="text"
            className="form-control"
            value={instructorName}
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
