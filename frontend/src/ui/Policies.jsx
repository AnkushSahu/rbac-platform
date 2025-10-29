import React, { useEffect, useState } from "react";
import { api, asArray } from "./api";

export default function Policies({ token }) {
  const headers = token ? { token } : {};
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  // form state
  const [action, setAction] = useState("");
  const [resource, setResource] = useState("");
  const [effect, setEffect] = useState("allow"); // allow | deny

  async function refresh() {
    setLoading(true); setError(""); setOk("");
    try {
      const data = await api.get("/policies/", headers);
      setPolicies(asArray(data));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []); // eslint-disable-line

  async function createPolicy(e) {
    e.preventDefault();
    setError(""); setOk("");
    try {
      await api.post("/policies/", { action, resource, effect }, headers);
      setOk("Policy created");
      setAction(""); setResource(""); setEffect("allow");
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function removePolicy(id) {
    setError(""); setOk("");
    try {
      await api.delete(`/policies/${id}/`, headers);
      setOk("Policy deleted");
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h3>Policies</h3>
      {error && <div style={{ color: "crimson" }}>{error}</div>}
      {ok && <div style={{ color: "green" }}>{ok}</div>}

      <form onSubmit={createPolicy} style={{ display: "grid", gap: 8, margin: "12px 0" }}>
        <input placeholder="action (e.g., iam:ListUsers)"
               value={action} onChange={e => setAction(e.target.value)} required />
        <input placeholder="resource (e.g., * or arn:aws:s3:::bucket/*)"
               value={resource} onChange={e => setResource(e.target.value)} required />
        <select value={effect} onChange={e => setEffect(e.target.value)}>
          <option value="allow">allow</option>
          <option value="deny">deny</option>
        </select>
        <button type="submit">Create Policy</button>
      </form>

      {loading ? <div>Loading…</div> : (
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              <th>ID</th><th>Action</th><th>Resource</th><th>Effect</th><th>Created</th><th></th>
            </tr>
          </thead>
          <tbody>
            {policies.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{p.id}</td>
                <td>{p.action}</td>
                <td>{p.resource}</td>
                <td>{p.effect}</td>
                <td>{new Date(p.created_at).toLocaleString()}</td>
                <td><button onClick={() => removePolicy(p.id)}>Delete</button></td>
              </tr>
            ))}
            {policies.length === 0 && (
              <tr><td colSpan={6} style={{ color:"#888" }}>No policies</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
