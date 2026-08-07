export interface IJobContext<T = unknown> {
  readonly jobId: string;
  readonly payload: T;
}

export interface IJob<T = unknown, R = void> {
  readonly name: string;
  execute(context: IJobContext<T>): Promise<R>;
}

export abstract class BaseJob<T = unknown, R = void> implements IJob<T, R> {
  abstract readonly name: string;
  abstract execute(context: IJobContext<T>): Promise<R>;
}
