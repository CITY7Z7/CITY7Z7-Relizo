import { useParams, Link, useNavigate } from "react-router";
import { useTrack, useTracks, useWorks, useTrackRelationships, useAlbums, useAlbumTracks, useDeleteTrack, useUpdateTrack, useTrackAudioFiles, useCreateTrackAudioFile, useDeleteTrackAudioFile, useDistributors, useTrackDistributors, useCreateTrackDistributor, useDeleteTrackDistributor, usePromoTasks, useTrackPromotions, useCreateTrackPromotion, useDeleteTrackPromotion } from "@/hooks/useDatabase";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, GitBranch, Link2, Disc3, Trash2, Loader2, Save, Upload, X, FileAudio, Image as ImageIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GenreMultiSelect } from "@/components/GenreMultiSelect";

type TrackStatus = Database["public"]["Enums"]["track_status"];

export default function TrackDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: track, isLoading } = useTrack(id);
  const { data: allTracks = [] } = useTracks();
  const { data: allWorks = [] } = useWorks();
  const { data: relationships = [] } = useTrackRelationships();
  const { data: albums = [] } = useAlbums();
  const { data: albumTracks = [] } = useAlbumTracks();
  const { data: audioFiles = [] } = useTrackAudioFiles(id);
  const { data: allDistributors = [] } = useDistributors();
  const { data: trackDistributors = [] } = useTrackDistributors(id);
  const { data: allPromoTasks = [] } = usePromoTasks();
  const { data: trackPromotions = [] } = useTrackPromotions(id);
  const deleteTrack = useDeleteTrack();
  const updateTrack = useUpdateTrack();
  const createAudioFile = useCreateTrackAudioFile();
  const deleteAudioFile = useDeleteTrackAudioFile();
  const createTrackDistributor = useCreateTrackDistributor();
  const deleteTrackDistributor = useDeleteTrackDistributor();
  const createTrackPromotion = useCreateTrackPromotion();
  const deleteTrackPromotion = useDeleteTrackPromotion();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["basic", "version", "technical", "metadata"]));
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [processingAudio, setProcessingAudio] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (track) {
      const peaks = (track as any).waveform_peaks;
      if (Array.isArray(peaks) && peaks.length > 0) {
        setWaveformData(peaks);
      } else {
        // Fallback: generate pseudo-waveform from track id
        const seed = track.id.charCodeAt(0) + track.id.charCodeAt(1);
        setWaveformData(Array.from({ length: 60 }, (_, i) => {
          const v = Math.sin(i * 0.3 + seed) * 0.3 + Math.sin(i * 0.7 + seed * 2) * 0.2 + 0.5;
          return Math.max(0.1, Math.min(1, v));
        }));
      }
    }
  }, [track]);

  const startEditing = useCallback(() => {
    if (!track) return;
    setEditing(true);
    setEditData({
      title: track.title, artist: track.artist, featured_artists: track.featured_artists,
      genre: track.genre, subgenre: track.subgenre, language: track.language,
      description: track.description, lyrics: track.lyrics, explicit_flag: track.explicit_flag,
      track_type: track.track_type, version_name: track.version_name,
      remixer_artist: track.remixer_artist, bpm: track.bpm, musical_key: track.musical_key,
      duration: track.duration, isrc: track.isrc,
      album_artist: track.album_artist || "", year: track.year || 0,
      track_number: track.track_number || 0, disc_number: track.disc_number || 1,
      publisher: track.publisher || "", composer: track.composer || "",
      conductor: track.conductor || "", comment: track.comment || "",
      grouping: track.grouping || "", channels: track.channels || "",
      bitrate: track.bitrate || "", sample_rate: track.sample_rate || "",
      loudness_level: track.loudness_level || "", encoder: track.encoder || "",
      musicians: track.musicians || "", additional_contributors: track.additional_contributors || "",
      upc: (track as any).upc || "", release_type: (track as any).release_type || "",
      release_date: (track as any).release_date || "",
      id3_metadata: (track as any).id3_metadata || "", riff_metadata: (track as any).riff_metadata || "",
      track_notes: (track as any).track_notes || "", catalog_tags: (track as any).catalog_tags || "",
    });
  }, [track]);

  if (isLoading) {
    return <div className="p-6 flex items-center justify-center min-h-[400px]"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!track) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Track not found.</p>
        <Link to="/tracks"><Button variant="ghost" size="sm" className="mt-2"><ArrowLeft className="h-4 w-4 mr-1" />Back</Button></Link>
      </div>
    );
  }

  const work = track.work_id ? allWorks.find((w) => w.id === track.work_id) : null;
  const parentTrack = track.parent_track_id ? allTracks.find((t) => t.id === track.parent_track_id) : null;
  const derivedTracks = allTracks.filter(t => t.parent_track_id === track.id);
  const trackRelationships = relationships
    .filter((r) => r.source_track_id === track.id || r.target_track_id === track.id)
    .map((r) => {
      const relatedId = r.source_track_id === track.id ? r.target_track_id : r.source_track_id;
      const relatedTrack = allTracks.find((t) => t.id === relatedId);
      return relatedTrack ? { ...r, relatedTrack } : null;
    })
    .filter(Boolean) as any[];

  const trackAlbumIds = albumTracks.filter(at => at.track_id === track.id).map(at => at.album_id);
  const trackAlbums = albums.filter(a => trackAlbumIds.includes(a.id));

  const handleDelete = () => {
    deleteTrack.mutate(track.id, {
      onSuccess: () => { toast.success("Track deleted"); navigate("/tracks"); },
      onError: (err) => toast.error(`Failed: ${err.message}`),
    });
  };

  const handleStatusUpdate = (newStatus: TrackStatus) => {
    updateTrack.mutate({ id: track.id, status: newStatus }, {
      onSuccess: () => toast.success(`Status updated to ${newStatus}`),
      onError: (err) => toast.error(`Failed: ${err.message}`),
    });
  };

  const handleSave = () => {
    updateTrack.mutate({ id: track.id, ...editData }, {
      onSuccess: () => { toast.success("Track updated"); setEditing(false); },
      onError: (err) => toast.error(`Failed: ${err.message}`),
    });
  };

  const processAudioMetadata = async (fileUrl: string) => {
    setProcessingAudio(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/process-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ file_url: fileUrl, track_id: track.id }),
      });
      const result = await res.json();
      if (res.ok && result.peaks) {
        setWaveformData(result.peaks);
        toast.success("Waveform & metadata extracted");
      } else {
        toast.error("Audio processing: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      toast.error("Audio processing failed");
    } finally {
      setProcessingAudio(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const format = ext.toUpperCase();
    const path = `tracks/${track.id}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("audio").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed: " + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("audio").getPublicUrl(path);
    const isPrimary = audioFiles.length === 0;

    createAudioFile.mutate({
      track_id: track.id,
      file_url: urlData.publicUrl,
      file_format: format,
      file_size: file.size,
      is_primary: isPrimary,
    }, {
      onSuccess: () => {
        updateTrack.mutate({
          id: track.id,
          audio_file: urlData.publicUrl,
          audio_file_type: format,
          file_size: file.size,
        } as any);
        toast.success(`${format} file uploaded`);
        setUploading(false);
        // Process audio for waveform + metadata extraction
        processAudioMetadata(urlData.publicUrl);
      },
      onError: (err) => { toast.error(err.message); setUploading(false); },
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `covers/track_${track.id}.${ext}`;
    const { error } = await supabase.storage.from("audio").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed: " + error.message); setUploadingCover(false); return; }
    const { data: urlData } = supabase.storage.from("audio").getPublicUrl(path);
    updateTrack.mutate({ id: track.id, cover_art: urlData.publicUrl }, {
      onSuccess: () => { toast.success("Cover art updated"); setUploadingCover(false); },
      onError: (err) => { toast.error(err.message); setUploadingCover(false); },
    });
  };

  const handleDeleteAudioFile = (fileId: string) => {
    deleteAudioFile.mutate({ id: fileId, trackId: track.id }, {
      onSuccess: () => toast.success("Audio file removed"),
      onError: (err) => toast.error(err.message),
    });
  };

  const toggleSection = (s: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const Section = ({ id: sectionId, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <Collapsible open={expandedSections.has(sectionId)} onOpenChange={() => toggleSection(sectionId)}>
      <CollapsibleTrigger className="w-full text-left">
        <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3 hover:text-foreground transition-colors cursor-pointer">{title}</h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm font-medium">{value || "—"}</div>
    </div>
  );

  const EditField = ({ label, field, type = "text" }: { label: string; field: string; type?: string }) => (
    <div className="space-y-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      {type === "textarea" ? (
        <Textarea value={editData[field] || ""} onChange={e => setEditData(d => ({ ...d, [field]: e.target.value }))} rows={2} className="text-xs" />
      ) : (
        <Input type={type} value={editData[field] ?? ""} onChange={e => setEditData(d => ({ ...d, [field]: type === "number" ? (e.target.value ? Number(e.target.value) : 0) : e.target.value }))} className="h-7 text-xs" />
      )}
    </div>
  );

  const displayTitle = track.version_name ? `${track.title} (${track.version_name})` : track.title;
  const relationshipLabels: Record<string, string> = {
    remix_of: "Remix of", cover_of: "Cover of", sampled_from: "Sampled from", interpolation_of: "Interpolation of",
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "—";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/tracks">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tighter">{displayTitle}</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">{track.track_type}</span>
            <StatusBadge status={track.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {track.remixer_artist ? `${track.remixer_artist} · ` : ""}{track.artist}{track.featured_artists ? ` ft. ${track.featured_artists}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={updateTrack.isPending}>
                {updateTrack.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}Save
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={startEditing}>Edit</Button>
              <Select value={track.status} onValueChange={(v) => handleStatusUpdate(v as TrackStatus)}>
                <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Draft", "Scheduled", "Submitted", "Ready", "Released"] as TrackStatus[]).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" />Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete "{track.title}"?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        <div className="space-y-2 rounded-xl bg-card shadow-studio p-6">
          {editing ? (
            <>
              <Section id="basic" title="Basic Info">
                <EditField label="Title" field="title" />
                <EditField label="Artist" field="artist" />
                <EditField label="Featured Artists" field="featured_artists" />
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Genre</Label>
                  <GenreMultiSelect value={editData.genre || ""} onChange={v => setEditData(d => ({ ...d, genre: v }))} />
                </div>
                <EditField label="Subgenre" field="subgenre" />
                <EditField label="Language" field="language" />
                <EditField label="Description" field="description" type="textarea" />
              </Section>
              <Section id="version" title="Version Info">
                <EditField label="Version Name" field="version_name" />
                <EditField label="Remixer Artist" field="remixer_artist" />
              </Section>
              <Section id="technical" title="Technical Data">
                <EditField label="BPM" field="bpm" type="number" />
                <EditField label="Key" field="musical_key" />
                <EditField label="Duration" field="duration" />
                <EditField label="ISRC" field="isrc" />
                <EditField label="UPC" field="upc" />
              </Section>
              <Section id="core" title="Core Metadata">
                <EditField label="Album Artist" field="album_artist" />
                <EditField label="Year" field="year" type="number" />
                <EditField label="Track Number" field="track_number" type="number" />
                <EditField label="Disc Number" field="disc_number" type="number" />
                <EditField label="Publisher" field="publisher" />
                <EditField label="Composer" field="composer" />
                <EditField label="Conductor" field="conductor" />
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Release Type</Label>
                  <Select value={editData.release_type || ""} onValueChange={v => setEditData(d => ({ ...d, release_type: v }))}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Album">Album</SelectItem>
                      <SelectItem value="EP">EP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <EditField label="Release Date" field="release_date" />
              </Section>
              <Section id="text" title="Description & Text">
                <EditField label="Comment" field="comment" type="textarea" />
                <EditField label="Lyrics" field="lyrics" type="textarea" />
                <EditField label="Grouping" field="grouping" />
                <EditField label="Track Notes" field="track_notes" type="textarea" />
                <EditField label="Catalog Tags" field="catalog_tags" />
              </Section>
              <Section id="audio" title="Technical Audio Data">
                <EditField label="Channels" field="channels" />
                <EditField label="Bitrate" field="bitrate" />
                <EditField label="Sample Rate" field="sample_rate" />
                <EditField label="Loudness Level" field="loudness_level" />
                <EditField label="Encoder" field="encoder" />
              </Section>
              <Section id="id3" title="ID3 / RIFF Metadata">
                <EditField label="ID3 Metadata" field="id3_metadata" type="textarea" />
                <EditField label="RIFF Metadata" field="riff_metadata" type="textarea" />
              </Section>
              <Section id="contributors" title="Contributors">
                <EditField label="Musicians" field="musicians" type="textarea" />
                <EditField label="Additional Contributors" field="additional_contributors" type="textarea" />
              </Section>
            </>
          ) : (
            <>
              <Section id="basic" title="Basic Info">
                <Field label="Genre" value={track.genre} />
                <Field label="Subgenre" value={track.subgenre} />
                <Field label="Language" value={track.language} />
                <Field label="Explicit" value={track.explicit_flag ? "Yes" : "No"} />
                <Field label="Description" value={track.description} />
              </Section>
              <Section id="version" title="Version Info">
                <Field label="Track Type" value={track.track_type} />
                <Field label="Version" value={track.version_name} />
                <Field label="Remixer" value={track.remixer_artist} />
                <Field label="Parent Track" value={parentTrack ? (
                  <Link to={`/tracks/${parentTrack.id}`} className="text-primary hover:underline">
                    {parentTrack.title} ({parentTrack.version_name})
                  </Link>
                ) : "—"} />
              </Section>
              <Section id="technical" title="Technical Data">
                <Field label="BPM" value={<span className="tabular-nums">{track.bpm}</span>} />
                <Field label="Key" value={track.musical_key} />
                <Field label="Duration" value={<span className="tabular-nums">{track.duration}</span>} />
                <Field label="ISRC" value={<span className="font-mono tabular-nums">{track.isrc}</span>} />
                <Field label="UPC" value={<span className="font-mono tabular-nums">{(track as any).upc}</span>} />
              </Section>
              <Section id="core" title="Core Metadata">
                <Field label="Album Artist" value={track.album_artist} />
                <Field label="Year" value={track.year || "—"} />
                <Field label="Track Number" value={track.track_number || "—"} />
                <Field label="Disc Number" value={track.disc_number || "—"} />
                <Field label="Publisher" value={track.publisher} />
                <Field label="Composer" value={track.composer} />
                <Field label="Conductor" value={track.conductor} />
                <Field label="Release Type" value={(track as any).release_type} />
                <Field label="Release Date" value={(track as any).release_date} />
              </Section>
              <Section id="text" title="Description & Text">
                <Field label="Comment" value={track.comment} />
                <Field label="Lyrics" value={track.lyrics} />
                <Field label="Grouping" value={track.grouping} />
                <Field label="Track Notes" value={(track as any).track_notes} />
                <Field label="Catalog Tags" value={(track as any).catalog_tags} />
              </Section>
              <Section id="audio" title="Technical Audio Data">
                <Field label="Audio File Type" value={track.audio_file_type} />
                <Field label="File Size" value={formatFileSize(track.file_size || 0)} />
                <Field label="Channels" value={track.channels} />
                <Field label="Bitrate" value={track.bitrate} />
                <Field label="Sample Rate" value={track.sample_rate} />
                <Field label="Loudness Level" value={track.loudness_level} />
                <Field label="Encoder" value={track.encoder} />
              </Section>
              <Section id="id3" title="ID3 / RIFF Metadata">
                <Field label="ID3 Metadata" value={(track as any).id3_metadata} />
                <Field label="RIFF Metadata" value={(track as any).riff_metadata} />
              </Section>
              <Section id="stats" title="Statistics">
                <Field label="First Added" value={new Date(track.created_at).toLocaleDateString()} />
                <Field label="Last Modified" value={new Date(track.updated_at).toLocaleDateString()} />
                <Field label="Play Count" value={track.play_count || 0} />
                <Field label="Last Played" value={track.last_played_at ? new Date(track.last_played_at).toLocaleDateString() : "—"} />
              </Section>
              <Section id="contributors" title="Contributors">
                <Field label="Musicians" value={track.musicians} />
                <Field label="Additional Contributors" value={track.additional_contributors} />
              </Section>
            </>
          )}
        </div>

        <div className="space-y-4">
          {/* Waveform */}
          <div className="rounded-xl bg-card shadow-studio p-4">
            <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3">Waveform</h3>
            <div className="h-20 rounded-md bg-muted flex items-end justify-center gap-[1.5px] px-2 py-2">
              {waveformData.map((v, i) => (
                <div key={i} className="w-1 bg-primary/40 rounded-full transition-all" style={{ height: `${v * 100}%` }} />
              ))}
            </div>
            {processingAudio && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Extracting waveform & metadata...
              </div>
            )}
            <div className="mt-3">
              <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs" onClick={() => audioInputRef.current?.click()} disabled={uploading || processingAudio}>
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {uploading ? "Uploading..." : "Upload Audio (WAV/MP3/FLAC)"}
              </Button>
              <input ref={audioInputRef} type="file" accept=".wav,.mp3,.flac,audio/*" className="hidden" onChange={handleAudioUpload} />
            </div>
            {/* Multiple audio files list */}
            {audioFiles.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Audio Files</p>
                {audioFiles.map((af: any) => (
                  <div key={af.id} className="flex items-center justify-between py-1 px-2 rounded bg-muted/50 text-xs">
                    <div className="flex items-center gap-1.5">
                      <FileAudio className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{af.file_format}</span>
                      <span className="text-muted-foreground">{formatFileSize(af.file_size)}</span>
                    </div>
                    <button onClick={() => handleDeleteAudioFile(af.id)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {track.audio_file && audioFiles.length === 0 && (
              <p className="text-[10px] text-muted-foreground mt-1.5 truncate">
                {track.audio_file_type || "Audio"} · {formatFileSize(track.file_size || 0)}
              </p>
            )}
          </div>

          {/* Cover Art */}
          <div className="rounded-xl bg-card shadow-studio p-4">
            <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3">Cover Art</h3>
            <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {track.cover_art ? (
                <img src={track.cover_art} alt={`Cover art for ${displayTitle}`} className="w-full h-full object-cover" />
              ) : (
                <Music className="h-12 w-12 text-muted-foreground/30" />
              )}
            </div>
            <div className="mt-3">
              <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover}>
                {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
                {uploadingCover ? "Uploading..." : track.cover_art ? "Replace Cover" : "Upload Cover Art"}
              </Button>
              <input ref={coverInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleCoverUpload} />
              <p className="text-[10px] text-muted-foreground mt-1">Recommended: 3000×3000px, JPEG/PNG</p>
            </div>
          </div>

          {work && (
            <div className="rounded-xl bg-card shadow-studio p-4">
              <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                <Disc3 className="h-3 w-3" /> Work
              </h3>
              <p className="text-sm font-semibold">{work.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{work.composer}{work.lyricist ? ` · ${work.lyricist}` : ""}</p>
              {work.publisher && <p className="text-xs text-muted-foreground">{work.publisher}</p>}
            </div>
          )}

          {trackAlbums.length > 0 && trackAlbums.map((album) => (
            <Link to={`/albums/${album.id}`} key={album.id}>
              <div className="rounded-xl bg-card shadow-studio p-4 hover:shadow-studio-lg transition-shadow duration-150 cursor-pointer">
                <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3">Album</h3>
                <p className="text-sm font-semibold">{album.title}</p>
                <p className="text-xs text-muted-foreground">{album.artist} · {album.release_type}</p>
              </div>
            </Link>
          ))}

          {derivedTracks.length > 0 && (
            <div className="rounded-xl bg-card shadow-studio p-4">
              <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                <GitBranch className="h-3 w-3" /> Derived Versions
              </h3>
              <div className="space-y-2">
                {derivedTracks.map((dt) => (
                  <Link to={`/tracks/${dt.id}`} key={dt.id} className="block">
                    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/80 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{dt.version_name}</p>
                        <p className="text-xs text-muted-foreground">{dt.remixer_artist || dt.artist} · {dt.track_type}</p>
                      </div>
                      <StatusBadge status={dt.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {trackRelationships.length > 0 && (
            <div className="rounded-xl bg-card shadow-studio p-4">
              <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                <Link2 className="h-3 w-3" /> Relationships
              </h3>
              <div className="space-y-2">
                {trackRelationships.map((r: any) => (
                  <Link to={`/tracks/${r.relatedTrack.id}`} key={r.id} className="block">
                    <div className="py-1.5 px-2 rounded-md hover:bg-muted/80 transition-colors">
                      <p className="text-xs text-muted-foreground">{relationshipLabels[r.relationship_type] || r.relationship_type}</p>
                      <p className="text-sm font-medium">{r.relatedTrack.title} ({r.relatedTrack.version_name})</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Distributors */}
          <div className="rounded-xl bg-card shadow-studio p-4">
            <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3">Distributors</h3>
            {trackDistributors.map((td: any) => {
              const dist = allDistributors.find(d => d.id === td.distributor_id);
              return dist ? (
                <div key={td.id} className="flex items-center justify-between py-1 px-2 rounded bg-muted/50 text-xs mb-1">
                  <span className="font-medium">{dist.name}</span>
                  <button onClick={() => deleteTrackDistributor.mutate({ id: td.id, trackId: track.id })} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                </div>
              ) : null;
            })}
            {allDistributors.filter(d => !trackDistributors.some((td: any) => td.distributor_id === d.id)).length > 0 && (
              <Select onValueChange={(v) => createTrackDistributor.mutate({ track_id: track.id, distributor_id: v })}>
                <SelectTrigger className="h-7 text-xs mt-1"><SelectValue placeholder="Link distributor..." /></SelectTrigger>
                <SelectContent>
                  {allDistributors.filter(d => !trackDistributors.some((td: any) => td.distributor_id === d.id)).map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Promotions */}
          <div className="rounded-xl bg-card shadow-studio p-4">
            <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3">Promotions</h3>
            {trackPromotions.map((tp: any) => {
              const promo = allPromoTasks.find(p => p.id === tp.promo_task_id);
              return promo ? (
                <div key={tp.id} className="flex items-center justify-between py-1 px-2 rounded bg-muted/50 text-xs mb-1">
                  <span className="font-medium">{promo.campaign_name}</span>
                  <button onClick={() => deleteTrackPromotion.mutate({ id: tp.id, trackId: track.id })} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                </div>
              ) : null;
            })}
            {allPromoTasks.filter(p => !trackPromotions.some((tp: any) => tp.promo_task_id === p.id)).length > 0 && (
              <Select onValueChange={(v) => createTrackPromotion.mutate({ track_id: track.id, promo_task_id: v })}>
                <SelectTrigger className="h-7 text-xs mt-1"><SelectValue placeholder="Link promotion..." /></SelectTrigger>
                <SelectContent>
                  {allPromoTasks.filter(p => !trackPromotions.some((tp: any) => tp.promo_task_id === p.id)).map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.campaign_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
