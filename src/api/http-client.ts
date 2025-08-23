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
    let errorData: any;
    
    try {
      errorData = await response.json();
    } catch {
      // Fallback if response is not JSON
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
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
export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = config.apiBase) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });
    return handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: any, options?: { headers?: Record<string, string> }): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body?: any, options?: { headers?: Record<string, string> }): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    return handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse<T>(response);
  }
}

// Default HTTP Client Instance
export const httpClient = new HttpClient();
