export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid request parameters') {
    super(message, 400);
  }
}

export class FFmpegError extends AppError {
  constructor(message = 'FFmpeg video processing failure') {
    super(message, 500);
  }
}

export class StorageError extends AppError {
  constructor(message = 'File storage operation failed') {
    super(message, 500);
  }
}

export class QueueError extends AppError {
  constructor(message = 'Queue operation failed') {
    super(message, 500);
  }
}
