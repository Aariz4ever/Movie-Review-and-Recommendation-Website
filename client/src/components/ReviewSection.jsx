import { useEffect, useState, useCallback } from "react";
import { addReview, getReviews, updateReview, deleteReview } from "../api/reviews";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ReviewSection({ movie }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [editId, setEditId] = useState(null);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const loadReviews = useCallback(async () => {
    const data = await getReviews(movie.movie_id);
    setReviews(data);
  }, [movie.movie_id]);

  useEffect(() => {
    let active = true;

    (async () => {
      const data = await getReviews(movie.movie_id);
      if (active) setReviews(data);
    })();

    return () => { active = false; };
  }, [movie.movie_id]);

  async function handleSubmit() {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!rating || !comment.trim()) return alert("Enter all fields");

    if (editId) {
      await updateReview(editId, { rating, comment }, token);
      setEditId(null);
    } else {
      await addReview({ movieId: movie.movie_id, movieTitle: movie.title, rating, comment }, token);
    }
    setRating(0);
    setComment("");
    loadReviews();
  }

  // Calculate average rating
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div>
      <h3>Average Rating: {averageRating} ⭐ ({reviews.length} reviews)</h3>

      <h3>Your Rating</h3>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            onClick={() => setRating(s)}
            style={{ color: s <= rating ? "#FFD700" : "gray", cursor: "pointer" }}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button onClick={handleSubmit}>
        {editId ? "Update Review" : "Submit Review"}
      </button>

      <h3>User Reviews</h3>
      {reviews.map((r) => (
        <div key={r._id} className="review-card">
          <p><strong>⭐ {r.rating}</strong> — {r.comment}</p>
          <p style={{ fontSize: 12, color: "#666" }}>by {r.username}</p>

          {token && r.userId === user?.id && (
            <>
              <button onClick={() => { setEditId(r._id); setRating(r.rating); setComment(r.comment); }}>Edit</button>
              <button onClick={async () => { await deleteReview(r._id, token); loadReviews(); }}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
