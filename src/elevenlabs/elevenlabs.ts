import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, createReadStream } from 'fs';
import chalk from 'chalk';
import { Readable } from 'stream';

interface ElevenLabsConfig {
  skipApiValidation?: boolean;
  outputDir?: string;
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

export class ElevenLabs {
  private readonly client: ElevenLabsClient;
  private readonly outputDir: string;
  private readonly skipApiValidation: boolean;

  constructor(config?: ElevenLabsConfig) {
    const apiKey = process.env.TTS_API_KEY;
    
    if (!apiKey && !config?.skipApiValidation) {
      console.warn(chalk.yellow('ElevenLabs API key not found in environment variables (TTS_API_KEY)'));
    }

    this.client = new ElevenLabsClient({
      apiKey: apiKey || ''
    });

    this.skipApiValidation = config?.skipApiValidation || false;
    this.outputDir = config?.outputDir || join(process.cwd(), 'output');

    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  private validateApiKey(): void {
    if (!process.env.TTS_API_KEY && !this.skipApiValidation) {
      throw new Error('ElevenLabs API key not found. Please ensure TTS_API_KEY environment variable is set.');
    }
  }

  async textToSpeech(
    text: string,
    voiceId: string,
    options: {
      modelId?: string;
    } = {}
  ): Promise<ReadableStream> {
    try {
      this.validateApiKey();

      const { modelId = 'eleven_multilingual_v2' } = options;

      return await this.client.textToSpeech.convert(voiceId, {
        text,
        modelId
      });
    } catch (error) {
      console.error(chalk.red('Failed to convert text to speech:'), error);
      throw error;
    }
  }

  async textToSpeechToFile(
    text: string,
    voiceId: string,
    filename?: string,
    options: {
      modelId?: string;
    } = {}
  ): Promise<string> {
    try {
      const audioStream = await this.textToSpeech(text, voiceId, options);

      const actualFilename = filename || `speech_${new Date().toISOString().replace(/[:.]/g, '-')}`;
      const outputPath = join(this.outputDir, `${actualFilename}.mp3`);
      
      await AudioStreamHandler.saveToFile(audioStream, outputPath);
      console.log(chalk.green(`Audio successfully saved to: ${outputPath}`));

      return outputPath;
    } catch (error) {
      console.error(chalk.red('Failed to save audio to file:'), error);
      throw error;
    }
  }

  async getVoices() {
    try {
      this.validateApiKey();

      const response = await this.client.voices.getAll();
      console.log(chalk.blue(`Successfully retrieved voices`));

      return response;
    } catch (error) {
      console.error(chalk.red('Failed to fetch voices:'), error);
      throw error;
    }
  }

  async searchVoices(options: VoiceSearchOptions = {}) {
    try {
      this.validateApiKey();

      const voices = await this.client.voices.getAll();
      console.log(chalk.blue(`Successfully retrieved all voices`));

      return voices;
    } catch (error) {
      console.error(chalk.red('Failed to search voices:'), error);
      throw error;
    }
  }

  async getVoice(voiceId: string) {
    try {
      this.validateApiKey();

      const voice = await this.client.voices.get(voiceId);
      console.log(chalk.blue(`Successfully retrieved voice: ${voice.name}`));

      return voice;
    } catch (error) {
      console.error(chalk.red(`Failed to fetch voice with ID ${voiceId}:`), error);
      throw error;
    }
  }

  async textToSpeechToNodeStream(
    text: string,
    voiceId: string,
    options: {
      modelId?: string;
    } = {}
  ): Promise<Readable> {
    const stream = await this.textToSpeech(text, voiceId, options);
    return AudioStreamHandler.toNodeStream(stream);
  }

  getOutputDirectory(): string {
    return this.outputDir;
  }

  isApiValidationSkipped(): boolean {
    return this.skipApiValidation;
  }
}