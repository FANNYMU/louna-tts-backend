import { TikTokLiveConnection, WebcastChatMessage, WebcastEvent, WebcastGiftMessage } from "tiktok-live-connector";

export default class TiktokService {
	username: string = "";
	connection: TikTokLiveConnection = new TikTokLiveConnection("");
	constructor(username: string) {
		this.username = username;
		this.connection = new TikTokLiveConnection(this.username);
	}

	async connect() {
		try {
			await this.connection.connect();
		} catch (err) {
			// TODO: Implement a more robust error handler
			console.log(err);
		}
	}

	async handleMessage(callback: (data: WebcastChatMessage) => void) {
		this.connection.on(WebcastEvent.CHAT, callback);
	}

	async handleGift(callback: (data: WebcastGiftMessage) => void) {
		this.connection.on(WebcastEvent.GIFT, callback);
	}
}
