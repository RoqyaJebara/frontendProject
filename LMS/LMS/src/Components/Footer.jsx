import React from "react";
import logo from "../assets/logo.png";

export const Footer = () => {
  return (  
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container text-center">
        <a
          className="navbar-brand  d-flex justify-content-center align-items-center mb-2"
          href="#"
        >
          <img src={logo} alt="Logo" width="90" height="90"className="me-2" />
        <div className="LMS">
             <span className="fw-bold text-primary-custom fs-4">Learning</span>
            <span className="fw-bold text-primary-custom fs-4"> Managment </span>
            <span className="fw-bold text-primary-custom fs-4">System</span>
        </div>

        </a>
        <p className="mb-1">Empowering Education Through Technology</p>
        <div className="mb-3">
      <a href="https://facebook.com" className="text-white me-3" target="_blank">
        <i className="bi bi-facebook fs-4"></i>
      </a>
      <a href="https://twitter.com" className="text-white me-3" target="_blank">
        <i className="bi bi-twitter fs-4"></i>
      </a>
      <a href="https://instagram.com" className="text-white me-3" target="_blank">
        <i className="bi bi-instagram fs-4"></i>
      </a>
      <a href="https://linkedin.com" className="text-white" target="_blank">
        <i className="bi bi-linkedin fs-4"></i>
      </a>
    </div>
        <p className="small  mb-0 text-white">© 2025 LMS. All rights reserved.</p>
      </div>
    </footer>
  );
};
