// import { useState } from "react";
// import MovieList from "./MovieList";

// export default function MovieSearch({ movies, similarity, onSelect }) {
//   const [query, setQuery] = useState("");
//   const [genre, setGenre] = useState("");
//   const [results, setResults] = useState([]);

//   function similarityScore(str1, str2) {
//     const common = str1.split("")
//       .filter((c) => str2.includes(c)).length;
//     return (2 * common) / (str1.length + str2.length);
//   }

//   function getCloseMatch(input) {
//     input = input.toLowerCase().trim();
//     let bestScore = 0;
//     let bestIndex = null;

//     movies.forEach((m, i) => {
//       const score = similarityScore(input, m.title.toLowerCase());
//       if (score > bestScore) {
//         bestScore = score;
//         bestIndex = i;
//       }
//     });

//     return bestScore > 0.5 ? bestIndex : null;
//   }

//   async function searchMovie() {
//     if (!query.trim()) return;

//     const index = getCloseMatch(query);
//     if (index === null) {
//       setResults([]);
//       return;
//     }

//     const sims = similarity[index];

//     const recs = sims
//       .map((score, idx) => ({ index: idx, score }))
//       .sort((a, b) => b.score - a.score)
//       .slice(0, 20)
//       .map((x) => movies[x.index])
//       .filter((m) => (!genre || m.genres.includes(genre)));

//     setResults(recs);
//   }

//   const genreList = [
//     ...new Set(movies.flatMap((m) => m.genres)),
//   ].sort();

//   return (
//     <>
//       <input
//         placeholder="Enter movie..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       <select value={genre} onChange={(e) => setGenre(e.target.value)}>
//         <option value="">All Genres</option>
//         {genreList.map((g) => (
//           <option key={g}>{g}</option>
//         ))}
//       </select>

//       <button onClick={searchMovie}>Recommend</button>

//       <MovieList movies={results} onSelect={onSelect} />
//     </>
//   );
// }





// src/components/MovieSearch.jsx
import MovieList from "./MovieList";

export default function MovieSearch({
  movies,
  similarity,
  onSelect, // not used now
  query, setQuery,
  genre, setGenre,
  results, setResults,
  setSavedScroll
}) {
  // similarityScore & getCloseMatch unchanged

  function similarityScore(str1, str2) {
    const common = str1.split("").filter((c) => str2.includes(c)).length;
    return (2 * common) / (str1.length + str2.length);
  }

  function getCloseMatch(input) {
    input = input.toLowerCase().trim();
    let bestScore = 0;
    let bestIndex = null;

    movies.forEach((m, i) => {
      const score = similarityScore(input, m.title.toLowerCase());
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    });

    return bestScore > 0.5 ? bestIndex : null;
  }

  function searchMovie() {
    if (!query.trim()) return;

    const index = getCloseMatch(query);
    if (index === null) {
      setResults([]);
      return;
    }

    const sims = similarity[index];

    const recs = sims
      .map((score, idx) => ({ index: idx, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 24)
      .map((x) => movies[x.index])
      .filter((m) => (!genre || m.genres.includes(genre)));

    setResults(recs);
  }

  const genreList = [...new Set(movies.flatMap((m) => m.genres))].sort();

  return (
    <div>
      <input
        placeholder="Enter movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">All Genres</option>
        {genreList.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <button onClick={searchMovie}>Recommend</button>

      {/* Pass setSavedScroll to MovieList so MovieCard can save scroll before navigate */}
      <MovieList movies={results} setSavedScroll={setSavedScroll} />
    </div>
  );
}
