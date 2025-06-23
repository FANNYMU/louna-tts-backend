import { databaseService } from './database';

export interface DonationRecord {
	id: string;
	created_at: string;
	donator_name: string;
	amount: number;
	message: string | null;
	platform: string;
	timestamp: number;
}

export default class DonationRepository {
	private static instance: DonationRepository;

	private constructor() {}

	public static getInstance(): DonationRepository {
		if (!DonationRepository.instance) {
			DonationRepository.instance = new DonationRepository();
		}
		return DonationRepository.instance;
	}

	public save(donation: DonationRecord): void {
		const db = databaseService.getDb();
		const stmt = db.prepare(`
			INSERT INTO donations (id, created_at, donator_name, amount, message, platform, timestamp)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`);
		
		stmt.run(
			donation.id,
			donation.created_at,
			donation.donator_name,
			donation.amount,
			donation.message,
			donation.platform,
			donation.timestamp
		);
	}

	public getAll(): DonationRecord[] {
		const db = databaseService.getDb();
		const stmt = db.prepare('SELECT * FROM donations ORDER BY timestamp DESC');
		return stmt.all() as DonationRecord[];
	}

	public getLatest(limit: number = 10): DonationRecord[] {
		const db = databaseService.getDb();
		const stmt = db.prepare('SELECT * FROM donations ORDER BY timestamp DESC LIMIT ?');
		return stmt.all(limit) as DonationRecord[];
	}

	public getByPlatform(platform: string): DonationRecord[] {
		const db = databaseService.getDb();
		const stmt = db.prepare('SELECT * FROM donations WHERE platform = ? ORDER BY timestamp DESC');
		return stmt.all(platform) as DonationRecord[];
	}
}

const donationRepository = DonationRepository.getInstance();
export { donationRepository }; 