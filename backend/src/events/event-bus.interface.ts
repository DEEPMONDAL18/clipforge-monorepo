import { JobEventType } from './job-events.enum.js';

export interface DomainEvent<T = unknown> {
  readonly id: string;
  readonly eventType: JobEventType;
  readonly jobId: string;
  readonly payload: T;
  readonly timestamp: string;
}

export type EventHandler<T = unknown> = (event: DomainEvent<T>) => Promise<void>;

/**
 * Event-Driven Architecture Interface (PubSub / Event Emitter)
 */
export interface IEventBus {
  publish<T>(event: DomainEvent<T>): Promise<void>;
  subscribe<T>(eventType: JobEventType, handler: EventHandler<T>): void;
  unsubscribe<T>(eventType: JobEventType, handler: EventHandler<T>): void;
}
