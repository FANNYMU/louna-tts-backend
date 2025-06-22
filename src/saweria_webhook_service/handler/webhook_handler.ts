import { webserver } from "../../webserver/webserver";
import { webhookController } from "../controller/webhook_controller";
const route = webserver.createRoute("/");

export default function handler() {
	route.get("/", webhookController.handleWebhook);
}
