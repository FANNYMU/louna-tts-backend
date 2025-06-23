import { EventHandler, TikTokLiveConnection, WebcastChatMessage, WebcastEvent, WebcastGiftMessage } from "tiktok-live-connector";

export default class TiktokService {
	username: string = "";
	connection: TikTokLiveConnection = new TikTokLiveConnection("");
	chatCallbacks: Array<EventHandler<WebcastChatMessage>> = [];
	giftCallbacks: Array<EventHandler<WebcastGiftMessage>> = [];
	constructor() {
		this.connection = new TikTokLiveConnection(this.username);
	}
	setUsername(username: string) {
		this.username = username;
	}

	registerChatCallback(callback: EventHandler<WebcastChatMessage>) {
		this.chatCallbacks.push(callback);
	}

	registerGiftCallback(callback: EventHandler<WebcastGiftMessage>) {
		this.giftCallbacks.push(callback);
	}

	async connect() {
		try {
			await this.connection.connect();
		} catch (err) {
			// TODO: Implement a more robust error handler
			console.log(err);
		}
	}

	async handleMessage() {
		this.connection.on(WebcastEvent.CHAT, (data) => {
			for (const callback of this.chatCallbacks) {
				callback(data);
			}
		});
	}

	async handleGift() {
		this.connection.on(WebcastEvent.GIFT, (data) => {
			for (const callback of this.giftCallbacks) {
				callback(data);
			}
		});
	}
}

const tiktokService = new TiktokService();
export { tiktokService };
