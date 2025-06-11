import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const LessonUpdate = () => {
  const { lessonId } = useParams();
  const location = useLocation();
  const moduleId = location.state?.moduleId || null;

  const navigate = useNavigate();

  const [form, setForm] = useState({
    module_id: moduleId,
    title: "",
    content_type: "video",
    content: "",
    duration: "",
    order: "",
    is_free: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/lessons/lesson/${lessonId}`)
      .then((res) => {
        // إذا كانت الاستجابة تحتوي الدرس مباشرة
        const lessonData = res.data;
        // أو لو كانت داخل كائن: const lessonData = res.data.lesson;

        setForm({
          module_id: lessonData.module_id || moduleId,
          title: lessonData.title || "",
          content_type: lessonData.content_type || "video",
          content: lessonData.content || "",
          duration: lessonData.duration || "",
          order: lessonData.order || "",
          is_free: lessonData.is_free !== undefined ? lessonData.is_free : true,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lesson:", err);
        setLoading(false);
      });
  }, [lessonId, moduleId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/lessons/${lessonId}`, form);
      alert("Lesson updated successfully!");
      navigate(-1); // العودة للصفحة السابقة
    } catch (err) {
      console.error(err);
      alert("Error updating lesson.");
    }
  };

  if (loading)
    return <div className="container mt-5">Loading lesson data...</div>;

  return (
    <div className="container mt-5">
      <h2>Update Lesson # {lessonId}</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content Type</label>
          <select
            className="form-select"
            name="content_type"
            value={form.content_type}
            onChange={handleChange}
          >
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            name="content"
            rows="4"
            value={form.content}
            onChange={handleChange}
            disabled={form.content_type === "quiz"} // هنا تعطيل المحتوى إذا كان النوع quiz
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Duration (in minutes)</label>
          <input
            type="number"
            className="form-control"
            name="duration"
            value={form.duration}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Order</label>
          <input
            type="number"
            className="form-control"
            name="order"
            value={form.order}
            onChange={handleChange}
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="is_free"
            checked={form.is_free}
            onChange={handleChange}
          />
          <label className="form-check-label">Is Free</label>
        </div>

        <button type="submit" className="btn btn-warning">
          Update Lesson
        </button>
      </form>
    </div>
  );
};

export default LessonUpdate;
