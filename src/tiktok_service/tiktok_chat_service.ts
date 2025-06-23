import TiktokService from "./tiktok_service";

interface Chat {
	userId: string,
	message: string
	// TODO: add "date" here if I wanted to add long term storage
}
export default class TiktokChatService {
	chatHistory: Array<Chat> = [];
	constructor() {

	}

	logChat(chat: Chat) {
		this.chatHistory.push(chat);
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
