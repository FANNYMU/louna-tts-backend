import { ElevenLabs } from './elevenlabs';
import { ElevenLabsMock } from './elevenlabs-mock';
import chalk from 'chalk';

export interface ElevenLabsConfig {
  skipApiValidation?: boolean;
  outputDir?: string;
  useMock?: boolean;
}

export function createElevenLabsClient(config?: ElevenLabsConfig) {
  const shouldUseMock = config?.useMock || (!process.env.TTS_API_KEY && !config?.skipApiValidation);
  
  if (shouldUseMock) {
    console.log(chalk.yellow('Using mock ElevenLabs client for testing'));
    return new ElevenLabsMock({
      outputDir: config?.outputDir
    });
  }
  
  console.log(chalk.green('Using real ElevenLabs client'));
  return new ElevenLabs({
    skipApiValidation: config?.skipApiValidation,
    outputDir: config?.outputDir
  });
} 