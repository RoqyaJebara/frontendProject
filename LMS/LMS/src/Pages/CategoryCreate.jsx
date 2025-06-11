import  { useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryCreate = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create category");
        return res.json();
      })
      .then(() => navigate("/admin"))
      .catch(console.error);
  };

  return (
    <div className="container mt-4">
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit}>
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
        <button className="btn btn-primary" type="submit">Create</button>
      </form>
    </div>
  );
};

export default CategoryCreate;
