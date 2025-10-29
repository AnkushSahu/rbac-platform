import React, { useState } from "react";
import { api } from "./api";
import { getToken, setToken, clearToken } from "./api";

export default function AuthBar({ onChange }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const token = getToken();
  const [msg, setMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    try {
      // DRF TokenAuth login endpoint
      const data = await api.post("/token/", { username, password }, { token: "" });
      setToken(data.access);
//       const data = await api.post("/token-auth/", { username, password }, { token: "" });
//       setToken(data.token);
      setUsername(""); setPassword("");
      setMsg("Logged in");
      onChange?.(data.token);
    } catch (err) {
      setMsg("Invalid credentials");
    }
  }

  function handleLogout() {
    clearToken();
    setMsg("Logged out");
    onChange?.("");
  }

  if (token) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#0a0" }}>Authenticated</span>
        <button onClick={handleLogout}>Logout</button>
        {msg && <span style={{ fontSize: 12, color: "#666" }}>{msg}</span>}
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ padding: 6 }}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: 6 }}
      />
      <button type="submit">Login</button>
      {msg && <span style={{ fontSize: 12, color: "#a00" }}>{msg}</span>}
    </form>
  );
}
