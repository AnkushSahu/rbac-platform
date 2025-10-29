import React, { useEffect, useState } from "react";
import { api, asArray } from "./api";

export default function Assignments({ token }) {
  const headers = token ? { token } : {};
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setMsg(""); setLoading(true);
    try {
      const [t, r, a] = await Promise.all([
        api.get("/teams/", headers),
        api.get("/roles/", headers),
        api.get("/assignments/", headers),
      ]);
      setTeams(asArray(t));
      setRoles(asArray(r));
      setAssignments(asArray(a));
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []); // eslint-disable-line

  async function assign() {
    setMsg("");
    if (!teamId || !roleId) { setMsg("Select team and role"); return; }
    try { await api.post("/assignments/", { team: Number(teamId), role: Number(roleId) }, headers); await refresh(); setTeamId(""); setRoleId(""); setMsg("Assigned"); }
    catch (e) { setMsg(e.message); }
  }
  async function unassign(id) {
    setMsg("");
    try { await api.delete(`/assignments/${id}/`, headers); await refresh(); setMsg("Unassigned"); }
    catch (e) { setMsg(e.message); }
  }

  return (
    <div>
      <h3>Assignments (Team ↔ Role)</h3>
      {msg && <div style={{ color: /Assigned|Unassigned/i.test(msg) ? "green" : "crimson" }}>{msg}</div>}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <select value={teamId} onChange={e => setTeamId(e.target.value)} style={{ flex: 1 }}>
          <option value="">Select Team</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={roleId} onChange={e => setRoleId(e.target.value)} style={{ flex: 1 }}>
          <option value="">Select Role</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <button onClick={assign}>Assign</button>
      </div>

      {loading ? <div>Loading…</div> : (
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid #ccc" }}><th>ID</th><th>Team</th><th>Role</th><th/></tr></thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{a.id}</td><td>{a.team_name}</td><td>{a.role_name}</td>
                <td><button onClick={() => unassign(a.id)}>Unassign</button></td>
              </tr>
            ))}
            {assignments.length === 0 && <tr><td colSpan={4} style={{ color:"#888" }}>No assignments</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
