import { donatorService } from "../../donator_service/donator_service";
import SaweriaWebhook from "../models/saweria_webhook";

export default class WebhookService {
	constructor() {

	}

	logDonator(saweriaWebhook: SaweriaWebhook) {
		donatorService.addDonator({
			name: saweriaWebhook.donator_name,
			getMessage: () => {
				return saweriaWebhook.message;
			}
		});
		console.log("DonatorService: ", donatorService.donators.length());
		//await testTTS(`${saweriaWebhook.donator_name} bilang: ${saweriaWebhook.message}`);
	}
};
