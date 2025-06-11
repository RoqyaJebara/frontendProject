import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ أضف useNavigate
import axios from 'axios';

export const ModuleCreate = () => {
  const { courseId } = useParams();
  const navigate = useNavigate(); // ✅ استدعاء useNavigate
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newModule = {
      course_id: parseInt(courseId),
      title,
      description,
      order,
    };

    try {
      await axios.post(`http://localhost:5000/modules/${courseId}`, newModule);
      alert("Module added successfully!");
      navigate(`/course_editor/${courseId}`); // ✅ بعد الإضافة الناجحة، الانتقال
    } catch (error) {
      console.error("Error adding module:", error);
      alert("Failed to add module.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5 border rounded shadow-sm bg-light">
      <h5 className="mb-3 text-primary">Add Module to Course #{courseId}</h5>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Order</label>
        <input
          type="number"
          className="form-control"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          min={1}
          required
        />
      </div>

      <button type="submit" className="btn btn-success">
        Add Module
      </button>
    </form>
  );
};
