import { Request, Response } from "express";
export default class WebhookController {
	constructor() { }

	handleWebhook(req: Request, res: Response) {
		console.log(req.body);
		res.json({ hello: "World" });
	}
}

const webhookController: WebhookController = new WebhookController();
export { webhookController };
