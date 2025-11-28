import { useState } from "react";
import moviesData from "../data/movie_dict.json";
import similarityData from "../data/similarity.json";

export function useMovies() {
  // Directly initialize state with JSON data
  const [movies] = useState(moviesData);
  const [similarity] = useState(similarityData);

  return { movies, similarity };
}
