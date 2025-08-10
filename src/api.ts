
// Extend ImportMeta to include 'env'
declare global {
	interface ImportMetaEnv {
		VITE_API_BASE?: string;
		VITE_USE_MOCK_DATA?: string;
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
	goalHours?: number;
}

export interface ApiError {
	timestamp: string;
	status: number;
	error: string;
	message: string;
	path: string;
}

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/fast';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock Data Store
class MockDataStore {
	private currentSession: FastSession | null = null;
	private sessions: FastSession[] = [
		{
			id: 1,
			startAt: '2025-08-08T18:00:00Z',
			endAt: '2025-08-09T10:30:00Z',
			duration: '16h 30m'
		},
		{
			id: 2,
			startAt: '2025-08-07T20:00:00Z',
			endAt: '2025-08-08T14:00:00Z',
			duration: '18h 0m'
		},
		{
			id: 3,
			startAt: '2025-08-06T19:30:00Z',
			endAt: '2025-08-07T12:45:00Z',
			duration: '17h 15m'
		},
		{
			id: 4,
			startAt: '2025-08-05T21:00:00Z',
			endAt: '2025-08-06T15:30:00Z',
			duration: '18h 30m'
		},
		{
			id: 5,
			startAt: '2025-08-04T18:45:00Z',
			endAt: '2025-08-05T11:15:00Z',
			duration: '16h 30m'
		}
	];
	private nextId = 6;
	private goalHours = 16;

	startFast(goalHours?: number): FastSession {
		if (this.currentSession) {
			throw new Error('Es läuft bereits ein Fasten');
		}
		
		this.goalHours = goalHours || 16;
		this.currentSession = {
			id: this.nextId++,
			startAt: new Date().toISOString(),
			endAt: null,
			duration: '0h 0m'
		};
		
		return { ...this.currentSession };
	}

	stopFast(): FastSession {
		if (!this.currentSession) {
			throw new Error('Kein aktives Fasten gefunden');
		}
		
		const endTime = new Date();
		const startTime = new Date(this.currentSession.startAt);
		const durationMs = endTime.getTime() - startTime.getTime();
		const hours = Math.floor(durationMs / (1000 * 60 * 60));
		const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
		
		const completedSession = {
			...this.currentSession,
			endAt: endTime.toISOString(),
			duration: `${hours}h ${minutes}m`
		};
		
		this.sessions.unshift(completedSession);
		this.currentSession = null;
		
		return completedSession;
	}

	getStatus(): FastStatus {
		if (!this.currentSession) {
			return { active: false };
		}
		
		const now = new Date();
		const startTime = new Date(this.currentSession.startAt);
		const durationMs = now.getTime() - startTime.getTime();
		const hours = Math.floor(durationMs / (1000 * 60 * 60));
		const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
		
		return {
			active: true,
			hours,
			minutes,
			since: this.currentSession.startAt,
			goalHours: this.goalHours
		};
	}

	getHistory(): FastSession[] {
		return [...this.sessions];
	}

	getHealthCheck() {
		return {
			status: 'UP',
			components: {
				db: { status: 'UP' },
				diskSpace: { status: 'UP' }
			}
		};
	}
}

const mockStore = new MockDataStore();

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

// Mock API delay simulation
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

export async function startFast(goalHours?: number): Promise<FastSession> {
	if (USE_MOCK) {
		await mockDelay();
		return mockStore.startFast(goalHours);
	}
	
	const body = goalHours ? JSON.stringify({ goalHours }) : undefined;
	const r = await fetch(`${BASE}/start`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body
	});
	return handleResponse<FastSession>(r);
}

export async function stopFast(): Promise<FastSession> {
	if (USE_MOCK) {
		await mockDelay();
		return mockStore.stopFast();
	}
	
	const r = await fetch(`${BASE}/stop`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	});
	return handleResponse<FastSession>(r);
}

export async function statusFast(): Promise<FastStatus> {
	if (USE_MOCK) {
		await mockDelay();
		return mockStore.getStatus();
	}
	
	const r = await fetch(`${BASE}/status`);
	return handleResponse<FastStatus>(r);
}

export async function historyFast(): Promise<FastSession[]> {
	if (USE_MOCK) {
		await mockDelay();
		return mockStore.getHistory();
	}
	
	const r = await fetch(`${BASE}/history`);
	return handleResponse<FastSession[]>(r);
}

export async function healthCheck(): Promise<any> {
	if (USE_MOCK) {
		await mockDelay();
		return mockStore.getHealthCheck();
	}
	
	const r = await fetch('http://localhost:8080/actuator/health');
	return handleResponse<any>(r);
}

// Export for debugging
export const isMockMode = USE_MOCK;
export const apiBase = BASE;
