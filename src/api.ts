
// Extend ImportMeta to include 'env'
declare global {
	interface ImportMetaEnv {
		VITE_API_BASE?: string;
		[key: string]: any;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

// TypeScript Interfaces
export interface FastSession {
	id: number;
	startAt: string;
	endAt: string | null;
	duration: string;
}

export interface FastStatus {
	active: boolean;
	hours?: number;
	minutes?: number;
	since?: string;
}

export interface ApiError {
	timestamp: string;
	status: number;
	error: string;
	message: string;
	path: string;
}

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/fast';

// Helper for error handling
async function handleResponse<T>(r: Response): Promise<T> {
	if (!r.ok) {
		let err: ApiError | string;
		try {
			err = await r.json();
		} catch {
			err = await r.text();
		}
		if (typeof err === 'object' && 'message' in err) {
			throw new Error((err as ApiError).message);
		}
		throw new Error(typeof err === 'string' ? err : 'API Error');
	}
	return r.json();
}

export async function startFast(): Promise<FastSession> {
	const r = await fetch(`${BASE}/start`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	});
	return handleResponse<FastSession>(r);
}

export async function stopFast(): Promise<FastSession> {
	const r = await fetch(`${BASE}/stop`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	});
	return handleResponse<FastSession>(r);
}

export async function statusFast(): Promise<FastStatus> {
	const r = await fetch(`${BASE}/status`);
	return handleResponse<FastStatus>(r);
}

export async function historyFast(): Promise<FastSession[]> {
	const r = await fetch(`${BASE}/history`);
	return handleResponse<FastSession[]>(r);
}

export async function healthCheck(): Promise<any> {
	const r = await fetch('http://localhost:8080/actuator/health');
	return handleResponse<any>(r);
}
