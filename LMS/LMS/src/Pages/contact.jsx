import "./style.css";

const Contact = () => {
  return (
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 contact-section">
          <div class="row">
            {/* <!-- Contact Info --> */}
            
              <h3 class="fw-bold text-info m-3">Contact Info</h3>
         <div class="col-md-6 ps-md-5">
              <p>
                <img
                  src="https://img.icons8.com/ios-filled/24/000000/phone.png"
                  class="icon"
                />{" "}
                +1 234 567 890
              </p>
              <p>
                <img
                  src="https://img.icons8.com/ios-filled/24/000000/new-post.png"
                  class="icon"
                />{" "}
                contact@LMS.com
              </p>
              <p>
                <img
                  src="https://img.icons8.com/ios-filled/24/000000/marker.png"
                  class="icon"
                />{" "}
                123 Education St, Knowledge City
              </p>
            </div>
            <div class="col-md-6 ps-md-5">
              {" "}
              <h5 class="mt-4 fw-bold">Business Hours</h5>
              <p>Mon - Fri: 9am – 5pm</p>
              <p>Sat - Sun: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
