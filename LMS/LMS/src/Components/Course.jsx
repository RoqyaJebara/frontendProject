import { Link } from "react-router-dom";
import images from "../images"; // images is an object like { food: imagePath, news: imagePath }
//use in courses page
//category

export const Course = (props) => {
  const categoryId = props.category_id; //by category link in categories page
  const coursecategoryId = props.course_category_id; //by category link in categories page
  const courseId = props.courseId; //by course compontent link in category page
  const price = props.price; //by course compontent link in category page
  const courseName = props.courseName; //by course compontent link in category page
  const course_thumbnail_url = props.course_thumbnail_url; //by course compontent link in category page
  

  if (parseInt(categoryId) === parseInt(coursecategoryId))
    return (
      // className="text-decoration-none"
      // <Link to={`/course/${props.courseId}`} >
 <div className="card shadow-sm border-0 courseCard h-100">
  <img
    className="card-img-top object-fit-cover"
    src={course_thumbnail_url}
    alt="Course Thumbnail"
    style={{ height: "200px", objectFit: "cover" }}
  />
  <div className="card-body">
    <span className="badge bg-warning text-dark mb-2">
      Category: {coursecategoryId}
    </span>
    <h6 className="text-muted mb-1">Course #{courseId}</h6>
    <h5 className="card-title fw-bold text-dark">{courseName}</h5>
    
    {/* Price */}
    <div className="mt-2">
      <span className="fw-bold text-success fs-5">${price}</span>
    </div>
  </div>
  <div className="card-footer bg-white border-0">
    <button className="btn btn-outline-warning w-100 fw-semibold">
      Enroll Now
    </button>
  </div>
</div>

      //  </Link>
    );
  else if (parseInt(categoryId) === parseInt(coursecategoryId))
    return (
      // className="text-decoration-none"
      // <Link to={`/course/${props.courseId}`} >
   <div className="card shadow-sm border-0 courseCard h-100">
  <img
    className="card-img-top object-fit-cover"
    src={course_thumbnail_url}
    alt="Course Thumbnail"
    style={{ height: "200px", objectFit: "cover" }}
  />
  <div className="card-body">
    <span className="badge bg-warning text-dark mb-2">
      Category: {coursecategoryId}
    </span>
    <h6 className="text-muted mb-1">Course #{courseId}</h6>
    <h5 className="card-title fw-bold text-dark">{courseName}</h5>
    
    {/* Price */}
    <div className="mt-2">
      <span className="fw-bold text-success fs-5">${price}</span>
    </div>
  </div>
  <div className="card-footer bg-white border-0">
    <button className="btn btn-outline-warning w-100 fw-semibold">
      Enroll Now
    </button>
  </div>
</div>
      //  </Link>
    );
  else if (parseInt(categoryId) === parseInt(coursecategoryId))
    return (
      // className="text-decoration-none"
      // <Link to={`/course/${props.courseId}`} >
    <div className="card shadow-sm border-0 courseCard h-100">
  <img
    className="card-img-top object-fit-cover"
    src={course_thumbnail_url}
    alt="Course Thumbnail"
    style={{ height: "200px", objectFit: "cover" }}
  />
  <div className="card-body">
    <span className="badge bg-warning text-dark mb-2">
      Category: {coursecategoryId}
    </span>
    <h6 className="text-muted mb-1">Course #{courseId}</h6>
    <h5 className="card-title fw-bold text-dark">{courseName}</h5>
    
    {/* Price */}
    <div className="mt-2">
      <span className="fw-bold text-success fs-5">${price}</span>
    </div>
  </div>
  <div className="card-footer bg-white border-0">
    <button className="btn btn-outline-warning w-100 fw-semibold">
      Enroll Now
    </button>
  </div>
</div>

      //  </Link>
    );
  else if (parseInt(categoryId) === parseInt(coursecategoryId))
    return (
      // className="text-decoration-none"
      // <Link to={`/course/${props.courseId}`} >
     <div className="card shadow-sm border-0 courseCard h-100">
  <img
    className="card-img-top object-fit-cover"
    src={course_thumbnail_url}
    alt="Course Thumbnail"
    style={{ height: "200px", objectFit: "cover" }}
  />
  <div className="card-body">
    <span className="badge bg-warning text-dark mb-2">
      Category: {coursecategoryId}
    </span>
    <h6 className="text-muted mb-1">Course #{courseId}</h6>
    <h5 className="card-title fw-bold text-dark">{courseName}</h5>
    
    {/* Price */}
    <div className="mt-2">
      <span className="fw-bold text-success fs-5">${price}</span>
    </div>
  </div>
  <div className="card-footer bg-white border-0">
    <button className="btn btn-outline-warning w-100 fw-semibold">
      Enroll Now
    </button>
  </div>
</div>
      //  </Link>
    );
};
