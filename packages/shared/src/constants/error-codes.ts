import { ErrorCode } from '../enums/error-code.enum.js';

export const ERROR_CODE_DESCRIPTIONS: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: 'The request payload contains invalid parameter fields.',
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.UNAUTHORIZED]: 'Authentication is required to perform this action.',
  [ErrorCode.FORBIDDEN]: 'Access to the specified resource is forbidden.',
  [ErrorCode.FILE_TOO_LARGE]: 'Uploaded file size exceeds the allowed maximum threshold.',
  [ErrorCode.UNSUPPORTED_MEDIA_TYPE]: 'Provided media format or MIME type is not supported.',
  [ErrorCode.PROCESSING_FAILED]: 'FFmpeg video processing encountered an unrecoverable error.',
  [ErrorCode.STORAGE_ERROR]: 'An error occurred while accessing object or disk storage.',
  [ErrorCode.QUEUE_ERROR]: 'Job queue operation failed.',
  [ErrorCode.JOB_EXPIRED]: 'The requested video job has expired and its files have been purged.',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'An unhandled internal server error occurred.'
};
