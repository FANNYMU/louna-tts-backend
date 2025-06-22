import testTTS from "../../tts_service/tts_example";
import SaweriaWebhook from "../models/saweria_webhook";

export default class WebhookService {
	constructor() {

	}

	async playTTS(saweriaWebhook: SaweriaWebhook) {
		await testTTS(`${saweriaWebhook.donator_name} bilang: ${saweriaWebhook.message}`);
	}
};
