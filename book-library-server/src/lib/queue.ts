export class Queue {
  concurrency = 1;

  queuedTasks: {
    name?: 'all' | string;
    addedAt: number;
    fn: () => Promise<any>;
  }[] = [];

  tasksRunning = false;

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
      this.queuedTasks.push({ name, addedAt: Date.now(), fn: task });

      this.run(true).finally(() => resolve());
    });
  }

  isCompleted(): boolean {
    return !this.queuedTasks?.length || this.queuedTasks.length === 0;
  }

  private async run(runOnce?: boolean): Promise<void> {
    try {
      const concurrency = this.concurrency;
      const tasks: {
        name?: string;
        addedAt: number;
        fn: () => Promise<any>;
      }[] = [];

      this.tasksRunning = true;

      for (let i = 0; i < concurrency; i++) {
        const task = this.queuedTasks.shift();

        if (!task) {
          return;
        }

        tasks.push(task);
      }

      await Promise.all(
        tasks.map(async (task) => {
          await task.fn();

          this.emit('completedSingleFn', { name: task?.name || '' });
        }),
      );

      this.tasksRunning = false;

      if (this.queuedTasks.length <= 0) {
        this.emit('completed', { name: 'all' });
      }
    } catch (err) {
      console.error(err);
      this.tasksRunning = false;
    }

    if (!runOnce) {
      this.run();
    }
  }

  waitForCompletion(): Promise<void> {
    return new Promise((resolve) => {
      const onComplete = (params: { name: string }) => {
        if (params?.name === 'all') {
          resolve();
        }

        // cleanup
        return this.removeEventListener('completed', onComplete);
      };

      if (this.isCompleted() && !this.tasksRunning) {
        resolve();
      } else {
        this.addEventListener('completed', onComplete);
      }
    });
  }

  destroy() {
    this.queuedTasks = [];
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
