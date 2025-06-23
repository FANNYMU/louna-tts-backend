import { databaseService } from './database';

export interface ChatRecord {
	id?: number;
	user_id: string;
	username: string;
	message: string;
	platform: string;
	timestamp: number;
}

export default class ChatRepository {
	private static instance: ChatRepository;

	private constructor() {}

	public static getInstance(): ChatRepository {
		if (!ChatRepository.instance) {
			ChatRepository.instance = new ChatRepository();
		}
		return ChatRepository.instance;
	}

	public save(chat: ChatRecord): number {
		const db = databaseService.getDb();
		const stmt = db.prepare(`
			INSERT INTO chats (user_id, username, message, platform, timestamp)
			VALUES (?, ?, ?, ?, ?)
		`);
		
		const result = stmt.run(
			chat.user_id,
			chat.username,
			chat.message,
			chat.platform,
			chat.timestamp
		);
		
		return result.lastInsertRowid as number;
	}

	public getAll(): ChatRecord[] {
		const db = databaseService.getDb();
		const stmt = db.prepare('SELECT * FROM chats ORDER BY timestamp DESC');
		return stmt.all() as ChatRecord[];
	}

	public getLatest(limit: number = 100): ChatRecord[] {
		const db = databaseService.getDb();
		const stmt = db.prepare('SELECT * FROM chats ORDER BY timestamp DESC LIMIT ?');
		return stmt.all(limit) as ChatRecord[];
	}

	public getByUserId(userId: string, limit: number = 50): ChatRecord[] {
		const db = databaseService.getDb();
		const stmt = db.prepare('SELECT * FROM chats WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?');
		return stmt.all(userId, limit) as ChatRecord[];
	}

	public getByPlatform(platform: string, limit: number = 100): ChatRecord[] {
		const db = databaseService.getDb();
		const stmt = db.prepare('SELECT * FROM chats WHERE platform = ? ORDER BY timestamp DESC LIMIT ?');
		return stmt.all(platform, limit) as ChatRecord[];
	}

	public searchByMessage(query: string, limit: number = 50): ChatRecord[] {
		const db = databaseService.getDb();
		const stmt = db.prepare('SELECT * FROM chats WHERE message LIKE ? ORDER BY timestamp DESC LIMIT ?');
		return stmt.all(`%${query}%`, limit) as ChatRecord[];
	}
}

const chatRepository = ChatRepository.getInstance();
export { chatRepository }; 