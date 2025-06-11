import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

export const Register = () => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const role = "student";
    const oauth_provider = "LMS";
    const oauth_id = "2";
    const is_active = true;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setMessage(
        "⚠ Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password_hash: password,
          role,
          oauth_provider,
          oauth_id,
          is_active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`⚠ ${data.error || "Registration failed."}`);
      } else {
        setMessage("✅ Registered successfully!");
        form.reset();

        // ✅ توجيه مباشر إلى /student بعد نجاح التسجيل
        setTimeout(() => {
          navigate("/student");
        }, 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("⚠ An error occurred during registration.");
    }
  };

  return (
    <div className="login-box mt-5">
      <h3 className="text-center text-info mb-4">Create Your Account</h3>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input type="text" className="form-control" id="name" name="name" placeholder="John Doe" required />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" placeholder="you@example.com" required />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              name="password"
              placeholder="Create your password"
              required
            />
            <span
              className="input-group-text bg-white"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>
        </div>

        {message && (
          <div className={`mt-2 fw-bold ${message.startsWith("⚠") ? "text-danger" : "text-success"}`}>
            {message}
          </div>
        )}

        <div className="d-grid gap-2 mt-3">
          <button type="submit" className="btn btn-info text-white fw-bold">
            Register
          </button>
        </div>
      </form>

      <div className="text-center mt-3">
        <small>
          Already have an account?{" "}
          <Link to="/login" className="text-info fw-semibold">Login</Link>
        </small>
      </div>
    </div>
  );
};
