import React, { useState } from "react";
import axios from "axios";

const ModuleForm = ({ courseId, module = {}, onSuccess }) => {
  const [title, setTitle] = useState(module.title || "");
  const [description, setDescription] = useState(module.description || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (module.id) {
      await axios.put(`http://localhost:5000/modules/${module.id}`, { title, description });
    } else {
      await axios.post("http://localhost:5000/modules", { course_id: courseId, title, description });
    }
    setTitle("");
    setDescription("");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mb-1">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-control form-control-sm me-1"
        placeholder="Module title"
      />
      <button type="submit" className="btn btn-sm btn-primary">{module.id ? "✏️" : "+"}</button>
    </form>
  );
};

export default ModuleForm;
