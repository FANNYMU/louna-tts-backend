const { ElevenLabs } = require("./elevenlabs/elevenlabs");

console.log("HEi");

const textToSpeech = async () => {
    const elevenLabs = new ElevenLabs();
    const audio = await elevenLabs.textToSpeech("Hello, world!", "21m00Tcm4TlvDq8ikWAM");
    console.log(audio);
}

textToSpeech();

// const testGetVoices = async () => {
//     try {
//         const elevenLabs = new ElevenLabs();
//         const voices = await elevenLabs.getVoices();
//         console.log("Available Voices List:");
//         voices.voices.forEach((voice: any, index: number) => {
//             console.log(`${index + 1}. ID: ${voice.voice_id} - Name: ${voice.name}`);
//         });
//         console.log(`Total voices: ${voices.total_count}`);
//     } catch (error) {
//         console.error("An error occurred while fetching voices list:", error);
//     }
// }

// testGetVoices();
