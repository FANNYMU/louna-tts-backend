import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';

export default async function playTTS(text: string) {
	const elevenlabs = new ElevenLabsClient();
	const audio = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
		text: text,
		modelId: 'eleven_multilingual_v2',
		outputFormat: 'mp3_44100_128',
	});
	await play(audio as any);
}

