export default class Queue<T> {
	private container: Array<T> = [];
	constructor() {
	}

	enqueue(item: T) {
		this.container.push(item);
	}

	dequeue(): T | undefined {
		return this.container.shift();
	}

	length(): number {
		return this.container.length;
	}

}
