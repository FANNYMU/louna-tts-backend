import { createElevenLabsClient } from '../src/elevenlabs/elevenlabs-factory';

async function main() {
  const useMock = true;

  try {
    if (!process.env.TTS_API_KEY) {
      console.warn('Warning: TTS_API_KEY not found in environment variables');
      console.log('Continuing with mock client for testing...');
    }

    const elevenlabs = createElevenLabsClient({
      useMock
    });
    
    const text = 'Hello, this is an example of text-to-speech using ElevenLabs API. This voice is generated using AI technology.';
    
    console.log('Fetching voice list...');
    const voices = await elevenlabs.getVoices();
    
    if (voices && Array.isArray(voices) && voices.length > 0) {
      const firstVoice = voices[0];
      const voiceId = 'voice_id' in firstVoice ? firstVoice.voice_id : 
                      'voiceId' in firstVoice ? (firstVoice as any).voiceId : 'unknown';
                      
      if (voiceId === 'unknown') {
        console.error('Could not determine voice ID from response');
        return;
      }
      
      console.log(`Using voice: ${firstVoice.name} (${voiceId})`);
      
      console.log('Converting text to audio...');
      const outputPath = await elevenlabs.textToSpeechToFile(text, voiceId, 'tts-example');
      
      console.log(`Success! Audio file saved at: ${outputPath}`);
    } else {
      console.error('No voices available. Ensure API key is valid and has voice access.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main(); 