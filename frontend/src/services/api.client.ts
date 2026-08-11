import { ApiResponse } from '@clipforge/shared';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code = 'request_failed') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

function buildInit(method: string, body?: unknown, options?: RequestOptions): RequestInit {
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }
  if (options?.signal) {
    init.signal = options.signal;
  }
  return init;
}

export class ApiClient {
  public static getBaseUrl(): string {
    return BASE_URL;
  }

  public static async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, buildInit('GET', undefined, options));
    } catch {
      throw new ApiError('The server could not be reached.', 0, 'connection_lost');
    }

    if (!response.ok) {
      throw new ApiError(`API GET request failed with status ${response.status}`, response.status);
    }

    const payload: ApiResponse<T> = await response.json();
    if (!payload.success || payload.data === undefined) {
      throw new ApiError(
        payload.error?.message || 'API request failed',
        response.status,
        String(payload.error?.code || 'request_failed')
      );
    }

    return payload.data;
  }

  public static async post<T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: RequestOptions
  ): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, buildInit('POST', body, options));
    } catch {
      throw new ApiError('The server could not be reached.', 0, 'connection_lost');
    }

    if (!response.ok) {
      throw new ApiError(`API POST request failed with status ${response.status}`, response.status);
    }

    const payload: ApiResponse<T> = await response.json();
    if (!payload.success || payload.data === undefined) {
      throw new ApiError(
        payload.error?.message || 'API request failed',
        response.status,
        String(payload.error?.code || 'request_failed')
      );
    }

    return payload.data;
  }

  public static async put<T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: RequestOptions
  ): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, buildInit('PUT', body, options));
    } catch {
      throw new ApiError('The server could not be reached.', 0, 'connection_lost');
    }

    if (!response.ok) {
      throw new ApiError(`API PUT request failed with status ${response.status}`, response.status);
    }

    const payload: ApiResponse<T> = await response.json();
    if (!payload.success || payload.data === undefined) {
      throw new ApiError(
        payload.error?.message || 'API request failed',
        response.status,
        String(payload.error?.code || 'request_failed')
      );
    }

    return payload.data;
  }

  public static async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, buildInit('DELETE', undefined, options));
    } catch {
      throw new ApiError('The server could not be reached.', 0, 'connection_lost');
    }

    if (!response.ok) {
      throw new ApiError(
        `API DELETE request failed with status ${response.status}`,
        response.status
      );
    }

    const payload: ApiResponse<T> = await response.json();
    if (!payload.success || payload.data === undefined) {
      throw new ApiError(
        payload.error?.message || 'API request failed',
        response.status,
        String(payload.error?.code || 'request_failed')
      );
    }

    return payload.data;
  }
}
