// import { Category } from "../Components/Category";
// export const Categories = () => {
//   const categoryNames = ["IT", "business", "accounting", "Marketing"];
//   const categoryIds = [0, 1, 2, 3];
//   // const fetchCategories = (url) => {
//   //   fetch(url)
//   //     .then((result) => result.json())
//   //     .then((data) => {
//   //       setCategories(data);
//   //     })
//   //     // .then(data => console.log(data))
//   //     .catch((error) => console.log(error));
//   // };

//   // useEffect(() => {
//   //   fetchCategories("https://api.escuelajs.co/api/v1/categories");
//   //   fetchItems("https://api.escuelajs.co/api/v1/products");
//   // }, []); //dependancy
//   // const showCategories = () =>
//   //   categories.map((n) => (
//   //     <div key={n.id}>
//   //       <button className="btn_category" onClick={() => setCategoryID(n.id)}>
//   //         <img src={n.image} alt={n.name} width="50" height="50" />{" "}
//   //         <p>{n.name}</p>
//   //       </button>
//   //     </div>
//   //   ));
//   return (
//     <div class="container py-5">
//       <div class="text-center mb-5">
//         <h2 class="fw-bold text-primary">All Categories of Courses</h2>
//         <p class="text-muted">
//           Browse and choose from a variety of topics to boost your knowledge.
//         </p>
//       </div>
//       <div class="row">
//         <div class="col-md-3 mb-4">
//           <Category
//             categoryName={categoryNames[0]}
//             categoryId={categoryIds[0]}
//           />
//         </div>
//         <div class="col-md-3 mb-4">
//           <Category
//             categoryName={categoryNames[1]}
//             categoryId={categoryIds[1]}
//           />
//         </div>
//         <div class="col-md-3 mb-4">
//           <Category
//             categoryName={categoryNames[2]}
//             categoryId={categoryIds[2]}
//           />
//         </div>
//         <div class="col-md-3 mb-4">
//           <Category
//             categoryName={categoryNames[3]}
//             categoryId={categoryIds[3]}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
