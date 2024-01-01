interface IQueue<T> {
  enqueue(item: T): void
  dequeue(): T | undefined
  size(): number
  isEmpty(): boolean
}

class EmptyQueueException extends Error {
  constructor() {
    super('Queue is empty')
  }
}

export class Queue<T> implements IQueue<T> {
  private storage: T[] = []

  constructor(private capacity: number = Infinity) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw Error('Queue has reached max capacity, you cannot add more items')
    }
    this.storage.push(item)
  }
  dequeue(): T | undefined {
    if (this.isEmpty()) throw new EmptyQueueException()
    return this.storage.shift()
  }
  peek(): T | undefined {
    if (this.isEmpty()) throw new EmptyQueueException()
    return this.storage[0]
  }
  size(): number {
    return this.storage.length
  }
  isEmpty(): boolean {
    return this.size() === 0
  }
}
