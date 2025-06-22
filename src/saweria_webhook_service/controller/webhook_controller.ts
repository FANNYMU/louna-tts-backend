import { Context } from "hono";
export default class WebhookController {
	constructor() { }

	async handleWebhook(c: Context) {
		const body = await c.req.json();
		console.log(body);
		return c.text("Success");
	}

}

const webhookController: WebhookController = new WebhookController();
export { webhookController };
