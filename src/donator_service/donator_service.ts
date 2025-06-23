import Queue from "../queue/queue";

interface Donator {
	name: string,
	getMessage: () => string,
}
export default class DonatorService {
	donators: Queue<Donator> = new Queue<Donator>();
	constructor() {

	}

	addDonator(donator: Donator) {
		this.donators.enqueue(donator);
	}

	getDonator(): Donator | undefined {
		return this.donators.dequeue();
	}
}

const donatorService: DonatorService = new DonatorService();
export { donatorService };
