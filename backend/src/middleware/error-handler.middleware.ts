import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { errorResponse } from '../utils/response.js';

export function errorHandlerMiddleware(
  error: FastifyError | AppError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  logger.error(
    {
      err: error,
      url: request.raw.url,
      method: request.raw.method
    },
    'API Request Error Encountered'
  );

  if (error instanceof AppError) {
    reply.status(error.statusCode).send(errorResponse(error.message, error.name));
    return;
  }

  // Fastify Schema Validation Error
  if ('validation' in error && error.validation) {
    reply
      .status(400)
      .send(errorResponse('Invalid request parameters', 'VALIDATION_ERROR', error.validation));
    return;
  }

  // Default internal error response
  reply
    .status(500)
    .send(
      errorResponse(
        process.env.NODE_ENV === 'production'
          ? 'An internal server error occurred'
          : error.message,
        'INTERNAL_SERVER_ERROR'
      )
    );
}
