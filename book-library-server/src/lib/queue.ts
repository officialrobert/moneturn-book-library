import { isEmpty } from 'lodash';

/**
 * Every system has its limits, so in a real live production environment, we handle requests in a queue.
 * At some point, at some scale, a limit is hit—so we handle requests in a queue.
 * The class template below is a simple queue implementation inspired by the 'p-queue' library.
 */
export class Queue {
  concurrency = 1;

  queuedTasks: {
    name?: 'all' | string;
    addedAt: number;
    fn: () => Promise<any>;
  }[] = [];

  tasksRunning = false;
  canStop = false;

  listeners: Record<
    'completed' | 'completedSingleFn',
    ((params: { name: 'all' | string }) => void)[]
  > = {
    completed: [],
    completedSingleFn: [],
  };

  constructor(params: { concurrency: number }) {
    this.concurrency = params.concurrency > 1 ? params.concurrency : 1;
  }

  add<T>(task: () => Promise<T>, name?: string): Promise<void> {
    return new Promise((resolve) => {
      this.canStop = false;
      this.queuedTasks.push({ name, addedAt: Date.now(), fn: task });

      if (this.tasksRunning) {
        return resolve();
      }

      this.run().finally(() => resolve());
    });
  }

  isCompleted(): boolean {
    return isEmpty(this.queuedTasks);
  }

  stop() {
    this.canStop = true;
  }

  start(): Promise<void> {
    return this.run();
  }

  private async run(runOnce?: boolean): Promise<void> {
    try {
      const concurrency = this.concurrency;
      const tasks: {
        name?: string;
        addedAt: number;
        fn: () => Promise<any>;
      }[] = [];
      const canStop = this.canStop;
      this.tasksRunning = true;

      for (let i = 0; i < concurrency; i++) {
        const task = this.queuedTasks.shift();

        if (!task) {
          return;
        }

        tasks.push(task);
      }

      if (!canStop) {
        await Promise.all(
          tasks.map(async (task) => {
            try {
              await task.fn();
              this.emit('completedSingleFn', { name: task?.name || '' });
            } catch (err) {
              console.error(err);
            }
          }),
        );

        this.tasksRunning = false;

        if (isEmpty(this.queuedTasks)) {
          this.emit('completed', { name: 'all' });
        } else if (!runOnce) {
          this.run();
        }
      } else {
        this.tasksRunning = false;
      }
    } catch (err) {
      console.error(err);
      this.tasksRunning = false;
    }
  }

  waitForCompletion(): Promise<void> {
    return new Promise((resolve) => {
      const onComplete = (params: { name: string }) => {
        if (params?.name === 'all') {
          resolve();
          this.removeEventListener('completed', onComplete);
        }
      };

      this.addEventListener('completed', onComplete);

      if (this.isCompleted() && !this.tasksRunning) {
        resolve();
      } else {
        this.removeEventListener('completed', onComplete);
      }
    });
  }

  destroy() {
    this.queuedTasks = [];
    this.listeners = {
      completed: [],
      completedSingleFn: [],
    };
  }

  addEventListener<T>(
    event: 'completed' | 'completedSingleFn',
    listener: (params: { name: string }) => T,
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(listener);
  }

  removeEventListener<T>(
    event: 'completed' | 'completedSingleFn',
    listener: (params: { name: string }) => T,
  ) {
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
  }

  emit(event: 'completed' | 'completedSingleFn', params: { name: string }) {
    this.listeners[event]?.forEach((listener) => listener(params));
  }
}

export const NewBooksQueue = new Queue({
  concurrency: 1,
});
