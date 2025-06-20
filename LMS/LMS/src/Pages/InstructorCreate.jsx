import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const InstructorCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    // كلمة مرور تحتوي على: 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return pattern.test(password);
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setMessage('All fields are required.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password_hash: formData.password, // إرسال كلمة المرور كـ password_hash
        role: 'instructor',
        is_active: true,
        oauth_provider: 'LMS',
        oauth_id: '2',
      });

      setMessage('✅ Instructor added successfully!');

      setTimeout(() => {
        setFormData({ name: '', email: '', password: '' });
        setMessage('');
        navigate('/admin');
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to add instructor.');
    }
  };

  return (
    <div className="container card mt-5 p-4">
      <h3 className="text-info fw-bold mb-4">Add New Instructor</h3>
      
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
          <label className="form-label fw-bold">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
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
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#f97316" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="#fff"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#f97316" viewBox="0 0 16 16">
                <path d="M13.359 11.238a7.713 7.713 0 0 0 1.26-1.272c-1.487-2.645-4.57-5.3-7.619-5.3-.997 0-1.89.251-2.626.639L1.223 1.607 0 2.83l2.518 2.518C1.33 6.945.575 7.985.575 8c0 .05.054.71.893 1.773L.002 11.237l1.223 1.223 2.635-2.635a7.16 7.16 0 0 0 3.499 1.088c2.456 0 4.576-1.27 5.645-2.675l-1.282-1.7zM8 10.5a2.5 2.5 0 0 1-2.322-3.25l3.573 3.573A2.481 2.481 0 0 1 8 10.5z"/>
              </svg>
            )}
          </span>
        </div>

        <button type="submit" className="btn btn-info text-white fw-bold">
          Add Instructor
        </button>
      </form>
    </div>
  );
};
