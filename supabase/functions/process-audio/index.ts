import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file_url, track_id } = await req.json();
    if (!file_url || !track_id) {
      return new Response(JSON.stringify({ error: "file_url and track_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch audio file
    const audioResponse = await fetch(file_url);
    if (!audioResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch audio file" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const buffer = await audioResponse.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Extract metadata
    const metadata = extractMetadata(bytes, file_url);

    // Generate waveform peaks
    const peaks = generateWaveformPeaks(bytes, 80);

    // Update track in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const updateData: Record<string, unknown> = {
      waveform_peaks: peaks,
    };

    // Set extracted metadata fields
    if (metadata.bitrate) updateData.bitrate = metadata.bitrate;
    if (metadata.sample_rate) updateData.sample_rate = metadata.sample_rate;
    if (metadata.channels) updateData.channels = metadata.channels;
    if (metadata.duration) updateData.duration = metadata.duration;
    if (metadata.id3) updateData.id3_metadata = metadata.id3;
    if (metadata.riff) updateData.riff_metadata = metadata.riff;

    const { error } = await supabase.from("tracks").update(updateData).eq("id", track_id);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ peaks, metadata, message: "Audio processed successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateWaveformPeaks(bytes: Uint8Array, numPeaks: number): number[] {
  // For raw PCM-like data, sample the byte amplitudes across the file
  const peaks: number[] = [];
  const chunkSize = Math.max(1, Math.floor(bytes.length / numPeaks));

  for (let i = 0; i < numPeaks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, bytes.length);
    let maxVal = 0;
    // Sample every 2nd byte to approximate amplitude
    for (let j = start; j < end; j += 2) {
      const val = Math.abs(bytes[j] - 128) / 128;
      if (val > maxVal) maxVal = val;
    }
    peaks.push(Math.round(maxVal * 1000) / 1000);
  }

  // Normalize peaks
  const max = Math.max(...peaks, 0.01);
  return peaks.map((p) => Math.round((p / max) * 1000) / 1000);
}

function extractMetadata(bytes: Uint8Array, url: string) {
  const result: Record<string, string> = {};
  const ext = url.split(".").pop()?.toLowerCase() || "";

  // Detect format
  const header = String.fromCharCode(...bytes.slice(0, 4));

  if (header === "RIFF") {
    result.riff = extractRiffMetadata(bytes);
    // WAV: extract sample rate, channels, bitrate
    if (bytes.length >= 28) {
      const view = new DataView(bytes.buffer, bytes.byteOffset);
      const audioFormat = view.getUint16(20, true);
      const numChannels = view.getUint16(22, true);
      const sampleRate = view.getUint32(24, true);
      const byteRate = view.getUint32(28, true);
      const bitsPerSample = bytes.length >= 36 ? view.getUint16(34, true) : 16;
      result.channels = numChannels === 1 ? "Mono" : "Stereo";
      result.sample_rate = `${sampleRate} Hz`;
      result.bitrate = `${Math.round((byteRate * 8) / 1000)} kbps`;
      // Estimate duration from file size
      if (byteRate > 0) {
        const dataSize = bytes.length - 44;
        const durationSec = dataSize / byteRate;
        const min = Math.floor(durationSec / 60);
        const sec = Math.floor(durationSec % 60);
        result.duration = `${min}:${sec.toString().padStart(2, "0")}`;
      }
    }
  } else if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) {
    // MP3 frame sync
    result.id3 = extractId3Metadata(bytes);
    // Parse MP3 frame header
    const bitrateIndex = (bytes[2] >> 4) & 0x0f;
    const sampleRateIndex = (bytes[2] >> 2) & 0x03;
    const channelMode = (bytes[3] >> 6) & 0x03;
    const mp3Bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
    const mp3SampleRates = [44100, 48000, 32000, 0];
    if (bitrateIndex > 0 && bitrateIndex < 15) {
      result.bitrate = `${mp3Bitrates[bitrateIndex]} kbps`;
    }
    if (sampleRateIndex < 3) {
      result.sample_rate = `${mp3SampleRates[sampleRateIndex]} Hz`;
    }
    result.channels = channelMode === 3 ? "Mono" : "Stereo";
    // Estimate duration
    if (bitrateIndex > 0 && bitrateIndex < 15) {
      const br = mp3Bitrates[bitrateIndex] * 1000;
      if (br > 0) {
        const durationSec = (bytes.length * 8) / br;
        const min = Math.floor(durationSec / 60);
        const sec = Math.floor(durationSec % 60);
        result.duration = `${min}:${sec.toString().padStart(2, "0")}`;
      }
    }
  } else if (header.startsWith("ID3")) {
    result.id3 = extractId3Metadata(bytes);
    // Try to find first MP3 frame after ID3 tag
    const tagSize = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
    const frameStart = tagSize + 10;
    if (frameStart < bytes.length - 4 && bytes[frameStart] === 0xff && (bytes[frameStart + 1] & 0xe0) === 0xe0) {
      const bitrateIndex = (bytes[frameStart + 2] >> 4) & 0x0f;
      const sampleRateIndex = (bytes[frameStart + 2] >> 2) & 0x03;
      const channelMode = (bytes[frameStart + 3] >> 6) & 0x03;
      const mp3Bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
      const mp3SampleRates = [44100, 48000, 32000, 0];
      if (bitrateIndex > 0 && bitrateIndex < 15) result.bitrate = `${mp3Bitrates[bitrateIndex]} kbps`;
      if (sampleRateIndex < 3) result.sample_rate = `${mp3SampleRates[sampleRateIndex]} Hz`;
      result.channels = channelMode === 3 ? "Mono" : "Stereo";
      if (bitrateIndex > 0 && bitrateIndex < 15) {
        const br = mp3Bitrates[bitrateIndex] * 1000;
        if (br > 0) {
          const durationSec = (bytes.length * 8) / br;
          const min = Math.floor(durationSec / 60);
          const sec = Math.floor(durationSec % 60);
          result.duration = `${min}:${sec.toString().padStart(2, "0")}`;
        }
      }
    }
  } else if (header === "fLaC") {
    // FLAC: read STREAMINFO block
    if (bytes.length >= 42) {
      const view = new DataView(bytes.buffer, bytes.byteOffset);
      const minBlockSize = view.getUint16(8, false);
      const sampleRate = ((bytes[18] << 12) | (bytes[19] << 4) | ((bytes[20] >> 4) & 0x0f));
      const numChannels = ((bytes[20] >> 1) & 0x07) + 1;
      const bitsPerSample = (((bytes[20] & 0x01) << 4) | ((bytes[21] >> 4) & 0x0f)) + 1;
      const totalSamples = ((bytes[21] & 0x0f) * Math.pow(2, 32)) + view.getUint32(22, false);
      result.sample_rate = `${sampleRate} Hz`;
      result.channels = numChannels === 1 ? "Mono" : "Stereo";
      result.bitrate = `${bitsPerSample}-bit`;
      if (sampleRate > 0 && totalSamples > 0) {
        const durationSec = totalSamples / sampleRate;
        const min = Math.floor(durationSec / 60);
        const sec = Math.floor(durationSec % 60);
        result.duration = `${min}:${sec.toString().padStart(2, "0")}`;
      }
    }
  }

  return result;
}

function extractId3Metadata(bytes: Uint8Array): string {
  const parts: string[] = [];
  // Check for ID3v2
  if (String.fromCharCode(bytes[0], bytes[1], bytes[2]) === "ID3") {
    const version = `ID3v2.${bytes[3]}.${bytes[4]}`;
    parts.push(`Version: ${version}`);
    const tagSize = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
    parts.push(`Tag Size: ${tagSize} bytes`);

    // Parse ID3v2 frames
    let pos = 10;
    const end = Math.min(10 + tagSize, bytes.length);
    while (pos + 10 < end) {
      const frameId = String.fromCharCode(bytes[pos], bytes[pos + 1], bytes[pos + 2], bytes[pos + 3]);
      if (frameId === "\0\0\0\0") break;
      const frameSize = (bytes[pos + 4] << 24) | (bytes[pos + 5] << 16) | (bytes[pos + 6] << 8) | bytes[pos + 7];
      if (frameSize <= 0 || pos + 10 + frameSize > end) break;

      const knownFrames: Record<string, string> = {
        TIT2: "Title", TPE1: "Artist", TALB: "Album", TRCK: "Track", TYER: "Year",
        TDRC: "Year", TCON: "Genre", COMM: "Comment", TPE2: "Album Artist",
        TCOM: "Composer", TPUB: "Publisher", TCOP: "Copyright", TENC: "Encoder",
        TBPM: "BPM", TKEY: "Key", TLAN: "Language", TSRC: "ISRC",
      };

      if (knownFrames[frameId]) {
        try {
          const encoding = bytes[pos + 10];
          let text: string;
          if (encoding === 0 || encoding === 3) {
            text = new TextDecoder("utf-8").decode(bytes.slice(pos + 11, pos + 10 + frameSize));
          } else {
            text = new TextDecoder("utf-16").decode(bytes.slice(pos + 11, pos + 10 + frameSize));
          }
          text = text.replace(/\0/g, "").trim();
          if (text) parts.push(`${knownFrames[frameId]}: ${text}`);
        } catch { /* skip frame */ }
      }
      pos += 10 + frameSize;
    }
  }
  return parts.join("\n") || "No ID3 data found";
}

function extractRiffMetadata(bytes: Uint8Array): string {
  const parts: string[] = [];
  const view = new DataView(bytes.buffer, bytes.byteOffset);

  if (bytes.length < 12) return "Invalid RIFF";

  const fileSize = view.getUint32(4, true);
  const format = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  parts.push(`Format: ${format}`);
  parts.push(`File Size: ${fileSize} bytes`);

  // Parse chunks
  let pos = 12;
  while (pos + 8 < bytes.length) {
    const chunkId = String.fromCharCode(bytes[pos], bytes[pos + 1], bytes[pos + 2], bytes[pos + 3]);
    const chunkSize = view.getUint32(pos + 4, true);
    if (chunkSize <= 0 || pos + 8 + chunkSize > bytes.length) break;

    if (chunkId === "fmt ") {
      const audioFormat = view.getUint16(pos + 8, true);
      parts.push(`Audio Format: ${audioFormat === 1 ? "PCM" : audioFormat === 3 ? "IEEE Float" : `${audioFormat}`}`);
    } else if (chunkId === "LIST") {
      const listType = String.fromCharCode(bytes[pos + 8], bytes[pos + 9], bytes[pos + 10], bytes[pos + 11]);
      if (listType === "INFO") {
        let infoPos = pos + 12;
        const infoEnd = pos + 8 + chunkSize;
        const infoTags: Record<string, string> = {
          INAM: "Title", IART: "Artist", IPRD: "Album", ICMT: "Comment",
          IGNR: "Genre", ICRD: "Date", ISFT: "Software", IENG: "Engineer",
          ICOP: "Copyright", ISBJ: "Subject", ISRC: "Source",
        };
        while (infoPos + 8 < infoEnd) {
          const tagId = String.fromCharCode(bytes[infoPos], bytes[infoPos + 1], bytes[infoPos + 2], bytes[infoPos + 3]);
          const tagSize = view.getUint32(infoPos + 4, true);
          if (tagSize <= 0) break;
          if (infoTags[tagId]) {
            try {
              const text = new TextDecoder().decode(bytes.slice(infoPos + 8, infoPos + 8 + tagSize)).replace(/\0/g, "").trim();
              if (text) parts.push(`${infoTags[tagId]}: ${text}`);
            } catch { /* skip */ }
          }
          infoPos += 8 + tagSize + (tagSize % 2);
        }
      }
    }

    pos += 8 + chunkSize + (chunkSize % 2);
  }

  return parts.join("\n") || "No RIFF metadata found";
}
