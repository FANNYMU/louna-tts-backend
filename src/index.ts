// TODO: start abstracting the elevenlabs client
// TODO: start implementing the tiktok apps stuff

import handler from "./saweria_webhook_service/handler/webhook_handler";
import { webserver } from "./webserver/webserver";

handler();
webserver.serve("3001");
