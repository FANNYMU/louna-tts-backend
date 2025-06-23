import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export default class DatabaseService {
	private static instance: DatabaseService;
	private db: Database.Database;

	private constructor() {
		const dataDir = path.join(__dirname, '../../data');
		const dbPath = path.join(dataDir, 'database.sqlite');
		
		// Make sure data directory exists
		if (!fs.existsSync(dataDir)) {
			fs.mkdirSync(dataDir, { recursive: true });
		}
		
		this.db = new Database(dbPath, { verbose: console.log });
		this.initTables();
		
		// Setup cleanup handler
		process.on('exit', () => this.cleanup());
		process.on('SIGINT', () => {
			this.cleanup();
			process.exit(0);
		});
	}

	public static getInstance(): DatabaseService {
		if (!DatabaseService.instance) {
			DatabaseService.instance = new DatabaseService();
		}
		return DatabaseService.instance;
	}

	private initTables() {
		this.db.exec(`
			CREATE TABLE IF NOT EXISTS donations (
				id TEXT PRIMARY KEY,
				created_at TEXT NOT NULL,
				donator_name TEXT NOT NULL,
				amount REAL NOT NULL,
				message TEXT,
				platform TEXT NOT NULL,
				timestamp INTEGER NOT NULL
			);

			CREATE TABLE IF NOT EXISTS chats (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_id TEXT NOT NULL,
				username TEXT NOT NULL,
				message TEXT NOT NULL,
				platform TEXT NOT NULL,
				timestamp INTEGER NOT NULL
			);
		`);
	}

	public getDb(): Database.Database {
		return this.db;
	}
	
	private cleanup() {
		try {
			if (this.db) {
				this.db.close();
				console.log('Database connection closed');
			}
		} catch (error) {
			console.error('Error closing database:', error);
		}
	}
}

const databaseService = DatabaseService.getInstance();
export { databaseService }; 