// TODO: start abstracting the elevenlabs client
// TODO: start implementing the tiktok apps stuff

import { webserver } from "./webserver/webserver";
import "./saweria_webhook_service/index";

webserver.serve("3001");
