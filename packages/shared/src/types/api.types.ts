import { ErrorCode } from '../enums/error-code.enum.js';

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: ErrorCode | string;
    readonly message: string;
    readonly details?: unknown;
  };
  readonly timestamp: string;
}

export interface HealthCheckResponse {
  readonly status: 'ok' | 'degraded' | 'error';
  readonly uptime: number;
  readonly version: string;
  readonly timestamp: string;
}
