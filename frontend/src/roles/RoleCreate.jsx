// frontend/src/roles/RoleCreate.jsx
import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";

export default function RoleCreate({ token, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamIds, setTeamIds] = useState([]); // selected team IDs (array)
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGet("/api/teams/", token);
        if (mounted) setTeams(data);
      } catch (e) {
        setError(`Failed to load teams: ${e.message}`);
      } finally {
        if (mounted) setLoadingTeams(false);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  const handleMultiChange = (e) => {
    const arr = Array.from(e.target.selectedOptions).map(o => Number(o.value));
    setTeamIds(arr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setOkMsg("");

    try {
      const payload = {
        name,
        description,
        team_ids: teamIds, // <-- backend expects this
      };
      const created = await apiPost("/api/roles/", payload, token);
      setOkMsg(`Role "${created.name}" created with ${created.teams?.length ?? 0} team(s).`);
      setName("");
      setDescription("");
      setTeamIds([]);
      if (onCreated) onCreated(created);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Create Role</h2>
      {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
      {okMsg && <div style={{ color: "green", marginBottom: 8 }}>{okMsg}</div>}

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Role name
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            placeholder="e.g., Admin"
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Description
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            placeholder="e.g., Full access"
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Teams (multi-select)
          {loadingTeams ? (
            <div>Loading teams…</div>
          ) : (
            <select
              multiple
              value={teamIds.map(String)}
              onChange={handleMultiChange}
              size={Math.min(8, Math.max(3, teams.length))}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </label>

        <button disabled={submitting} type="submit">
          {submitting ? "Creating…" : "Create Role"}
        </button>
      </form>
    </div>
  );
}
