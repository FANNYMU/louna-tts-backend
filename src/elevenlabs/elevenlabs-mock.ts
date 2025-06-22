import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, createReadStream } from 'fs';
import chalk from 'chalk';
import { Readable } from 'stream';
import { mockVoices, mockReadableStream, mockAudioBuffer } from './mock-data';

interface ElevenLabsConfig {
  skipApiValidation?: boolean;
  outputDir?: string;
  useMock?: boolean;
}

interface VoiceSearchOptions {
  name?: string;
}

class AudioStreamHandler {
  static async toNodeStream(stream: ReadableStream): Promise<Readable> {
    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    return Readable.from(Buffer.concat(chunks));
  }

  static async saveToFile(stream: ReadableStream, outputPath: string): Promise<void> {
    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    writeFileSync(outputPath, buffer);
  }
}

export class ElevenLabsMock {
  private readonly outputDir: string;
  private useMock: boolean = true;

  constructor(config?: ElevenLabsConfig) {
    this.outputDir = config?.outputDir || join(process.cwd(), 'output');
    this.ensureOutputDirectory();
    console.log(chalk.yellow('Using MOCK ElevenLabs client for testing without API key'));
  }

  private ensureOutputDirectory(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async textToSpeech(
    text: string,
    voiceId: string,
    options: {
      modelId?: string;
    } = {}
  ): Promise<ReadableStream> {
    console.log(chalk.blue(`[MOCK] Converting text to speech with voice ID: ${voiceId}`));
    console.log(chalk.gray(`Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockReadableStream();
  }

  async textToSpeechToFile(
    text: string,
    voiceId: string,
    filename?: string,
    options: {
      modelId?: string;
    } = {}
  ): Promise<string> {
    console.log(chalk.blue(`[MOCK] Converting text to speech file with voice ID: ${voiceId}`));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const actualFilename = filename || `speech_${new Date().toISOString().replace(/[:.]/g, '-')}`;
    const outputPath = join(this.outputDir, `${actualFilename}.mp3`);
    
    writeFileSync(outputPath, mockAudioBuffer);
    
    console.log(chalk.green(`[MOCK] Audio successfully saved to: ${outputPath}`));
    return outputPath;
  }

  async getVoices() {
    console.log(chalk.blue('[MOCK] Retrieving all voices'));
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockVoices;
  }

  async searchVoices(options: VoiceSearchOptions = {}) {
    console.log(chalk.blue(`[MOCK] Searching voices with options: ${JSON.stringify(options)}`));
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (options.name) {
      return mockVoices.filter(voice => 
        voice.name.toLowerCase().includes(options.name!.toLowerCase())
      );
    }
    
    return mockVoices;
  }

  async getVoice(voiceId: string) {
    console.log(chalk.blue(`[MOCK] Retrieving voice with ID: ${voiceId}`));
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const voice = mockVoices.find(v => v.voice_id === voiceId);
    
    if (!voice) {
      throw new Error(`Voice with ID ${voiceId} not found`);
    }
    
    return voice;
  }

  async textToSpeechToNodeStream(
    text: string,
    voiceId: string,
    options: {
      modelId?: string;
    } = {}
  ): Promise<Readable> {
    console.log(chalk.blue(`[MOCK] Converting text to speech stream with voice ID: ${voiceId}`));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Readable.from(mockAudioBuffer);
  }

  getOutputDirectory(): string {
    return this.outputDir;
  }
} 