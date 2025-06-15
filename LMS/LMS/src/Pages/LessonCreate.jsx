
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const LessonCreate = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    module_id: moduleId,
    title: "",
    content_type: "video", // or 'text', 'quiz', etc.
    content: "",
    duration: "",
    order: "",
    is_free: false,
  });

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
      
      const response = await axios.post(
        `http://localhost:5000/lessons/${moduleId}`,
        form
      );

      const createdLesson = response.data;

console.log("createdLesson = response.data"+createdLesson.id);

      if (form.content_type === "quiz") {
        // الآن ننشئ اختبار جديد مربوط بالدرس الذي أنشأناه
        const quizResponse = await axios.post("http://localhost:5000/quizzes/", {
          lesson_id: createdLesson.id,max_score:5
        });

        const createdQuiz = quizResponse.data;
console.log("createdQuiz = response.data"+createdQuiz);

        alert("Lesson and quiz created successfully!");
        navigate(`/questions_create/${createdQuiz.id}`);
      } else {
        alert("Lesson created successfully!");
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating lesson.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Lesson</h2>
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
            placeholder="Text or video URL"
            rows="4"
            value={form.content?form.content:null}
            onChange={handleChange}
            disabled={form.content_type === "quiz"} // لأننا نحدد المحتوى تلقائياً لاحقاً
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

        <button type="submit" className="btn btn-primary">
          Create Lesson
        </button>
      </form>
    </div>
  );
};

export default LessonCreate;
