import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, fetchMe } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw).user : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw).token : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optional: validate token on load
    async function validate() {
      if (!token) return;
      try {
        const me = await fetchMe(token);
        if (me?.username) setUser(me);
      } catch {
        logout();
      }
    }
    validate();
  }, [token]);

  async function login({ username, password }) {
    setLoading(true);
    const data = await loginUser({ username, password });
    setLoading(false);
    if (data?.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("auth", JSON.stringify({ token: data.token, user: data.user }));
      return { ok: true };
    } else {
      return { ok: false, error: data.error || "Login failed" };
    }
  }

  async function register({ username, password }) {
    setLoading(true);
    const data = await registerUser({ username, password });
    setLoading(false);
    if (data?.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("auth", JSON.stringify({ token: data.token, user: data.user }));
      return { ok: true };
    } else {
      return { ok: false, error: data.error || "Registration failed" };
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
