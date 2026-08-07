import { Track, Album, AlbumTrack, Release, Distributor, PromotionChannel, PromoTask, Work, TrackRelationship, ProductionTask } from "@/types/music";

export const mockWorks: Work[] = [
  {
    work_id: "w1",
    title: "Night Drive",
    composer: "J. Rivera",
    lyricist: "L. Chen",
    publisher: "Neon Records",
    notes: "Written during the Neon Horizons sessions",
  },
  {
    work_id: "w2",
    title: "Vapor Trails",
    composer: "M. Santos",
    lyricist: "M. Santos",
    publisher: "Neon Records",
    notes: "",
  },
  {
    work_id: "w3",
    title: "Chrome Hearts",
    composer: "L. Chen",
    lyricist: "L. Chen",
    publisher: "Neon Records",
    notes: "",
  },
  {
    work_id: "w4",
    title: "Binary Sunset",
    composer: "J. Rivera",
    lyricist: "",
    publisher: "Neon Records",
    notes: "Instrumental composition",
  },
];

export const mockTracks: Track[] = [
  // Night Drive versions
  {
    track_id: "t1",
    work_id: "w1",
    title: "Night Drive",
    version_name: "Original",
    track_type: "Original",
    parent_track_id: null,
    remixer_artist: "",
    artist: "Synthwave Collective",
    featured_artists: "Luna Vox",
    genre: "Electronic",
    subgenre: "Synthwave",
    bpm: 124,
    musical_key: "G# Minor",
    duration: "4:32",
    isrc: "US-RC1-23-00012",
    language: "English",
    explicit_flag: false,
    audio_file: null,
    cover_art: null,
    description: "Lead single from the Neon Horizons EP",
    lyrics: "",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    status: "Released",
  },
  {
    track_id: "t1b",
    work_id: "w1",
    title: "Night Drive",
    version_name: "Extended Mix",
    track_type: "Extended Mix",
    parent_track_id: "t1",
    remixer_artist: "",
    artist: "Synthwave Collective",
    featured_artists: "Luna Vox",
    genre: "Electronic",
    subgenre: "Synthwave",
    bpm: 124,
    musical_key: "G# Minor",
    duration: "6:48",
    isrc: "US-RC1-23-00014",
    language: "English",
    explicit_flag: false,
    audio_file: null,
    cover_art: null,
    description: "Club-length version",
    lyrics: "",
    created_at: "2024-01-16T10:00:00Z",
    updated_at: "2024-01-22T09:00:00Z",
    status: "Released",
  },
  {
    track_id: "t1c",
    work_id: "w1",
    title: "Night Drive",
    version_name: "DJ Kaito Remix",
    track_type: "Remix",
    parent_track_id: "t1",
    remixer_artist: "DJ Kaito",
    artist: "Synthwave Collective",
    featured_artists: "Luna Vox",
    genre: "Electronic",
    subgenre: "Techno",
    bpm: 136,
    musical_key: "A Minor",
    duration: "5:55",
    isrc: "US-RC1-24-00010",
    language: "English",
    explicit_flag: false,
    audio_file: null,
    cover_art: null,
    description: "Peak-time techno rework",
    lyrics: "",
    created_at: "2024-02-10T10:00:00Z",
    updated_at: "2024-02-15T09:00:00Z",
    status: "Scheduled",
  },
  {
    track_id: "t1d",
    work_id: "w1",
    title: "Night Drive",
    version_name: "Ambient Rework",
    track_type: "Remix",
    parent_track_id: "t1",
    remixer_artist: "Neon Archive",
    artist: "Synthwave Collective",
    featured_artists: "",
    genre: "Electronic",
    subgenre: "Ambient",
    bpm: 90,
    musical_key: "G# Minor",
    duration: "7:20",
    isrc: "US-RC1-24-00011",
    language: "Instrumental",
    explicit_flag: false,
    audio_file: null,
    cover_art: null,
    description: "Downtempo ambient reimagining",
    lyrics: "",
    created_at: "2024-02-12T08:00:00Z",
    updated_at: "2024-02-18T12:00:00Z",
    status: "Draft",
  },
  // Vapor Trails
  {
    track_id: "t3",
    work_id: "w2",
    title: "Vapor Trails",
    version_name: "Original",
    track_type: "Original",
    parent_track_id: null,
    remixer_artist: "",
    artist: "Neon Archive",
    featured_artists: "DJ Pulse",
    genre: "Electronic",
    subgenre: "Future Bass",
    bpm: 150,
    musical_key: "D Major",
    duration: "3:48",
    isrc: "US-RC1-24-00001",
    language: "English",
    explicit_flag: false,
    audio_file: null,
    cover_art: null,
    description: "Upcoming release",
    lyrics: "",
    created_at: "2024-02-01T08:00:00Z",
    updated_at: "2024-02-10T12:00:00Z",
    status: "Scheduled",
  },
  // Chrome Hearts
  {
    track_id: "t4",
    work_id: "w3",
    title: "Chrome Hearts",
    version_name: "Radio Edit",
    track_type: "Radio Edit",
    parent_track_id: null,
    remixer_artist: "",
    artist: "Luna Vox",
    featured_artists: "",
    genre: "Pop",
    subgenre: "Electropop",
    bpm: 118,
    musical_key: "C Major",
    duration: "3:22",
    isrc: "US-RC1-24-00002",
    language: "English",
    explicit_flag: true,
    audio_file: null,
    cover_art: null,
    description: "",
    lyrics: "",
    created_at: "2024-02-05T11:00:00Z",
    updated_at: "2024-02-12T16:00:00Z",
    status: "Draft",
  },
  // Binary Sunset
  {
    track_id: "t5",
    work_id: "w4",
    title: "Binary Sunset",
    version_name: "Original",
    track_type: "Original",
    parent_track_id: null,
    remixer_artist: "",
    artist: "Synthwave Collective",
    featured_artists: "",
    genre: "Electronic",
    subgenre: "Ambient",
    bpm: 90,
    musical_key: "E Minor",
    duration: "5:10",
    isrc: "US-RC1-24-00003",
    language: "Instrumental",
    explicit_flag: false,
    audio_file: null,
    cover_art: null,
    description: "Standalone single",
    lyrics: "",
    created_at: "2024-03-01T09:00:00Z",
    updated_at: "2024-03-05T10:00:00Z",
    status: "Ready",
  },
  {
    track_id: "t5b",
    work_id: "w4",
    title: "Binary Sunset",
    version_name: "Live",
    track_type: "Live",
    parent_track_id: "t5",
    remixer_artist: "",
    artist: "Synthwave Collective",
    featured_artists: "",
    genre: "Electronic",
    subgenre: "Ambient",
    bpm: 88,
    musical_key: "E Minor",
    duration: "6:02",
    isrc: "US-RC1-24-00005",
    language: "Instrumental",
    explicit_flag: false,
    audio_file: null,
    cover_art: null,
    description: "Recorded live at Neon Fest 2024",
    lyrics: "",
    created_at: "2024-03-10T14:00:00Z",
    updated_at: "2024-03-12T10:00:00Z",
    status: "Submitted",
  },
];

export const mockTrackRelationships: TrackRelationship[] = [
  {
    relationship_id: "rel1",
    source_track_id: "t1c",
    target_track_id: "t1",
    relationship_type: "remix_of",
    notes: "Commissioned remix",
  },
  {
    relationship_id: "rel2",
    source_track_id: "t1d",
    target_track_id: "t1",
    relationship_type: "remix_of",
    notes: "Ambient rework for chill playlists",
  },
];

export const mockAlbums: Album[] = [
  {
    album_id: "a1",
    title: "Neon Horizons",
    artist: "Synthwave Collective",
    release_type: "EP",
    release_date: "2024-02-14",
    label: "Neon Records",
    catalog_number: "NR-2024-001",
    upc: "0123456789012",
    cover_art: null,
  },
  {
    album_id: "a2",
    title: "Digital Feelings",
    artist: "Neon Archive",
    release_type: "Album",
    release_date: "2024-04-20",
    label: "Neon Records",
    catalog_number: "NR-2024-002",
    upc: "0123456789013",
    cover_art: null,
  },
];

export const mockAlbumTracks: AlbumTrack[] = [
  { album_id: "a1", track_id: "t1", track_number: 1 },
  { album_id: "a1", track_id: "t1b", track_number: 2 },
  { album_id: "a2", track_id: "t3", track_number: 1 },
  { album_id: "a2", track_id: "t4", track_number: 2 },
];

export const mockReleases: Release[] = [
  {
    id: "r1",
    title: "Neon Horizons EP",
    type: "album",
    reference_id: "a1",
    planned_release_date: "2024-02-14",
    distributor_submission_date: "2024-01-30",
    marketing_start_date: "2024-02-01",
    status: "Released",
  },
  {
    id: "r2",
    title: "Digital Feelings",
    type: "album",
    reference_id: "a2",
    planned_release_date: "2024-04-20",
    distributor_submission_date: "2024-04-01",
    marketing_start_date: "2024-04-05",
    status: "Scheduled",
  },
  {
    id: "r3",
    title: "Binary Sunset (Single)",
    type: "track",
    reference_id: "t5",
    planned_release_date: "2024-03-28",
    distributor_submission_date: "2024-03-15",
    marketing_start_date: "2024-03-20",
    status: "Ready",
  },
  {
    id: "r4",
    title: "Night Drive Remixes",
    type: "track",
    reference_id: "t1c",
    planned_release_date: "2024-04-05",
    distributor_submission_date: "2024-03-20",
    marketing_start_date: "2024-03-25",
    status: "Submitted",
  },
  {
    id: "r5",
    title: "Chrome Hearts (Single)",
    type: "track",
    reference_id: "t4",
    planned_release_date: "2024-05-10",
    distributor_submission_date: "",
    marketing_start_date: "",
    status: "Draft",
  },
];

export const mockDistributors: Distributor[] = [
  { id: "d1", name: "DistroKid", contact_email: "submissions@distrokid.com", submission_format: "WAV 24-bit", delivery_method: "Upload Portal", notes: "Primary distributor for all releases", distribution_status: "Active" },
  { id: "d2", name: "TuneCore", contact_email: "artists@tunecore.com", submission_format: "WAV / FLAC", delivery_method: "Upload Portal", notes: "Secondary option for Japanese market", distribution_status: "Active" },
  { id: "d3", name: "Believe Digital", contact_email: "label@believe.com", submission_format: "WAV 16/24-bit", delivery_method: "FTP", notes: "For label compilation releases", distribution_status: "Inactive" },
];

export const mockPromotionChannels: PromotionChannel[] = [
  { id: "pc1", platform: "Instagram", contact_person: "Sarah M.", email: "sarah@agency.com", notes: "Reels & Stories" },
  { id: "pc2", platform: "TikTok", contact_person: "Alex T.", email: "alex@agency.com", notes: "Short form clips" },
  { id: "pc3", platform: "YouTube", contact_person: "Chris L.", email: "chris@agency.com", notes: "Music videos & BTS" },
  { id: "pc4", platform: "Spotify Canvas", contact_person: "Internal", email: "", notes: "Canvas animations" },
  { id: "pc5", platform: "Press", contact_person: "Diana R.", email: "diana@prfirm.com", notes: "Music blogs & magazines" },
  { id: "pc6", platform: "Radio", contact_person: "Mike J.", email: "mike@radiopromo.com", notes: "College & indie radio" },
];

export const mockPromoTasks: PromoTask[] = [
  { id: "pt1", campaign_name: "Neon Horizons Launch", track_or_album: "Neon Horizons EP", platform: "Instagram", scheduled_date: "2024-02-01", content_type: "Reels", status: "Completed" },
  { id: "pt2", campaign_name: "Neon Horizons Launch", track_or_album: "Neon Horizons EP", platform: "YouTube", scheduled_date: "2024-02-10", content_type: "Music Video", status: "Completed" },
  { id: "pt3", campaign_name: "Binary Sunset Pre-Save", track_or_album: "Binary Sunset", platform: "Instagram", scheduled_date: "2024-03-20", content_type: "Story", status: "Scheduled" },
  { id: "pt4", campaign_name: "Binary Sunset Pre-Save", track_or_album: "Binary Sunset", platform: "TikTok", scheduled_date: "2024-03-22", content_type: "Short Clip", status: "Scheduled" },
  { id: "pt5", campaign_name: "Digital Feelings Rollout", track_or_album: "Digital Feelings", platform: "Press", scheduled_date: "2024-04-10", content_type: "Press Release", status: "Draft" },
];

export const mockProductionTasks: ProductionTask[] = [
  {
    id: "prod1",
    title: "Night Drive — Production",
    track_title: "Night Drive",
    release_id: "r1",
    phase: "mastering",
    start_date: "2024-01-05",
    end_date: "2024-02-08",
    progress: 100,
    subtasks: [
      { id: "ps1a", title: "Writing & Arrangement", start_date: "2024-01-05", end_date: "2024-01-12", type: "production", completed: true },
      { id: "ps1b", title: "Recording Sessions", start_date: "2024-01-13", end_date: "2024-01-22", type: "production", completed: true },
      { id: "ps1c", title: "Mixing", start_date: "2024-01-23", end_date: "2024-01-30", type: "production", completed: true },
      { id: "ps1d", title: "Mastering", start_date: "2024-01-31", end_date: "2024-02-04", type: "production", completed: true },
      { id: "ps1e", title: "Distributor Submission", start_date: "2024-01-30", end_date: "2024-02-02", type: "distribution", completed: true },
      { id: "ps1f", title: "Marketing Campaign", start_date: "2024-02-01", end_date: "2024-02-14", type: "marketing", completed: true },
    ],
  },
  {
    id: "prod2",
    title: "Digital Feelings — Production",
    track_title: "Digital Feelings",
    release_id: "r2",
    phase: "mixing",
    start_date: "2024-02-17",
    end_date: "2024-03-19",
    progress: 65,
    subtasks: [
      { id: "ps2a", title: "Songwriting", start_date: "2024-02-17", end_date: "2024-02-28", type: "production", completed: true },
      { id: "ps2b", title: "Recording", start_date: "2024-03-01", end_date: "2024-03-10", type: "production", completed: true },
      { id: "ps2c", title: "Mixing & Sound Design", start_date: "2024-03-11", end_date: "2024-03-19", type: "production", completed: false },
      { id: "ps2d", title: "Release Prep", start_date: "2024-03-19", end_date: "2024-03-25", type: "release_prep", completed: false },
      { id: "ps2e", title: "Distributor Upload", start_date: "2024-04-01", end_date: "2024-04-05", type: "distribution", completed: false },
      { id: "ps2f", title: "Pre-save Campaign", start_date: "2024-04-05", end_date: "2024-04-20", type: "marketing", completed: false },
    ],
  },
  {
    id: "prod3",
    title: "Binary Sunset — Production",
    track_title: "Binary Sunset",
    release_id: "r3",
    phase: "review",
    start_date: "2024-02-20",
    end_date: "2024-03-15",
    progress: 85,
    subtasks: [
      { id: "ps3a", title: "Composition", start_date: "2024-02-20", end_date: "2024-03-01", type: "production", completed: true },
      { id: "ps3b", title: "Sound Design & Mixing", start_date: "2024-03-02", end_date: "2024-03-10", type: "production", completed: true },
      { id: "ps3c", title: "Mastering & QC", start_date: "2024-03-11", end_date: "2024-03-15", type: "production", completed: false },
      { id: "ps3d", title: "Distributor Submission", start_date: "2024-03-15", end_date: "2024-03-18", type: "distribution", completed: false },
      { id: "ps3e", title: "Pre-save & Promo", start_date: "2024-03-20", end_date: "2024-03-28", type: "marketing", completed: false },
    ],
  },
  {
    id: "prod4",
    title: "Night Drive Remixes — Production",
    track_title: "Night Drive Remixes",
    release_id: "r4",
    phase: "recording",
    start_date: "2024-02-10",
    end_date: "2024-03-15",
    progress: 40,
    subtasks: [
      { id: "ps4a", title: "Stems Prep & Send", start_date: "2024-02-10", end_date: "2024-02-15", type: "production", completed: true },
      { id: "ps4b", title: "Remixer Production", start_date: "2024-02-16", end_date: "2024-03-05", type: "production", completed: false },
      { id: "ps4c", title: "Review & Feedback", start_date: "2024-03-06", end_date: "2024-03-12", type: "production", completed: false },
      { id: "ps4d", title: "Final Master", start_date: "2024-03-13", end_date: "2024-03-15", type: "production", completed: false },
      { id: "ps4e", title: "Distributor Upload", start_date: "2024-03-20", end_date: "2024-03-22", type: "distribution", completed: false },
      { id: "ps4f", title: "Social Campaign", start_date: "2024-03-25", end_date: "2024-04-05", type: "marketing", completed: false },
    ],
  },
  {
    id: "prod5",
    title: "Chrome Hearts — Production",
    track_title: "Chrome Hearts",
    release_id: "r5",
    phase: "writing",
    start_date: "2024-03-15",
    end_date: "2024-04-20",
    progress: 10,
    subtasks: [
      { id: "ps5a", title: "Writing & Demo", start_date: "2024-03-15", end_date: "2024-03-28", type: "production", completed: false },
      { id: "ps5b", title: "Recording", start_date: "2024-03-29", end_date: "2024-04-08", type: "production", completed: false },
      { id: "ps5c", title: "Mix & Master", start_date: "2024-04-09", end_date: "2024-04-20", type: "production", completed: false },
      { id: "ps5d", title: "Release Planning", start_date: "2024-04-20", end_date: "2024-04-28", type: "release_prep", completed: false },
      { id: "ps5e", title: "Promo Rollout", start_date: "2024-05-01", end_date: "2024-05-10", type: "marketing", completed: false },
    ],
  },
];

// Helper: get album for a track via AlbumTracks join
export function getAlbumsForTrack(trackId: string): Album[] {
  const albumIds = mockAlbumTracks.filter((at) => at.track_id === trackId).map((at) => at.album_id);
  return mockAlbums.filter((a) => albumIds.includes(a.album_id));
}

// Helper: get tracks for an album via AlbumTracks join
export function getTracksForAlbum(albumId: string): (Track & { track_number: number })[] {
  const albumTracks = mockAlbumTracks.filter((at) => at.album_id === albumId);
  return albumTracks
    .map((at) => {
      const track = mockTracks.find((t) => t.track_id === at.track_id);
      return track ? { ...track, track_number: at.track_number } : null;
    })
    .filter(Boolean) as (Track & { track_number: number })[];
}

// Helper: group tracks by work
export interface WorkGroup {
  work: Work;
  tracks: Track[];
}

export function getTracksGroupedByWork(): WorkGroup[] {
  return mockWorks.map((work) => ({
    work,
    tracks: mockTracks.filter((t) => t.work_id === work.work_id),
  }));
}

// Helper: get child/derived tracks
export function getDerivedTracks(trackId: string): Track[] {
  return mockTracks.filter((t) => t.parent_track_id === trackId);
}

// Helper: get relationships for a track
export function getRelationshipsForTrack(trackId: string): (TrackRelationship & { relatedTrack: Track })[] {
  return mockTrackRelationships
    .filter((r) => r.source_track_id === trackId || r.target_track_id === trackId)
    .map((r) => {
      const relatedId = r.source_track_id === trackId ? r.target_track_id : r.source_track_id;
      const relatedTrack = mockTracks.find((t) => t.track_id === relatedId);
      return relatedTrack ? { ...r, relatedTrack } : null;
    })
    .filter(Boolean) as (TrackRelationship & { relatedTrack: Track })[];
}
