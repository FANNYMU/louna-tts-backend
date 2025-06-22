import { Request, Response } from "express";
export default class WebhookController {
	constructor() { }

	handleWebhook(req: Request, res: Response) {
		res.json("HelloController");
	}
}

const webhookController: WebhookController = new WebhookController();
export { webhookController };
