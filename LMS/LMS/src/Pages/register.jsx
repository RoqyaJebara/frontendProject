import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // التعامل مع تسجيل Google
  const handleGoogleResponse = async (response) => {
    const credential = response.credential;
    if (!credential) {
      setMessage("⚠ Failed to receive Google token.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth1/google/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`⚠ ${data.error || "Google registration failed."}`);
      } else {
        setMessage("✅ Registered successfully with Google!");
        setTimeout(() => {
          navigate("/student", { state: { userId: data.user.id } });
        }, 1500);
      }
    } catch (error) {
      console.error("Google registration error:", error);
      setMessage("⚠ An error occurred during Google registration.");
    }
  };

  // تحميل زر تسجيل Google (بعد التأكد من تحميل العنصر)
  useEffect(() => {
    if (window.google && window.google.accounts.id) {
      // ننتظر لحين رسم العنصر ثم نعرض الزر
      requestAnimationFrame(() => {
        const targetDiv = document.getElementById("googleSignUpDiv");
        if (targetDiv) {
          google.accounts.id.initialize({
            client_id: "389356347616-1dmsg5rh0ft9mekmql1bb3qdv53rffkr.apps.googleusercontent.com",
            callback: handleGoogleResponse,
          });

          google.accounts.id.renderButton(targetDiv, {
            theme: "outline",
            size: "large",
            width: "100%",
          });
        }
      });
    }
  }, []);

  // التسجيل عبر البريد وكلمة المرور
  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setMessage("⚠ Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password_hash: password,
          role: "student",
          oauth_provider: "LMS",
          oauth_id: '2',
          is_active: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`⚠ ${data.error || "Registration failed."}`);
      } else {
        setMessage("✅ Registered successfully!");
        form.reset();
        setTimeout(() => {
          navigate("/student", { state: { userId: data.user.id } });
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

      {/* زر Google */}
      <div id="googleSignUpDiv" className="mb-3 d-flex justify-content-center"></div>

      <p className="text-center mb-3">or register with email</p>

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

        {/* رسالة نجاح أو خطأ */}
        {message && (
          <div className={`mt-2 fw-bold ${message.startsWith("⚠") ? "text-danger" : "text-success"}`}>
            {message}
          </div>
        )}

        <div className="d-grid gap-2 mt-3">
          <button type="submit" className="btn btn-info text-white fw-bold">Register</button>
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
