import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export const ModuleEdit = () => {
  const { moduleId } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();

  const courseId = location.state?.courseId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !moduleId) {
      alert("Missing course ID or module ID");
      navigate("/dashboard");
      return;
    }

    const fetchModule = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/modules/module/${moduleId}`);
        const moduleData = response.data;
        setTitle(moduleData.title);
        setDescription(moduleData.description);
        setOrder(moduleData.order);
      } catch (error) {
        console.error("Error fetching module data:", error.response?.data || error.message);
        alert("Failed to load module data.");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [courseId, moduleId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedModule = {
      course_id: parseInt(courseId),
      title,
      description,
      order,
    };

    try {
      await axios.put(`http://localhost:5000/modules/${moduleId}`, updatedModule);
      alert("Module updated successfully!");
      navigate(`/course_editor/${courseId}`);
    } catch (error) {
      console.error("Error updating module:", error.response?.data || error.message);
      alert("Failed to update module.");
    }
  };

  if (loading) return <p>Loading module data...</p>;

  return (
    <form onSubmit={handleSubmit} className="container mt-5 border rounded shadow-sm bg-light p-4">
      <h5 className="mb-3 text-primary">Edit Module #{moduleId} for Course #{courseId}</h5>

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

      <button type="submit" className="btn btn-primary me-2">Update Module</button>
     
    </form>
  );
};
