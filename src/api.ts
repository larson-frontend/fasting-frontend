const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';
async function j(r: Response) { if (!r.ok) throw new Error(await r.text()); return r.json(); }
export const startFast = () => fetch(`${BASE}/fast/start`, { method: 'POST' }).then(j);
export const stopFast  = () => fetch(`${BASE}/fast/stop`,  { method: 'POST' }).then(j);
export const statusFast = () => fetch(`${BASE}/fast/status`).then(j);
export const historyFast = () => fetch(`${BASE}/fast/history`).then(j);
