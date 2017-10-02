export as namespace ObjectEmitter;

export class ObjectEmitter {
  emit<T>(obj: T): boolean;

  off<T>(obj: T, cb: (T) => any): this;

  on<T>(obj: T, cb: (T) => any): this;

  once<T>(obj: T, cb: (T) => any): this;

  removeListener<T>(obj: T, cb: (T) => any): this;

  removeAllListeners<T>(obj: T): this;
}
