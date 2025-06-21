const fs = require('fs');
const path = require('path');

interface Voice {
    voice_id: string;
    name: string;
    samples: Array<{
        sample_id: string;
        file_name: string;
        mime_type: string;
        size_bytes: number;
        hash: string;
        duration_secs: number;
        remove_background_noise: boolean;
        has_isolated_audio: boolean;
        has_isolated_audio_preview: boolean;
        speaker_separation?: {
            voice_id: string;
            sample_id: string;
            status: string;
            speakers: Record<string, any>;
            selected_speaker_ids: string[];
        };
        trim_start?: number;
        trim_end?: number;
    }>;
    category: string;
    fine_tuning?: {
        is_allowed_to_fine_tune: boolean;
        state: Record<string, any>;
        verification_failures: string[];
        verification_attempts_count: number;
        manual_verification_requested: boolean;
        language: string;
        progress: Record<string, any>;
        message: Record<string, any>;
        dataset_duration_seconds: number;
        verification_attempts: Array<any>;
        slice_ids: string[];
        manual_verification: Record<string, any>;
        max_verification_attempts: number;
        next_max_verification_attempts_reset_unix_ms: number;
        finetuning_state: any;
    };
    labels: Record<string, any>;
    description: string;
    preview_url: string;
    available_for_tiers: string[];
    settings: {
        stability: number;
        use_speaker_boost: boolean;
        similarity_boost: number;
        style: number;
        speed: number;
    };
    sharing?: Record<string, any>;
    high_quality_base_model_ids?: string[];
    verified_languages?: Array<{
        language: string;
        model_id: string;
        accent: string;
        locale: string;
        preview_url: string;
    }>;
    safety_control?: string;
    voice_verification?: Record<string, any>;
    permission_on_resource?: string;
    is_owner?: boolean;
    is_legacy?: boolean;
    is_mixed?: boolean;
    created_at_unix?: number;
}

interface GetVoicesResponse {
    voices: Voice[];
    has_more: boolean;
    total_count: number;
    next_page_token: string | null;
}

class ElevenLabs {
    private apiKey: string;
    private baseUrl: string = "https://api.elevenlabs.io/v1";
    private v2BaseUrl: string = "https://api.elevenlabs.io/v2";

    constructor() {
        this.apiKey = process.env.TTS_API_KEY || "";
        if (!this.apiKey) {
            console.warn("ElevenLabs API key not found in environment variables (TTS_API_KEY)");
        }
    }

    async textToSpeech(
        text: string,
        voiceId: string,
        modelId: string = "eleven_multilingual_v2",
        outputFormat: string = "mp3_44100_128"
    ): Promise<ArrayBuffer> {
        const url = `${this.baseUrl}/text-to-speech/${voiceId}?output_format=${outputFormat}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Xi-Api-Key": this.apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                model_id: modelId
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
        }

        const audioBuffer = await response.arrayBuffer();
        
        
        const outputDir = path.join(process.cwd(), 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputPath = path.join(outputDir, `speech_${timestamp}.${outputFormat.split('_')[0]}`);
        
        fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
        console.log(`Audio disimpan ke: ${outputPath}`);

        return audioBuffer;
    }

    async getVoices(
        options?: {
            next_page_token?: string | null;
            page_size?: number;
            search?: string | null;
            sort?: string | null;
            sort_direction?: 'asc' | 'desc' | null;
            voice_type?: 'personal' | 'community' | 'default' | 'workspace' | 'non-default' | null;
            category?: 'premade' | 'cloned' | 'generated' | 'professional' | null;
            fine_tuning_state?: 'draft' | 'not_verified' | 'not_started' | 'queued' | 'fine_tuning' | 'fine_tuned' | 'failed' | 'delayed' | null;
            collection_id?: string | null;
            include_total_count?: boolean;
        }
    ): Promise<GetVoicesResponse> {
        const queryParams = new URLSearchParams();
        
        if (options) {
            if (options.next_page_token) queryParams.append('next_page_token', options.next_page_token);
            if (options.page_size) queryParams.append('page_size', options.page_size.toString());
            if (options.search) queryParams.append('search', options.search);
            if (options.sort) queryParams.append('sort', options.sort);
            if (options.sort_direction) queryParams.append('sort_direction', options.sort_direction);
            if (options.voice_type) queryParams.append('voice_type', options.voice_type);
            if (options.category) queryParams.append('category', options.category);
            if (options.fine_tuning_state) queryParams.append('fine_tuning_state', options.fine_tuning_state);
            if (options.collection_id) queryParams.append('collection_id', options.collection_id);
            if (options.include_total_count !== undefined) queryParams.append('include_total_count', options.include_total_count.toString());
        }

        const url = `${this.v2BaseUrl}/voices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Xi-Api-Key": this.apiKey
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
        }

        return await response.json() as GetVoicesResponse;
    }
}

export { ElevenLabs };