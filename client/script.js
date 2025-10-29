// let movies = [];
// let similarity = [];

// const TMDB_API_KEY = "1c3eada27f7905dbdb99dfc0eb2b8ea1";

// async function loadData() {
//     const moviesRes = await fetch("movie_dict.json");
//     const similarityRes = await fetch("similarity.json");
//     movies = await moviesRes.json();
//     similarity = await similarityRes.json();

//     populateGenres();
// }

// function populateGenres() {
//     const genreSet = new Set();
//     movies.forEach(movie => movie.genres.forEach(g => genreSet.add(g)));
//     const genreFilter = document.getElementById("genreFilter");
//     [...genreSet].sort().forEach(genre => {
//         const option = document.createElement("option");
//         option.value = genre;
//         option.textContent = genre;
//         genreFilter.appendChild(option);
//     });
// }

// function getCloseMatch(input) {
//     input = input.toLowerCase().trim();
//     let bestMatch = null;
//     let bestScore = 0;

//     for (let i = 0; i < movies.length; i++) {
//         const title = movies[i].title.toLowerCase().trim();
//         const score = similarityScore(input, title);
//         if (score > bestScore) {
//             bestScore = score;
//             bestMatch = i;
//         }
//     }
//     return bestScore > 0.5 ? bestMatch : null;
// }

// function similarityScore(str1, str2) {
//     const common = str1.split("").filter(char => str2.includes(char)).length;
//     return (2 * common) / (str1.length + str2.length);
// }

// async function fetchPoster(movieId) {
//     try {
//         const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
//         const data = await res.json();
//         return data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";
//     } catch {
//         return "https://via.placeholder.com/500x750?text=No+Image";
//     }
// }

// async function recommendMovies() {
//     const input = document.getElementById("movieInput").value;
//     const selectedGenre = document.getElementById("genreFilter").value;
//     const index = getCloseMatch(input);
//     const container = document.getElementById("recommendations");
//     container.innerHTML = "";

//     if (index === null) {
//         container.innerHTML = "<p>No similar movie found. Try a different name.</p>";
//         return;
//     }

//     const sims = similarity[index];
//     const moviePairs = sims.map((score, idx) => [idx, score])
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 20);

//     for (const [i] of moviePairs) {
//         const movie = movies[i];
//         if (selectedGenre && !movie.genres.includes(selectedGenre)) continue;

//         const poster = await fetchPoster(movie.movie_id);

//         const card = document.createElement("div");
//         card.className = "movie-card";
//         card.onclick = () => showMovieDetails(movie, poster);

//         const img = document.createElement("img");
//         img.src = poster;

//         const title = document.createElement("p");
//         title.textContent = movie.title;

//         card.appendChild(img);
//         card.appendChild(title);
//         container.appendChild(card);
//     }
// }

// // function showMovieDetails(movie, posterUrl) {
// //     const modal = document.createElement("div");
// //     modal.className = "modal";
// //     modal.innerHTML = `
// //         <div class="modal-content">
// //             <span class="close-btn">&times;</span>
// //             <img src="${posterUrl}" alt="${movie.title}" />
// //             <h2>${movie.title}</h2>
// //             <p><strong>Genres:</strong> ${movie.genres.join(", ")}</p>
// //             <p><strong>Description:</strong> ${movie.tags.split(" ").slice(0, 40).join(" ")}...</p>
// //             <div class="rating-section">
// //                 <strong>Rate this movie:</strong>
// //                 <div class="stars">
// //                     ${[1,2,3,4,5].map(i => `<span class="star" data-star="${i}">&#9733;</span>`).join("")}
// //                 </div>
// //                 <textarea placeholder="Leave a comment..."></textarea>
// //                 <button onclick="alert('Review submitted!')">Submit</button>
// //             </div>
// //         </div>
// //     `;
// //     document.body.appendChild(modal);

// //     // Event: close modal
// //     modal.querySelector(".close-btn").onclick = () => modal.remove();

// //     // Star rating highlight
// //     modal.querySelectorAll(".star").forEach(star => {
// //         star.onclick = () => {
// //             let rating = parseInt(star.getAttribute("data-star"));
// //             modal.querySelectorAll(".star").forEach(s => {
// //                 s.style.color = parseInt(s.getAttribute("data-star")) <= rating ? "#FFD700" : "gray";
// //             });
// //         };
// //     });
// // }

// function showMovieDetails(movie, posterUrl) {
//     const API_URL = "http://localhost:5000/api/reviews";

//     const modal = document.createElement("div");
//     modal.className = "modal";
//     modal.innerHTML = `
//         <div class="modal-content">
//             <span class="close-btn">&times;</span>
//             <img src="${posterUrl}" alt="${movie.title}" />
//             <h2>${movie.title}</h2>
//             <p><strong>Genres:</strong> ${movie.genres.join(", ")}</p>
//             <p><strong>Description:</strong> ${movie.tags.split(" ").slice(0, 40).join(" ")}...</p>
//             <div class="rating-section">
//                 <strong>Rate this movie:</strong>
//                 <div class="stars">
//                     ${[1,2,3,4,5].map(i => `<span class="star" data-star="${i}">&#9733;</span>`).join("")}
//                 </div>
//                 <textarea placeholder="Leave a comment..." id="modalComment"></textarea>
//                 <button id="submitReview">Submit</button>
//                 <div id="reviewMessage" style="margin-top:10px;color:#0f0;"></div>
//             </div>
//             <div id="reviewsContainer"><h3>User Reviews:</h3></div>
//         </div>
//     `;
//     document.body.appendChild(modal);

//     // Close modal
//     modal.querySelector(".close-btn").onclick = () => modal.remove();

//     // Star rating highlight
//     let selectedRating = 0;
//     modal.querySelectorAll(".star").forEach(star => {
//         star.onclick = () => {
//             selectedRating = parseInt(star.getAttribute("data-star"));
//             modal.querySelectorAll(".star").forEach(s => {
//                 s.style.color = parseInt(s.getAttribute("data-star")) <= selectedRating ? "#FFD700" : "gray";
//             });
//         };
//     });

//     // Submit review
//     modal.querySelector("#submitReview").onclick = async () => {
//         const comment = modal.querySelector("#modalComment").value.trim();
//         if (selectedRating === 0 || !comment) {
//             alert("Please select a rating and enter a comment!");
//             return;
//         }

//         try {
//             await fetch(API_URL, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     movieId: movie.movie_id,
//                     movieTitle: movie.title,
//                     rating: selectedRating,
//                     comment
//                 })
//             });

//             modal.querySelector("#reviewMessage").textContent = "✅ Review submitted!";
//             modal.querySelector("#modalComment").value = "";
//             selectedRating = 0;
//             modal.querySelectorAll(".star").forEach(s => s.style.color = "gray");

//             // Refresh reviews
//             loadReviews();
//         } catch (err) {
//             alert("Error submitting review!");
//         }
//     };

//     // Load existing reviews
//     async function loadReviews() {
//         const res = await fetch(`${API_URL}/${movie.movie_id}`);
//         const reviews = await res.json();
//         const container = modal.querySelector("#reviewsContainer");
//         container.innerHTML = "<h3>User Reviews:</h3>";
//         reviews.forEach(r => {
//             const div = document.createElement("div");
//             div.className = "review-card";
//             div.innerHTML = `<p><strong>⭐ ${r.rating}</strong> — ${r.comment}</p>`;
//             container.appendChild(div);
//         });
//     }

//     loadReviews();
// }


// loadData();



let movies = [];
let similarity = [];
const TMDB_API_KEY = "1c3eada27f7905dbdb99dfc0eb2b8ea1";
const API_URL = "http://localhost:5000/api/reviews";
const commentBox = document.getElementById("comment"); // textarea
const starContainer = document.getElementById("stars"); // stars div
const submitBtn = document.querySelector("button[onclick='submitReview()']"); // submit button
let selectedRating = 0;

async function loadData() {
    const moviesRes = await fetch("movie_dict.json");
    const similarityRes = await fetch("similarity.json");
    movies = await moviesRes.json();
    similarity = await similarityRes.json();
    populateGenres();
}

function populateGenres() {
    const genreSet = new Set();
    movies.forEach(movie => movie.genres.forEach(g => genreSet.add(g)));
    const genreFilter = document.getElementById("genreFilter");
    [...genreSet].sort().forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

function getCloseMatch(input) {
    input = input.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;

    for (let i = 0; i < movies.length; i++) {
        const title = movies[i].title.toLowerCase().trim();
        const score = similarityScore(input, title);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = i;
        }
    }
    return bestScore > 0.5 ? bestMatch : null;
}

function similarityScore(str1, str2) {
    const common = str1.split("").filter(char => str2.includes(char)).length;
    return (2 * common) / (str1.length + str2.length);
}

async function fetchPoster(movieId) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await res.json();
        return data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";
    } catch {
        return "https://via.placeholder.com/500x750?text=No+Image";
    }
}

async function recommendMovies() {
    const input = document.getElementById("movieInput").value;
    const selectedGenre = document.getElementById("genreFilter").value;
    const index = getCloseMatch(input);
    const container = document.getElementById("recommendations");
    container.innerHTML = "";

    if (index === null) {
        container.innerHTML = "<p>No similar movie found. Try a different name.</p>";
        return;
    }

    const sims = similarity[index];
    const moviePairs = sims.map((score, idx) => [idx, score])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

    for (const [i] of moviePairs) {
        const movie = movies[i];
        if (selectedGenre && !movie.genres.includes(selectedGenre)) continue;

        const poster = await fetchPoster(movie.movie_id);

        const card = document.createElement("div");
        card.className = "movie-card";
        card.onclick = () => showMovieDetails(movie, poster);

        const img = document.createElement("img");
        img.src = poster;

        const title = document.createElement("p");
        title.textContent = movie.title;

        card.appendChild(img);
        card.appendChild(title);
        container.appendChild(card);
    }
}

// NEW: Show movie details in panel
async function showMovieDetails(movie, posterUrl) {
    const detailPanel = document.getElementById("movieDetail");
    detailPanel.style.display = "flex";

    document.getElementById("poster").src = posterUrl;
    document.getElementById("title").textContent = movie.title;
    document.getElementById("tags").textContent = movie.tags;
    document.getElementById("genres").textContent = "Genres: " + movie.genres.join(", ");

    // Setup stars
    const starContainer = document.getElementById("stars");
    starContainer.innerHTML = '';
    let selectedRating = 0;
    for (let i = 0; i < 5; i++) {
        const star = document.createElement("span");
        star.textContent = "★";
        star.style.cursor = "pointer";
        star.style.color = "gray";
        star.addEventListener("click", () => {
            selectedRating = i + 1;
            [...starContainer.children].forEach((s, idx) => {
                s.style.color = idx < selectedRating ? "#FFD700" : "gray";
            });
        });
        starContainer.appendChild(star);
    }

    const commentBox = document.getElementById("comment");
    const submitBtn = document.getElementById("submitReview");

    // Submit review
    submitBtn.onclick = async () => {
        const comment = commentBox.value.trim();
        if (selectedRating === 0 || !comment) {
            alert("Please select a rating and enter a comment!");
            return;
        }

        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    movieId: movie.movie_id,
                    movieTitle: movie.title,
                    rating: selectedRating,
                    comment
                })
            });
            commentBox.value = "";
            selectedRating = 0;
            [...starContainer.children].forEach(s => s.style.color = "gray");
            loadReviews(movie.movie_id); // immediately show the new review
        } catch (err) {
            alert("Error submitting review!");
        }
    };

//     async function submitReview() {
//     const rating = [...document.querySelectorAll('#stars span.selected')].length;
//     const comment = document.getElementById("comment").value.trim();

//     if (!rating || !comment) {
//         alert("Please provide a rating and comment!");
//         return;
//     }

//     const movieId = params.get("id");
//     const movieTitle = document.getElementById("title").textContent;

//     await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ movieId, movieTitle, rating, comment })
//     });

//     document.getElementById("comment").value = "";
//     setupStars(); // reset stars
//     loadReviews(movieId); // refresh list
// }


    // Load reviews
    // async function loadReviews(movieId) {
    //     const res = await fetch(`${API_URL}/${movieId}`);
    //     const reviews = await res.json();
    //     const container = document.getElementById("reviewsContainer");
    //     container.innerHTML = "<h3>User Reviews:</h3>";

    //     reviews.forEach(r => {
    //         const div = document.createElement("div");
    //         div.className = "review-card";
    //         div.style.borderTop = "1px solid #444";
    //         div.style.padding = "5px 0";
    //         div.style.display = "flex";
    //         div.style.justifyContent = "space-between";
    //         div.style.alignItems = "center";

    //         const content = document.createElement("p");
    //         content.innerHTML = `<strong>⭐ ${r.rating}</strong> — ${r.comment}`;
    //         content.style.flex = "1";
    //         div.appendChild(content);

    //         const actions = document.createElement("div");

    //         // Edit button
    //         const editBtn = document.createElement("button");
    //         editBtn.textContent = "Edit";
    //         editBtn.style.marginRight = "5px";
    //         editBtn.onclick = () => {
    //             commentBox.value = r.comment;
    //             selectedRating = r.rating;
    //             [...starContainer.children].forEach((s, idx) => {
    //                 s.style.color = idx < selectedRating ? "#FFD700" : "gray";
    //             });

    //             submitBtn.onclick = async () => {
    //                 const updatedComment = commentBox.value.trim();
    //                 if (selectedRating === 0 || !updatedComment) {
    //                     alert("Please select a rating and enter a comment!");
    //                     return;
    //                 }
    //                 try {
    //                     await fetch(`${API_URL}/${r._id}`, {
    //                         method: "PUT",
    //                         headers: { "Content-Type": "application/json" },
    //                         body: JSON.stringify({
    //                             rating: selectedRating,
    //                             comment: updatedComment
    //                         })
    //                     });
    //                     commentBox.value = "";
    //                     selectedRating = 0;
    //                     [...starContainer.children].forEach(s => s.style.color = "gray");
    //                     loadReviews(movieId); // refresh reviews
    //                 } catch (err) {
    //                     alert("Error updating review!");
    //                 }
    //             };
    //         };
    //         actions.appendChild(editBtn);

    //         // Delete button
    //         const deleteBtn = document.createElement("button");
    //         deleteBtn.textContent = "Delete";
    //         deleteBtn.onclick = async () => {
    //             if (confirm("Are you sure you want to delete this review?")) {
    //                 try {
    //                     await fetch(`${API_URL}/${r._id}`, { method: "DELETE" });
    //                     loadReviews(movieId); // refresh reviews
    //                 } catch {
    //                     alert("Error deleting review!");
    //                 }
    //             }
    //         };
    //         actions.appendChild(deleteBtn);

    //         div.appendChild(actions);
    //         container.appendChild(div);
    //     });
    // }

    // Load reviews
async function loadReviews(movieId) {
    const res = await fetch(`${API_URL}/${movieId}`);
    const reviews = await res.json();
    const container = document.getElementById("reviewsContainer");
    container.innerHTML = ""; // clear previous content

    if (reviews.length === 0) {
        container.innerHTML = "<h3>User Reviews:</h3><p>No reviews yet.</p>";
        return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = (totalRating / reviews.length).toFixed(1);

    // Display average rating and count
    const stats = document.createElement("div");
    stats.innerHTML = `<h3>User Reviews:</h3>
                       <p>⭐ Average Rating: ${avgRating} / 5 (${reviews.length} reviews)</p>`;
    stats.style.marginBottom = "10px";
    container.appendChild(stats);

    // Display each review
    reviews.forEach(r => {
        const div = document.createElement("div");
        div.className = "review-card";
        div.style.borderTop = "1px solid #444";
        div.style.padding = "5px 0";
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";

        const content = document.createElement("p");
        content.innerHTML = `<strong>⭐ ${r.rating}</strong> — ${r.comment}`;
        content.style.flex = "1";
        div.appendChild(content);

        const actions = document.createElement("div");

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.marginRight = "5px";
        editBtn.onclick = () => {
            commentBox.value = r.comment;
            selectedRating = r.rating;
            [...starContainer.children].forEach((s, idx) => {
                s.style.color = idx < selectedRating ? "#FFD700" : "gray";
            });

            submitBtn.onclick = async () => {
                const updatedComment = commentBox.value.trim();
                if (selectedRating === 0 || !updatedComment) {
                    alert("Please select a rating and enter a comment!");
                    return;
                }
                try {
                    await fetch(`${API_URL}/${r._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            rating: selectedRating,
                            comment: updatedComment
                        })
                    });
                    commentBox.value = "";
                    selectedRating = 0;
                    [...starContainer.children].forEach(s => s.style.color = "gray");
                    loadReviews(movieId); // refresh reviews
                } catch (err) {
                    alert("Error updating review!");
                }
            };
        };
        actions.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = async () => {
            if (confirm("Are you sure you want to delete this review?")) {
                try {
                    await fetch(`${API_URL}/${r._id}`, { method: "DELETE" });
                    loadReviews(movieId); // refresh reviews
                } catch {
                    alert("Error deleting review!");
                }
            }
        };
        actions.appendChild(deleteBtn);

        div.appendChild(actions);
        container.appendChild(div);
    });
}



    loadReviews(movie.movie_id);
}

loadData();
