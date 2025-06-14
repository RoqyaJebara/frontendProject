import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

export const Login = () => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // تفريغ الحقول عند تحميل الصفحة مع تأخير بسيط
  useEffect(() => {
    setTimeout(() => {
      if (emailRef.current) emailRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
    }, 50);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value.trim();
    const password_hash = passwordRef.current.value;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()+[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(password_hash)) {
      setMessage("⚠ Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password_hash }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`⚠ ${data.error || "Login failed"}`);
        return;
      }

      sessionStorage.setItem("user", JSON.stringify(data.user));
      setMessage("✅ Login successful!");

      // توجيه حسب الدور
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "instructor") navigate("/instructor");
      else if (data.user.role === "student") {
        navigate("/student", { state: { userId: data.user.id } });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("⚠ An error occurred during login.");
    }
  };

  return (
    <div className="login-box mt-5">
      <h3 className="text-center text-info mb-4">Login to Your Account</h3>
      <form onSubmit={handleLogin} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            ref={emailRef}
            autoComplete="off"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password_hash" className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password_hash"
              name="password_hash"
              ref={passwordRef}
              autoComplete="off"
              placeholder="Enter your password"
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
          <button type="submit" className="btn text-white btn-info fw-bold">
            Login
          </button>
        </div>
      </form>

      <div className="text-center mt-3">
        <small>
          Don't have an account?{" "}
          <Link to="/register" className="text-info fw-semibold">
            Register Now
          </Link>
        </small>
      </div>
    </div>
  );
};
