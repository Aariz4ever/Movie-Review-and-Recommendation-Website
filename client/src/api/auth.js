const AUTH_URL = "http://localhost:5000/auth";

export async function registerUser({ username, password }) {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function loginUser({ username, password }) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function fetchMe(token) {
  const res = await fetch(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
