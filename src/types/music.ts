export type TrackStatus = "Draft" | "Scheduled" | "Submitted" | "Ready" | "Released";

export type TrackType =
  | "Original"
  | "Remix"
  | "VIP Remix"
  | "Edit"
  | "Extended Mix"
  | "Radio Edit"
  | "Instrumental"
  | "Acapella"
  | "Live";

export type RelationshipType = "remix_of" | "cover_of" | "sampled_from" | "interpolation_of";

export interface Work {
  work_id: string;
  title: string;
  composer: string;
  lyricist: string;
  publisher: string;
  notes: string;
}

export interface Track {
  track_id: string;
  work_id: string | null;
  title: string;
  version_name: string;
  track_type: TrackType;
  parent_track_id: string | null;
  remixer_artist: string;
  artist: string;
  featured_artists: string;
  genre: string;
  subgenre: string;
  bpm: number;
  musical_key: string;
  duration: string;
  isrc: string;
  language: string;
  explicit_flag: boolean;
  audio_file: string | null;
  cover_art: string | null;
  description: string;
  lyrics: string;
  created_at: string;
  updated_at: string;
  status: TrackStatus;
}

export interface TrackRelationship {
  relationship_id: string;
  source_track_id: string;
  target_track_id: string;
  relationship_type: RelationshipType;
  notes: string;
}

export interface Album {
  album_id: string;
  title: string;
  artist: string;
  release_type: "Album" | "EP" | "Single";
  release_date: string;
  label: string;
  catalog_number: string;
  upc: string;
  cover_art: string | null;
}

export interface AlbumTrack {
  album_id: string;
  track_id: string;
  track_number: number;
}

export interface Release {
  id: string;
  title: string;
  type: "album" | "track";
  reference_id: string;
  planned_release_date: string;
  distributor_submission_date: string;
  marketing_start_date: string;
  status: TrackStatus;
}

export interface Distributor {
  id: string;
  name: string;
  contact_email: string;
  submission_format: string;
  delivery_method: string;
  notes: string;
  distribution_status: string;
}

export interface PromotionChannel {
  id: string;
  platform: string;
  contact_person: string;
  email: string;
  notes: string;
}

export interface PromoTask {
  id: string;
  campaign_name: string;
  track_or_album: string;
  platform: string;
  scheduled_date: string;
  content_type: string;
  status: string;
}

export type ProductionPhase = "writing" | "recording" | "mixing" | "mastering" | "review";

export interface ProductionTask {
  id: string;
  title: string;
  track_title: string;
  release_id?: string;
  phase: ProductionPhase;
  start_date: string;
  end_date: string;
  progress: number; // 0-100
  subtasks: ProductionSubtask[];
}

export interface ProductionSubtask {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  type: "production" | "release_prep" | "marketing" | "distribution";
  completed: boolean;
}
