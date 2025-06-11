import React, { useState } from "react";
import axios from "axios";

const LessonForm = ({ moduleId, lesson = {}, onSuccess }) => {
  const [title, setTitle] = useState(lesson.title || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lesson.id) {
      await axios.put(`http://localhost:5000/lessons/${lesson.id}`, { title });
    } else {
      await axios.post("http://localhost:5000/lessons", { module_id: moduleId, title });
    }
    setTitle("");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mb-1">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-control form-control-sm me-1"
        placeholder="Lesson title"
      />
      <button type="submit" className="btn btn-sm btn-secondary">{lesson.id ? "✏️" : "+"}</button>
    </form>
  );
};

export default LessonForm;
