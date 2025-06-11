import { Link } from "react-router-dom";

//use in categories page

export const Category = (props) => {
  return (
    // className="text-decoration-none"
    <Link to={`/courses/${props.categoryId}`} >
    <button className="btn btn-primary">{props.name}</button>
     </Link>
  );
 

};
