import { donatorService } from "../donator_service/donator_service";
import { tiktokChatService } from "./tiktok_chat_service";
import { tiktokService } from "./tiktok_service";

tiktokService.registerChatCallback((data) => {
	tiktokChatService.logChat({
		userId: data.user!.uniqueId,
		message: data.comment,
	})
	const chat = tiktokChatService.findLatestRandomChat("!mock");
	if (chat) {
		console.log("Mock donator added: ", chat.userId);
		donatorService.addDonator({
			name: data.user!.uniqueId,
			getMessage: () => {
				const userId = data.user!.uniqueId;
				const chat = tiktokChatService.findLatestChat(userId, "!tts");
				return chat!.message || "";
			},
			amount: 1000
		})
		console.log("Donator: ", donatorService.donators.length());
	}
})
tiktokService.registerGiftCallback((data) => {
	//donatorService.addDonator({
	//	name: data.user!.uniqueId,
	//	getMessage: () => {
	//		const userId = data.user!.uniqueId;
	//		const chat = tiktokChatService.findLatestChat(userId, "!tts");
	//		return chat!.message || "";
	//	}
	//})
})

