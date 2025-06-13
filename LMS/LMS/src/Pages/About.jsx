export const About = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 about-section">
          <h2 className="fw-bold text-info mb-4">About LMS</h2>
          <p className="lead">
            Our Learning Management System (LMS) is dedicated to making quality
            education accessible, flexible, and personalized for everyone.
          </p>
          <p>
            Whether you're a student aiming to upskill or an institution looking
            to provide interactive learning experiences, our platform is
            designed to empower your journey.
          </p>

          <div className="row mt-4">
            <div className="col-md-4 d-flex mb-3">
              <img
                src="https://img.icons8.com/fluency/48/000000/classroom.png"
                className="feature-icon"
                alt="Classes"
              />
              <div>
                <h6 className="fw-bold text-info">Interactive Courses</h6>
                <p className="small">
                  Explore diverse subjects with rich content and practical
                  tasks.
                </p>
              </div>
            </div>
            <div className="col-md-4 d-flex mb-3">
              <img
                src="https://img.icons8.com/fluency/48/000000/student-center.png"
                className="feature-icon"
                alt="Students"
              />
              <div>
                <h6 className="fw-bold text-info">
                  Student-Centered Design
                </h6>
                <p className="small">
                  Focus on learner outcomes through engaging and adaptive tools.
                </p>
              </div>
            </div>
            <div className="col-md-4 d-flex mb-3">
              <img
                src="https://img.icons8.com/ios-filled/100/000000/security-checked.png"
                className="feature-icon"
                alt="Security"
                width="100"
              />

              <div>
                <h6 className="fw-bold text-info">Secure & Reliable</h6>
                <p className="small">
                  Your data and learning progress are safe with our secure
                  system.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4">
            Join thousands of learners and educators who trust LMS to deliver
            meaningful learning experiences every day.
          </p>
        </div>
      </div>
    </div>
  );
};
