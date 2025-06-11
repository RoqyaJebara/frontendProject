import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CategoryUpdate = () => {
  const { state } = useLocation(); // يحمل الفئة من الصفحة السابقة
  const [name, setName] = useState(state?.name || "");
  const navigate = useNavigate();

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/categories/${state.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update category");
        return res.json();
      })
      .then(() => navigate("/admin"))
      .catch(console.error);
  };

  return (
    <div className="container mt-4">
      <h2>Edit Category</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-info" type="submit">Update</button>
      </form>
    </div>
  );
};

export default CategoryUpdate;
