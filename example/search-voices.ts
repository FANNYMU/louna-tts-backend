import { createElevenLabsClient } from '../src/elevenlabs/elevenlabs-factory';

async function main() {
  try {
    const useMock = true;

    if (!process.env.TTS_API_KEY) {
      console.warn('Warning: TTS_API_KEY not found in environment variables');
      console.log('Continuing with mock client for testing...');
    }

    const elevenlabs = createElevenLabsClient({
      useMock: useMock
    });
    
    console.log('Retrieving all voices...');
    const voices = await elevenlabs.getVoices();
    
    if (voices && Array.isArray(voices) && voices.length > 0) {
      console.log(`Found ${voices.length} voices:`);
      
      voices.forEach((voice, index) => {
        const voiceId = 'voice_id' in voice ? voice.voice_id : 
                        'voiceId' in voice ? (voice as any).voiceId : 'unknown';
        const voiceName = voice.name;
        const voiceDescription = voice.description;
        
        console.log(`\n[${index + 1}] ID: ${voiceId}`);
        console.log(`    Name: ${voiceName}`);
        console.log(`    Description: ${voiceDescription || 'No description'}`);
        
        if (voice.labels && Object.keys(voice.labels).length > 0) {
          console.log('    Labels:');
          Object.entries(voice.labels).forEach(([key, value]) => {
            console.log(`      - ${key}: ${value}`);
          });
        }
      });
      
      if (voices.length > 0) {
        const firstVoice = voices[0];
        const firstVoiceId = 'voice_id' in firstVoice ? firstVoice.voice_id : 
                            'voiceId' in firstVoice ? (firstVoice as any).voiceId : 'unknown';
                            
        console.log(`\nRetrieving details for voice: ${firstVoice.name}...`);
        
        const voiceDetails = await elevenlabs.getVoice(firstVoiceId);
        console.log('Voice details:');
        
        const detailsId = 'voice_id' in voiceDetails ? voiceDetails.voice_id : 
                         'voiceId' in voiceDetails ? (voiceDetails as any).voiceId : 'unknown';
                         
        console.log(`  ID: ${detailsId}`);
        console.log(`  Name: ${voiceDetails.name}`);
        console.log(`  Category: ${voiceDetails.category || 'Unknown'}`);
        
        const modelIds = 'high_quality_base_model_ids' in voiceDetails ? 
                         (voiceDetails as any).high_quality_base_model_ids :
                         'highQualityBaseModelIds' in voiceDetails ? 
                         (voiceDetails as any).highQualityBaseModelIds : [];
                           
        if (Array.isArray(modelIds) && modelIds.length > 0) {
          console.log('  Supported models:');
          modelIds.forEach(modelId => {
            console.log(`    - ${modelId}`);
          });
        }
      }
    } else {
      console.error('No voices available. Ensure API key is valid and has access to voices.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main(); 