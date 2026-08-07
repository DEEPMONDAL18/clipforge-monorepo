import { ApiResponse } from '@clipforge/shared';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiClient {
  public static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API GET request failed with status ${response.status}`);
    }

    const payload: ApiResponse<T> = await response.json();
    if (!payload.success || !payload.data) {
      throw new Error(payload.error?.message || 'API request failed');
    }

    return payload.data;
  }

  public static async post<T, B>(endpoint: string, body: B): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`API POST request failed with status ${response.status}`);
    }

    const payload: ApiResponse<T> = await response.json();
    if (!payload.success || !payload.data) {
      throw new Error(payload.error?.message || 'API request failed');
    }

    return payload.data;
  }

  public static async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API DELETE request failed with status ${response.status}`);
    }

    const payload: ApiResponse<T> = await response.json();
    if (!payload.success || !payload.data) {
      throw new Error(payload.error?.message || 'API request failed');
    }

    return payload.data;
  }
}
