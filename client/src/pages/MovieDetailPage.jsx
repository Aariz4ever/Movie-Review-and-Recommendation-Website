// import { useParams, useNavigate } from "react-router-dom";
// import MovieDetail from "../components/MovieDetail";

// export default function MovieDetailPage({ movies }) {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const movie = movies.find((m) => m.movie_id === Number(id));

//   if (!movie) {
//     return (
//       <div>
//         <h2>Movie not found</h2>
//         <button onClick={() => navigate(-1)} style={btnStyle}>⬅ Back</button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: "1rem" }}>
//       {/* Back Button */}
//       <button onClick={() => navigate(-1)} style={btnStyle}>
//         ⬅ Back
//       </button>

//       {/* Movie Detail */}
//       <MovieDetail movie={movie} />
//     </div>
//   );
// }

// const btnStyle = {
//   padding: "8px 16px",
//   marginBottom: "16px",
//   borderRadius: "6px",
//   border: "none",
//   background: "#333",
//   color: "white",
//   cursor: "pointer"
// };








// src/pages/MovieDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import MovieDetail from "../components/MovieDetail";

export default function MovieDetailPage({ movies }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = movies.find((m) => m.movie_id === Number(id));

  if (!movie) {
    return (
      <div>
        <h2>Movie not found</h2>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={() => navigate(-1)} style={btnStyle}>⬅ Back</button>
      <MovieDetail movie={movie} />
    </div>
  );
}

const btnStyle = {
  padding: "8px 16px",
  marginBottom: "16px",
  borderRadius: "6px",
  border: "none",
  background: "#333",
  color: "white",
  cursor: "pointer"
};
