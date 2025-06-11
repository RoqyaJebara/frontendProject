import React, { useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import image from '../assets/image.webp'


export const Home = () => {
 
  return (

    <div>
      <div class="container py-5">
        <div class="row rounded-4 shadow p-4 align-items-center">
          {/* <!-- Left Section --> */}
          <div class="col-lg-6 mb-4 mb-lg-0">
            <h1 class="display-5 fw-bold text-info">
              Online Learning 
            </h1>
            <p class="promo fs-5">Get Promo Up To 30% Off For This Year Only</p>
            <div class="mb-3">
              <h5 class="text-info fw-bold">Business</h5>
              <p class="text-muted small">
                📈 "Success in business requires training, discipline and hard
                work." – David Rockefeller
              </p>
            </div>
            <div class="mb-3">
              <h5 class="text-info fw-bold">Marketing</h5>
              <p class="text-muted small">
                📣 "Stopping advertising to save money is like stopping your
                watch to save time." – Henry Ford
              </p>
            </div>
            <div class="mb-3">
              <h5 class="text-info fw-bold">Accounting</h5>
              <p class="text-muted small">
                📊 "Accounting is the language of business." – Warren Buffett{" "}
              </p>
            </div>{" "}
            <div class="mb-3">
              <h5 class="text-info fw-bold">Information Technology</h5>
              <p class="text-muted small">
                💡 "The science of today is the technology of tomorrow." –
                Edward Teller
              </p>
            </div>
            <Link to="/register">
              <button className="btn btn-info fw-bold text-white mt-3">
                Register Now
              </button>
            </Link>
          </div>

          {/* <!-- Right Section --> */}
          <div class="col-lg-6 position-relative">
              <div class="bg-info-subtle text-center p-3 rounded">
                <img
                  src={image}
                  alt="Online Class"
                  class="img-fluid"
                />
                <p class="fw-semibold mt-2">Creative Learning</p>
              </div>
             
            </div>
          </div>
      </div>

    </div>
  );
};
