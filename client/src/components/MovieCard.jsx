// import { useEffect, useState } from "react";

// const TMDB = "https://image.tmdb.org/t/p/w500";

// export default function MovieCard({ movie, onSelect }) {
//   const [poster, setPoster] = useState("");

//   useEffect(() => {
//     async function fetchPoster() {
//       // movie_id in your JSON is a number
//       const url = `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=1c3eada27f7905dbdb99dfc0eb2b8ea1`;
//       try {
//         const res = await fetch(url);
//         const data = await res.json();
//         setPoster(data.poster_path ? TMDB + data.poster_path : "https://via.placeholder.com/500");
//       } catch (err) {
//         setPoster("https://via.placeholder.com/500");
//       }
//     }

//     fetchPoster();
//   }, [movie.movie_id]);

//   return (
//     <div className="movie-card" onClick={() => onSelect(movie)}>
//       <img src={poster} alt={movie.title} />
//       <p>{movie.title}</p>
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const TMDB = "https://image.tmdb.org/t/p/w500";

// export default function MovieCard({ movie }) {
//   const [poster, setPoster] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchPoster() {
//       const url = `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=1c3eada27f7905dbdb99dfc0eb2b8ea1`;
//       try {
//         const res = await fetch(url);
//         const data = await res.json();
//         setPoster(data.poster_path ? TMDB + data.poster_path : "https://via.placeholder.com/500");
//       } catch {
//         setPoster("https://via.placeholder.com/500");
//       }
//     }
//     fetchPoster();
//   }, [movie.movie_id]);

//   return (
//     <div
//       className="movie-card"
//       onClick={() => navigate(`/movie/${movie.movie_id}`)}
//       style={{ cursor: "pointer" }}
//     >
//       <img src={poster} alt={movie.title} />
//       <p>{movie.title}</p>
//     </div>
//   );
// }




// src/components/MovieCard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TMDB = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie, setSavedScroll }) {
  const [poster, setPoster] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPoster() {
      if (!movie.movie_id) return;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=1c3eada27f7905dbdb99dfc0eb2b8ea1`
        );
        const data = await res.json();
        setPoster(data.poster_path ? TMDB + data.poster_path : "https://via.placeholder.com/500");
      } catch {
        setPoster("https://via.placeholder.com/500");
      }
    }
    fetchPoster();
  }, [movie.movie_id]);

  function handleClick() {
    // Save scroll to parent App
    if (typeof setSavedScroll === "function") {
      setSavedScroll(window.scrollY || 0);
    }
    navigate(`/movie/${movie.movie_id}`);
  }

  return (
    <div className="movie-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img src={poster} alt={movie.title} />
      <p>{movie.title}</p>
    </div>
  );
}
