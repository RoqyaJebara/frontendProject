import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header>
      <nav className="navbar navbar-expand-lg shadow-sm">
        <div className="container-fluid "  >
          <Link className="navbar-brand" to="/" aria-label="LMS Home">
            <img src={logo} width="90" alt="LMS Logo" />
            <span className="fw-bold color fs-4">Learning</span>
            <span className="fw-bold color fs-4"> Management </span>
            <span className="fw-bold color fs-4">System</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item color">
                <Link
                  className={`nav-link fs-5 fw-bold ${isActive("/") ? "text-info" : ""}`}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item color" >
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
              <li className="nav-item me-2">
                <Link
                  to="/login"
                  className={`btn fw-bold text-white ${
                    isActive("/login") ? "btn-dark" : "btn-info"
                  }`}
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
