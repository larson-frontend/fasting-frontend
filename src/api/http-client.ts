/**
 * HTTP Client
 * Zentrale HTTP-Kommunikation mit Error Handling
 */

import type { ApiError } from '../types/api';
import { config } from './config';

/**
 * Behandelt HTTP Response und Errors
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let error: ApiError | string;
    
    try {
      error = await response.json();
    } catch {
      error = await response.text();
    }
    
    if (typeof error === 'object' && 'message' in error) {
      throw new Error((error as ApiError).message);
    }
    
    throw new Error(typeof error === 'string' ? error : 'API Error');
  }
  
  return response.json();
}

/**
 * HTTP Client für API Requests
 */
export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = config.apiBase) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    return handleResponse<T>(response);
  }
}

// Default HTTP Client Instance
export const httpClient = new HttpClient();
