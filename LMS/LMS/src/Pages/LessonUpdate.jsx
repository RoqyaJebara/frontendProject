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
    questions: [],
  });

  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonRes = await axios.get(`http://localhost:5000/lessons/lesson/${lessonId}`);
        const questionRes = await axios.get(`http://localhost:5000/questions/${lessonId}`);

        setForm({
          module_id: lessonRes.data.module_id || moduleId,
          title: lessonRes.data.title || "",
          content_type: lessonRes.data.content_type || "video",
          content: lessonRes.data.content || "",
          duration: lessonRes.data.duration || "",
          order: lessonRes.data.order || "",
          is_free: lessonRes.data.is_free !== undefined ? lessonRes.data.is_free : true,
          questions: questionRes.data.questions || [],
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, moduleId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index][key] = value;
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...form.questions];
    updated[qIndex].options[optIndex] = value;
    setForm({ ...form, questions: updated });
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correct_answer: "",
        },
      ],
    }));
  };

  const removeQuestion = async (index) => {
    const questionToRemove = form.questions[index];

    if (questionToRemove.id) {
      try {
        await axios.delete(`http://localhost:5000/questions/${questionToRemove.id}`);
        const updated = [...form.questions];
        updated.splice(index, 1);
        setForm({ ...form, questions: updated });

        setDeleteMessage("✅ تم حذف السؤال بنجاح");
        setTimeout(() => setDeleteMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("فشل في حذف السؤال.");
      }
    } else {
      const updated = [...form.questions];
      updated.splice(index, 1);
      setForm({ ...form, questions: updated });

      setDeleteMessage("✅ تم حذف السؤال بنجاح");
      setTimeout(() => setDeleteMessage(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/lessons/${lessonId}`, form);

      if (form.content_type === "quiz") {
        const updatedQuestions = [];

        for (const q of form.questions) {
          if (q.id) {
            await axios.put(`http://localhost:5000/questions/${q.id}`, {
              question: q.question,
              options: q.options,
              correct_answer: q.correct_answer,
              lessonId: lessonId,
            });
            updatedQuestions.push(q);
          } else {
            const res = await axios.post(`http://localhost:5000/questions/`, {
              question: q.question,
              options: q.options,
              correct_answer: q.correct_answer,
              lessonId: lessonId,
            });
            updatedQuestions.push(res.data);
          }
        }

        setForm((prev) => ({ ...prev, questions: updatedQuestions }));
      }

      alert("Lesson and questions updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error updating lesson or questions.");
    }
  };

  if (loading) return <div className="container mt-5">Loading lesson data...</div>;

  return (
    <div className="container mt-5">
      <h2>Update Lesson #{lessonId}</h2>
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
            disabled={form.content_type === "quiz"}
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

        {form.content_type === "quiz" && (
          <div className="mb-4">
            <label className="form-label fw-bold">Quiz Questions</label>

            {deleteMessage && (
              <div className="alert alert-success text-center" role="alert">
                {deleteMessage}
              </div>
            )}

            {form.questions.map((q, index) => (
              <div key={index} className="border rounded p-3 mb-3">
                <div className="mb-2">
                  <label className="form-label">Question {index + 1}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                  />
                </div>

                <label className="form-label">Options</label>
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    className="form-control mb-1"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                  />
                ))}

                <div className="mb-2">
                  <label className="form-label">Correct Answer</label>
                  <input
                    type="text"
                    className="form-control"
                    value={q.correct_answer}
                    onChange={(e) => handleQuestionChange(index, "correct_answer", e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeQuestion(index)}
                >
                  Remove Question
                </button>
              </div>
            ))}

            <button type="button" className="btn btn-secondary" onClick={addQuestion}>
              + Add Question
            </button>
          </div>
        )}

        <button type="submit" className="btn btn-warning">
          Update Lesson
        </button>
      </form>
    </div>
  );
};

export default LessonUpdate;
