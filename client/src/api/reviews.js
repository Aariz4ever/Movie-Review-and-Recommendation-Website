// const API_URL = "http://localhost:5000/api/reviews";

// export const addReview = (review) => {
//   return fetch(API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(review),
//   });
// };

// export const getReviews = (movieId) => {
//   return fetch(`${API_URL}/${movieId}`).then((res) => res.json());
// };

// export const updateReview = (id, payload) => {
//   return fetch(`${API_URL}/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
// };

// export const deleteReview = (id) => {
//   return fetch(`${API_URL}/${id}`, {
//     method: "DELETE",
//   });
// };




const API_URL = "http://localhost:5000/api/reviews";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function addReview(review, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(review),
  });
  return res.json();
}

export async function getReviews(movieId) {
  const res = await fetch(`${API_URL}/${movieId}`);
  return res.json();
}

export async function updateReview(id, payload, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteReview(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders(token) },
  });
  return res.json();
}
