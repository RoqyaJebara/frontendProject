 import "./style.css";

 const Contact = () => {
    return (
     <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-lg-10 contact-section">
        <div class="row">
          {/* <!-- Form --> */}
          <div class="col-md-6 mb-4 mb-md-0">
            <h3 class="fw-bold text-primary mb-3">Send us a message</h3>
            <form>
              <div class="mb-3">
                <label class="form-label">Your Name</label>
                <input type="text" class="form-control" placeholder="John Doe" required/>
              </div>
              <div class="mb-3">
                <label class="form-label">Your Email</label>
                <input type="email" class="form-control" placeholder="you@example.com" required/>
              </div>
              <div class="mb-3">
                <label class="form-label">Message</label>
                <textarea class="form-control" rows="4" placeholder="Your message..." required></textarea>
              </div>
              <button type="submit" class="btn btn-primary fw-bold">Send Message</button>
            </form>
          </div>

          {/* <!-- Contact Info --> */}
          <div class="col-md-6 ps-md-5">
            <h3 class="fw-bold text-primary mb-3">Contact Info</h3>
            <p><img src="https://img.icons8.com/ios-filled/24/000000/phone.png" class="icon"/> +1 234 567 890</p>
            <p><img src="https://img.icons8.com/ios-filled/24/000000/new-post.png" class="icon"/> contact@LMS.com</p>
            <p><img src="https://img.icons8.com/ios-filled/24/000000/marker.png" class="icon"/> 123 Education St, Knowledge City</p>
            <h5 class="mt-4 fw-bold">Business Hours</h5>
            <p>Mon - Fri: 9am – 5pm</p>
            <p>Sat - Sun: Closed</p>
          </div>
        </div>
      </div>
    </div>
  </div>    
    );
}
export default Contact;