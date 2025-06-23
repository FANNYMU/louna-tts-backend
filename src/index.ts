// TODO: start implementing the tiktok apps stuff


import { webserver } from "./webserver/webserver";
import "./saweria_webhook_service/index";
import "./tiktok_service/setup_callback";
import { tiktokService } from "./tiktok_service/tiktok_service";

tiktokService.setUsername("lunarisnia");
tiktokService.connect().then(() => {
	console.log("Tiktok Chat connected");
	tiktokService.handleMessage();
	tiktokService.handleGift();
});
webserver.listen(8787);
