import React, { useEffect, useState } from "react";
import { api, asArray } from "./api";

export default function Roles({ token }) {
  const headers = token ? { token } : {};
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    const data = await api.get("/roles/", headers);
    setItems(asArray(data));
  }
  useEffect(() => { load().catch(e => setMsg(e.message)); }, []); // eslint-disable-line

  async function create(e) {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/roles/", { name, description }, headers);
      setName(""); setDescription("");
      await load();
      setMsg("Role created");
    } catch (e) { setMsg(e.message); }
  }

  async function remove(id) {
    setMsg("");
    try { await api.delete(`/roles/${id}/`, headers); await load(); }
    catch (e) { setMsg(e.message); }
  }

  return (
    <div>
      <h3>Roles</h3>
      {msg && <div style={{ color: /created|deleted/i.test(msg) ? "green" : "crimson" }}>{msg}</div>}
      <form onSubmit={create} style={{ display: "grid", gap: 8, margin: "12px 0" }}>
        <input placeholder="Role name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead><tr style={{ borderBottom: "1px solid #ccc" }}><th>ID</th><th>Name</th><th>Description</th><th/></tr></thead>
        <tbody>
          {items.map(r => (
            <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{r.id}</td><td>{r.name}</td><td>{r.description}</td>
              <td><button onClick={() => remove(r.id)}>Delete</button></td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={4} style={{ color:"#888" }}>No roles</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
