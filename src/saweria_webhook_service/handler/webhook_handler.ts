import { webserver } from "../../webserver/webserver";
import { webhookController } from "../controller/webhook_controller";

const route = webserver.createRoute();
route.post("/", webhookController.handleWebhook);
