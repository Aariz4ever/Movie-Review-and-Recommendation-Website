// import { useState } from "react";
// import MovieSearch from "./components/MovieSearch";
// import MovieDetail from "./components/MovieDetail";
// import { useMovies } from "./hooks/useMovies";

// export default function App() {
//   const { movies, similarity } = useMovies();
//   const [selectedMovie, setSelectedMovie] = useState(null);

//   return (
//     <div className="app">
//       <h1>🎬 Movie Reviews</h1>
//       <MovieSearch movies={movies} similarity={similarity} onSelect={setSelectedMovie} />
//       {selectedMovie && <MovieDetail movie={selectedMovie} />}
//     </div>
//   );
// }







// import { Routes, Route } from "react-router-dom";
// import { useState } from "react";
// import { useMovies } from "./hooks/useMovies";
// import MovieSearch from "./components/MovieSearch";
// import MovieDetailPage from "./pages/MovieDetailPage";

// function App() {
//   const { movies, similarity } = useMovies();
//   const [selectedMovie, setSelectedMovie] = useState(null);

//   return (
//     <div className="app">
//       <h1>🎬 Movie Reviews</h1>
//       <h4>Explore, Recommend & Review Movies</h4>

//       <Routes>
//         {/* Home page with search */}
//         <Route
//           path="/"
//           element={
//             <MovieSearch
//               movies={movies}
//               similarity={similarity}
//               onSelect={setSelectedMovie}
//             />
//           }
//         />

//         {/* Movie detail page */}
//         <Route path="/movie/:id" element={<MovieDetailPage movies={movies} />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;










// src/App.jsx
// import { useState, useEffect } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import { useMovies } from "./hooks/useMovies";
// import MovieSearch from "./components/MovieSearch";
// import MovieDetailPage from "./pages/MovieDetailPage";

// export default function App() {
//   const { movies, similarity } = useMovies();

//   // Lifted state
//   const [query, setQuery] = useState("");
//   const [genre, setGenre] = useState("");
//   const [results, setResults] = useState([]);
//   const [savedScroll, setSavedScroll] = useState(0);

//   const location = useLocation();

//   // When we return to home ("/"), restore scroll
//   useEffect(() => {
//     if (location.pathname === "/") {
//       // small timeout to wait for rendering
//       window.requestAnimationFrame(() => window.scrollTo(0, savedScroll));
//     }
//   }, [location.pathname, savedScroll]);

//   return (
//     <div className="app">
//       <h1>🎬 Movie Reviews</h1>
//       <h4>Explore, Recommend & Review Movies</h4>

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <MovieSearch
//               movies={movies}
//               similarity={similarity}
//               query={query}
//               setQuery={setQuery}
//               genre={genre}
//               setGenre={setGenre}
//               results={results}
//               setResults={setResults}
//               setSavedScroll={setSavedScroll} // passed down so MovieCard can save scroll before navigate
//             />
//           }
//         />

//         <Route path="/movie/:id" element={<MovieDetailPage movies={movies} />} />
//       </Routes>
//     </div>
//   );
// }






import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useMovies } from "./hooks/useMovies";
import MovieSearch from "./components/MovieSearch";
import MovieDetailPage from "./pages/MovieDetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 👈 get user & logout from AuthContext

  return (
    <nav style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </>
      )}
    </nav>
  );
}




export default function App() {
  const { movies, similarity } = useMovies();

  // Lifted state
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [results, setResults] = useState([]);
  const [savedScroll, setSavedScroll] = useState(0);
  
  const location = useLocation();

  // When we return to home ("/"), restore scroll
  useEffect(() => {
    if (location.pathname === "/") {
      // small timeout to wait for rendering
      window.requestAnimationFrame(() => window.scrollTo(0, savedScroll));
    }
  }, [location.pathname, savedScroll]);

  return (
    <div className="app">
      <h1>🎬 Movie Reviews</h1>
      <h4>Explore, Recommend & Review Movies</h4>
        <Navbar/>
      <Routes>
        <Route
          path="/"
          element={
            <MovieSearch
              movies={movies}
              similarity={similarity}
              query={query}
              setQuery={setQuery}
              genre={genre}
              setGenre={setGenre}
              results={results}
              setResults={setResults}
              setSavedScroll={setSavedScroll} // passed down so MovieCard can save scroll before navigate
            />
          }
        />
<Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetailPage movies={movies} />} />
      </Routes>
    </div>
  );
}
