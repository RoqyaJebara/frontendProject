import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isActive = (path) => location.pathname === path;



  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };



  return (
    <header>
      <nav className="navbar navbar-expand-lg shadow-sm">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Left: Logo */}
          <div className="d-flex align-items-center">
            <Link className="navbar-brand d-flex align-items-center" to="/" aria-label="LMS Home">
              <img src={logo} width="90" alt="LMS Logo" />
              <span className="fw-bold color fs-4">Learning</span>
              <span className="fw-bold color fs-4 ms-1">Management</span>
              <span className="fw-bold color fs-4 ms-1">System</span>
            </Link>
          </div>

          {/* Right: Navigation */}
          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse show" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-lg-center">
                <li className="nav-item">
                  <Link className={`nav-link fs-5 fw-bold ${isActive("/") ? "text-info" : ""}`} to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link fs-5 fw-bold ${isActive("/courses") ? "text-info" : ""}`}
                    to="/courses"
                  >
                    Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link fs-5 fw-bold ${isActive("/contact") ? "text-info" : ""}`}
                    to="/contact"
                  >
                    Contact
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link fs-5 fw-bold ${isActive("/about") ? "text-info" : ""}`}
                    to="/about"
                  >
                    About
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  {user ? (
                    <button onClick={handleLogout} className="btn btn-info fw-bold text-white">
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className={`btn fw-bold text-white ${
                        isActive("/login") ? "btn-dark" : "btn-info"
                      }`}
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
