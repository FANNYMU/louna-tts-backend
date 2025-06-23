import { donatorService } from "../../donator_service/donator_service";
import { donationRepository } from "../../database";
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
		
		donationRepository.save({
			id: saweriaWebhook.id,
			created_at: saweriaWebhook.created_at,
			donator_name: saweriaWebhook.donator_name,
			amount: saweriaWebhook.amount_raw,
			message: saweriaWebhook.message,
			platform: "saweria",
			timestamp: Date.now()
		});
		
		console.log("DonatorService: ", donatorService.donators.length());
		//await testTTS(`${saweriaWebhook.donator_name} bilang: ${saweriaWebhook.message}`);
	}
};
