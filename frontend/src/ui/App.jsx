import React, { useState, useEffect } from "react";
import Teams from "./Teams";
import Roles from "./Roles";
import Assignments from "./Assignments";
import Policies from "./Policies";
import PolicyAssignments from "./PolicyAssignments";
import { getToken } from "./api";
import AuthBar from "./AuthBar";

export default function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || "/teams");
  const [token, setToken] = useState("");

  useEffect(() => { setToken(getToken()); }, []);
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.slice(1) || "/teams");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const link = (p, label) => (
    <a href={`#${p}`} style={{ color: route === p ? "blue" : "black", textDecoration: "none" }}>{label}</a>
  );

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <header style={{ marginBottom: 20, borderBottom: "1px solid #ddd", paddingBottom: 10 }}>
        <h2>RBAC Platform</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {link("/teams", "teams")}
            {link("/roles", "roles")}
            {link("/assignments", "assignments")}
            {link("/policies", "policies")}
            {link("/policy-assignments", "policy-assignments")}
          </nav>
          <AuthBar onChange={(t) => setToken(t)} /> {/* 🔹 NEW */}
        </div>
      </header>
      <main>
        {route === "/teams" && <Teams token={token} />}
        {route === "/roles" && <Roles token={token} />}
        {route === "/assignments" && <Assignments token={token} />}
        {route === "/policies" && <Policies token={token} />}
        {route === "/policy-assignments" && <PolicyAssignments token={token} />}
      </main>
    </div>
  );
}
