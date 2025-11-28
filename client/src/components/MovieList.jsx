// import MovieCard from "./MovieCard";

// export default function MovieList({ movies, onSelect }) {
//   return (
//     <div className="movie-grid">
//       {movies.map((m) => (
//         <MovieCard key={m.movie_id} movie={m} onSelect={onSelect} />
//       ))}
//     </div>
//   );
// }



// src/components/MovieList.jsx
import MovieCard from "./MovieCard";

export default function MovieList({ movies, setSavedScroll }) {
  return (
    <div className="movie-grid">
      {movies.map((m) => (
        <MovieCard
          key={m.movie_id}
          movie={m}
          setSavedScroll={setSavedScroll} // pass down
        />
      ))}
    </div>
  );
}
