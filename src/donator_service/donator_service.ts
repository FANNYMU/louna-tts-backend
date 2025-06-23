import Queue from "../queue/queue";
import { saveDonation } from "../database/database";

interface Donator {
	name: string,
	getMessage: () => string,
	amount: number,
}

export default class DonatorService {
	donators: Queue<Donator> = new Queue<Donator>();
	constructor() {}

	addDonator(donator: Donator) {
		this.donators.enqueue(donator);
		saveDonation(donator.name, donator.getMessage(), donator.amount);
	}

	getDonator(): Donator | undefined {
		return this.donators.dequeue();
	}
}

const donatorService: DonatorService = new DonatorService();
export { donatorService };
