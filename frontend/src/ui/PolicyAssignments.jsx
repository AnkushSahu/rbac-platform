import React, { useEffect, useState } from "react";
import { api, asArray } from "./api";

export default function PolicyAssignments({ token }) {
  const headers = token ? { token } : {};
  const [roles, setRoles] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [roleId, setRoleId] = useState("");
  const [policyId, setPolicyId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setLoading(true); setError(""); setOk("");
    try {
      const [r, p, rp] = await Promise.all([
        api.get("/roles/", headers),
        api.get("/policies/", headers),
        api.get("/role-policies/", headers),
      ]);
      setRoles(asArray(r));
      setPolicies(asArray(p));
      setAssignments(asArray(rp));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []); // eslint-disable-line

  async function assign() {
    if (!roleId || !policyId) {
      setError("Select a role and a policy");
      return;
    }
    setSubmitting(true); setError(""); setOk("");
    try {
      await api.post("/role-policies/", { role: Number(roleId), policy: Number(policyId) }, headers);
      setOk("Assigned policy to role");
      setRoleId(""); setPolicyId("");
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function unassign(id) {
    setSubmitting(true); setError(""); setOk("");
    try {
      await api.delete(`/role-policies/${id}/`, headers);
      setOk("Unassigned");
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h3>Policy ↔ Role Assignments</h3>
      {error && <div style={{ color: "crimson" }}>{error}</div>}
      {ok && <div style={{ color: "green" }}>{ok}</div>}

      {loading ? <div>Loading…</div> : (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <select value={roleId} onChange={e => setRoleId(e.target.value)} style={{ flex: 1 }}>
              <option value="">Select Role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>

            <select value={policyId} onChange={e => setPolicyId(e.target.value)} style={{ flex: 1 }}>
              <option value="">Select Policy</option>
              {policies.map(p => <option key={p.id} value={p.id}>{p.effect}:{p.action}</option>)}
            </select>

            <button onClick={assign} disabled={submitting}>Assign</button>
          </div>

          <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                <th>ID</th><th>Role</th><th>Policy</th><th>Created</th><th></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>{a.id}</td>
                  <td>{a.role_name}</td>
                  <td>{a.policy_display}</td>
                  <td>{new Date(a.created_at).toLocaleString()}</td>
                  <td><button onClick={() => unassign(a.id)} disabled={submitting}>Unassign</button></td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr><td colSpan={5} style={{ color:"#888" }}>No policy assignments</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
