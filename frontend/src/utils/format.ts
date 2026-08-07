const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
const BYTES_PER_UNIT = 1024;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;

export function formatBytes(bytes: number, fractionDigits = 1): string {
  if (bytes <= 0) return '0 B';
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(BYTES_PER_UNIT)),
    BYTE_UNITS.length - 1
  );
  const value = bytes / Math.pow(BYTES_PER_UNIT, exponent);
  return `${value.toFixed(exponent === 0 ? 0 : fractionDigits)} ${BYTE_UNITS[exponent]}`;
}

export function formatBitrate(bytesPerSecond: number): string {
  return `${formatBytes(bytesPerSecond)}/s`;
}

/** 01:23:45 style duration, used for media lengths. */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safe / SECONDS_PER_HOUR);
  const minutes = Math.floor((safe % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = safe % SECONDS_PER_MINUTE;
  const pad = (value: number) => value.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/** "58m 42s" style countdown, used for ETAs and expiry. */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safe / SECONDS_PER_HOUR);
  const minutes = Math.floor((safe % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = safe % SECONDS_PER_MINUTE;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatClipLength(seconds: number): string {
  if (seconds % SECONDS_PER_MINUTE === 0) {
    const minutes = seconds / SECONDS_PER_MINUTE;
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
  return formatDuration(seconds);
}

export function formatResolution(width: number, height: number): string {
  return `${width} × ${height}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatPercentage(value: number): string {
  return `${Math.min(100, Math.max(0, Math.round(value)))}%`;
}
