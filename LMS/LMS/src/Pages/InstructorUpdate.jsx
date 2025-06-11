import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const InstructorUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, name, email, password_hash } = location.state || {};

  const [formData, setFormData] = useState({
    name: name || '',
    email: email || '',
    password: '', // جديد
  });

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!id) {
      setMessage('Invalid instructor data.');
    }
  }, [id]);

  const validatePassword = (password) => {
    if (!password) return true; // إذا ترك كلمة المرور فارغة => لا تحديث كلمة المرور
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return pattern.test(password);
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setMessage('Name and email are required.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      // بناء بيانات التحديث
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: 'instructor',
        is_active: true,
        oauth_provider: 'LMS',
        oauth_id: '2',
      };

      if (formData.password) {
        updateData.password_hash = formData.password;
      }

      await axios.put(`http://localhost:5000/users/${id}`, updateData);

      setMessage('✅ Instructor updated successfully!');
      setTimeout(() => {
        navigate('/admin');
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to update instructor.');
    }
  };

  return (
    <div className="container card mt-5 p-4">
      <h3 className="text-info fw-bold mb-4">Update Instructor</h3>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label fw-bold">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div className="mb-3 position-relative">
          <label className="form-label fw-bold">Password (leave empty to keep unchanged)</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
          <span
            onClick={toggleShowPassword}
            style={{
              position: 'absolute',
              right: '15px',
              top: '38px',
              cursor: 'pointer',
              userSelect: 'none',
              color: '#f97316'
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit" className="btn btn-info text-white fw-bold">
          Update Instructor
        </button>
      </form>
    </div>
  );
};
