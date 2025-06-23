import { Context } from "hono";
import WebhookService from "../services/webhook_service";
import SaweriaWebhook from "../models/saweria_webhook";
export default class WebhookController {
	constructor() { }

	async handleWebhook(c: Context) {
		const body = await c.req.json();
		const parsedBody: SaweriaWebhook = new SaweriaWebhook(body);

		const wService: WebhookService = new WebhookService();
		wService.logDonator(parsedBody);

		return c.text("Success");
	}

}

const webhookController: WebhookController = new WebhookController();
export { webhookController };
