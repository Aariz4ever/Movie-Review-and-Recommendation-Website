import { useEffect, useState } from "react";
import ReviewSection from "./ReviewSection";

const TMDB = "https://image.tmdb.org/t/p/w500";

export default function MovieDetail({ movie }) {
  const [poster, setPoster] = useState("");

  useEffect(() => {
    async function fetchPoster() {
      const url = `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=1c3eada27f7905dbdb99dfc0eb2b8ea1`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        setPoster(data.poster_path ? TMDB + data.poster_path : "https://via.placeholder.com/500");
      } catch (err) {
        setPoster("https://via.placeholder.com/500");
      }
    }
    fetchPoster();
  }, [movie.movie_id]);

  return (
    <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
      {/* Left column: Poster */}
      <div style={{ flex: "0 0 300px" }}>
        <img
          src={poster}
          alt={movie.title}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </div>

      {/* Right column: Details and reviews */}
      <div style={{ flex: 1 }}>
        <h2>{movie.title}</h2>
        <p>{movie.tags}</p>
        <ReviewSection movie={movie} />
      </div>
    </div>
  );
}
