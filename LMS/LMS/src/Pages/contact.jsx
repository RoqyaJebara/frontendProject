import "./style.css";

const Contact = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <h2 className="text-center fw-bold text-info mb-4"> Contact Us</h2>
              <div className="row">
                {/* Contact Info */}
                <div className="col-md-6 mb-4">
                  <h5 className="fw-bold mb-3 text-black">Contact Information</h5>
                  <div className="mb-3 d-flex align-items-center">
                    <img
                      src="https://img.icons8.com/ios-filled/24/18547a/phone.png"
                      alt="Phone"
                      className="me-2"
                    />
                    <span>+1 234 567 890</span>
                  </div>
                  <div className="mb-3 d-flex align-items-center">
                    <img
                      src="https://img.icons8.com/ios-filled/24/18547a/new-post.png"
                      alt="Email"
                      className="me-2"
                    />
                    <span>contact@LMS.com</span>
                  </div>
                  <div className="mb-3 d-flex align-items-center">
                    <img
                      src="https://img.icons8.com/ios-filled/24/18547a/marker.png"
                      alt="Location"
                      className="me-2"
                    />
                    <span>123 Education St, Knowledge City</span>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="col-md-6 mb-4">
                  <h5 className="fw-bold mb-3 text-black">Business Hours</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Mon – Fri:</strong>
                      <span>9:00 AM – 5:00 PM</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Sat – Sun:</strong>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Contact;
