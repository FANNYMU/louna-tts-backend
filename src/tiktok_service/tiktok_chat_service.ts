import TiktokService from "./tiktok_service";
import { saveChat } from "../database/database";

interface Chat {
	userId: string,
	message: string
}

export default class TiktokChatService {
	chatHistory: Array<Chat> = [];
	constructor() {}

	logChat(chat: Chat) {
		this.chatHistory.push(chat);
		saveChat(chat.userId, chat.message, 'tiktok');
	}

	findChats(userId: string, prefix: string): Array<Chat> {
		const chats = this.chatHistory.filter((chat) => {
			return chat.userId == userId && chat.message.startsWith(prefix);
		})
		return chats;
	}

	findRandomChats(prefix: string): Array<Chat> {
		const chats = this.chatHistory.filter((chat) => {
			return chat.message.startsWith(prefix);
		})
		return chats;
	}

	findLatestChat(userId: string, prefix: string): Chat | undefined {
		const chats = this.findChats(userId, prefix);
		if (chats.length > 0) {
			return chats[chats.length - 1];
		}
	}

	findLatestRandomChat(prefix: string): Chat | undefined {
		const chats = this.findRandomChats(prefix);
		if (chats.length > 0) {
			return chats[chats.length - 1];
		}
	}
}

const tiktokChatService = new TiktokChatService();
export { tiktokChatService };
