// TODO: start implementing the tiktok apps stuff


import TiktokService from "./tiktok_service/tiktok_service";
import { webserver } from "./webserver/webserver";
import "./saweria_webhook_service/index";
import { donatorService } from "./donator_service/donator_service";
const tiktokService = new TiktokService("lunarisnia");

tiktokService.connect().then(() => {
	console.log("Tiktok Chat connected");
	tiktokService.handleMessage((data) => {
		donatorService.addDonator({
			name: data.user!.uniqueId,
			// TODO: This should point to a function that scours the chat history
			getMessage: () => {
				return data.comment;
			}
		})
		console.log(`${data.user!.uniqueId} said: ${data.comment}`);
		console.log(donatorService.donators.length());
	});
	tiktokService.handleGift((data) => {
	});
});
webserver.listen(8787);
