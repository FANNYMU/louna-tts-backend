import { createElevenLabsClient } from '../src/elevenlabs/elevenlabs-factory';
import { createWriteStream } from 'fs';
import { join } from 'path';

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
    
    const text = 'This is an example of audio streaming using the ElevenLabs API. ' + 
                 'With streaming, we can process audio in real-time without waiting for the entire file to download.';
    
    console.log('Retrieving available voices...');
    const voices = await elevenlabs.getVoices();
    
    if (voices && Array.isArray(voices) && voices.length > 0) {
      const firstVoice = voices[0];
      const voiceId = 'voice_id' in firstVoice ? firstVoice.voice_id : 
                      'voiceId' in firstVoice ? (firstVoice as any).voiceId : 'unknown';
                      
      if (voiceId === 'unknown') {
        console.error('Could not determine voice ID from response');
        return;
      }
      
      console.log(`Using voice: ${firstVoice.name}`);
      
      console.log('Converting text to audio stream...');
      const audioStream = await elevenlabs.textToSpeechToNodeStream(text, voiceId);
      
      const outputDir = elevenlabs.getOutputDirectory();
      const outputPath = join(outputDir, 'example-stream.mp3');
      
      console.log(`Saving audio stream to file: ${outputPath}`);
      const fileStream = createWriteStream(outputPath);
      
      audioStream.pipe(fileStream);
      
      fileStream.on('finish', () => {
        console.log('Stream completed, audio file saved successfully!');
      });
      
      fileStream.on('error', (err) => {
        console.error('Error saving file:', err);
      });
      
      await new Promise<void>((resolve) => {
        fileStream.on('close', () => resolve());
      });
      
      console.log('Streaming process completed!');
    } else {
      console.error('No voices available. Ensure API key is valid and has access to voices.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main(); 