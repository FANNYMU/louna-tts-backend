import { donatorService } from "../donator_service/donator_service";
import { donationRepository } from "../database";
import { tiktokChatService } from "./tiktok_chat_service";
import { tiktokService } from "./tiktok_service";

tiktokService.registerChatCallback((data: any) => {
	tiktokChatService.logChat({
		userId: data.user!.uniqueId,
		username: data.user!.nickname || data.user!.uniqueId,
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
			}
		})
		console.log("Donator: ", donatorService.donators.length());
	}
})
tiktokService.registerGiftCallback((data: any) => {
	// Store gift in database
	const giftValue = data.diamondCount || 0;
	
	if (giftValue > 0) {
		donationRepository.save({
			id: `tiktok_gift_${Date.now()}_${data.user!.uniqueId}`,
			created_at: new Date().toISOString(),
			donator_name: data.user!.nickname || data.user!.uniqueId,
			amount: giftValue,
			message: `Gift: ${data.giftName} x${data.repeatCount || 1}`,
			platform: "tiktok",
			timestamp: Date.now()
		});
		
		//donatorService.addDonator({
		//	name: data.user!.uniqueId,
		//	getMessage: () => {
		//		const userId = data.user!.uniqueId;
		//		const chat = tiktokChatService.findLatestChat(userId, "!tts");
		//		return chat!.message || ""
		//	}
		//})
	}
})

