import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    const res = await register({ username, password });
    if (res.ok) navigate(-1);
    else setErr(res.error);
  }

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
      <button type="submit">Register</button>
    </form>
  );
}
