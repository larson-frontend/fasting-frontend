/**
 * HTTP Client
 * Zentrale HTTP-Kommunikation mit Error Handling
 */

import type { ApiError } from '../types/api';
import { config, generateRequestId } from './config';

/**
 * Behandelt HTTP Response und Errors
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: any;
    
    // Read response as text first, then try to parse as JSON
    const responseText = await response.text();
    
    try {
      errorData = JSON.parse(responseText);
    } catch {
      // Fallback if response is not JSON
      throw new Error(responseText || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Handle structured error responses
    if (errorData.error && errorData.message) {
      const error = new Error(errorData.message);
      (error as any).code = errorData.error;
      (error as any).status = response.status;
      throw error;
    }
    
    // Handle generic API errors
    if (errorData.message) {
      throw new Error(errorData.message);
    }
    
    // Fallback error
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * HTTP Client für API Requests
 */
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

function log(level: typeof config.logLevel, ...args: any[]) {
  const order = { debug: 10, info: 20, warn: 30, error: 40 } as const;
  if (order[level] < order[config.logLevel]) return;
  // Map to console
  const fn = level === 'debug' ? console.debug : level === 'info' ? console.info : level === 'warn' ? console.warn : console.error;
  fn('[http]', ...args);
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = config.apiBase) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(method: HttpMethod, endpoint: string, body?: any, options?: { headers?: Record<string,string>, timeoutMs?: number, retry?: boolean }): Promise<T> {
    const controller = new AbortController();
    const timeout = options?.timeoutMs ?? config.requestTimeoutMs;
    const id = setTimeout(() => controller.abort(), timeout);
    const requestId = generateRequestId();

    const headers: Record<string,string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...options?.headers
    };

    const url = `${this.baseUrl}${endpoint}`;
    const maxRetries = method === 'GET' ? config.httpMaxRetries : 0;
    let attempt = 0;
    let lastError: any;
    const initialDelay = config.httpRetryInitialDelayMs;

    while (attempt <= maxRetries) {
      try {
        if (attempt > 0) {
          log('warn', `Retrying ${method} ${url} attempt ${attempt}/${maxRetries}`);
        } else {
          log('debug', `${method} ${url}`, { requestId });
        }
        const response = await fetch(url, {
          method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          });
        clearTimeout(id);
        return await handleResponse<T>(response);
      } catch (err: any) {
        lastError = err;
        const isAbort = err?.name === 'AbortError';
        const transient = isAbort || (err?.status && err.status >= 500);
        if (attempt < maxRetries && transient) {
          const delay = initialDelay * Math.pow(config.httpRetryBackoffFactor, attempt);
          await new Promise(res => setTimeout(res, delay));
          attempt++;
          continue;
        }
        log('error', `${method} ${url} failed`, err);
        throw err;
      }
    }
    throw lastError;
  }

  get<T>(endpoint: string, options?: { headers?: Record<string,string>, timeoutMs?: number }): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }
  post<T>(endpoint: string, body?: any, options?: { headers?: Record<string,string>, timeoutMs?: number }): Promise<T> {
    return this.request<T>('POST', endpoint, body, options);
  }
  patch<T>(endpoint: string, body?: any, options?: { headers?: Record<string,string>, timeoutMs?: number }): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, options);
  }
  put<T>(endpoint: string, body?: any, options?: { headers?: Record<string,string>, timeoutMs?: number }): Promise<T> {
    return this.request<T>('PUT', endpoint, body, options);
  }
  delete<T>(endpoint: string, options?: { headers?: Record<string,string>, timeoutMs?: number }): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }
}

// Default HTTP Client Instance
export const httpClient = new HttpClient();
