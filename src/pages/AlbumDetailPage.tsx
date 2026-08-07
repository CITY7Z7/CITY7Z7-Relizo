import { useParams, Link } from "react-router";
import { useAlbum, useAlbumTracks, useTracks, useUpdateAlbum } from "@/hooks/useDatabase";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Disc3, Music, Loader2, Copy, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRef } from "react";

export default function AlbumDetailPage() {
  const { id } = useParams();
  const { data: album, isLoading } = useAlbum(id);
  const { data: allAlbumTracks = [] } = useAlbumTracks();
  const { data: allTracks = [] } = useTracks();
  const updateAlbum = useUpdateAlbum();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return <div className="p-6 flex items-center justify-center min-h-[400px]"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!album) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Album not found.</p>
        <Link to="/albums"><Button variant="ghost" size="sm" className="mt-2"><ArrowLeft className="h-4 w-4 mr-1" />Back</Button></Link>
      </div>
    );
  }

  const albumTrackEntries = allAlbumTracks.filter(at => at.album_id === album.id).sort((a, b) => a.track_number - b.track_number);
  const tracks = albumTrackEntries.map(at => {
    const track = allTracks.find(t => t.id === at.track_id);
    return track ? { ...track, track_number: at.track_number } : null;
  }).filter(Boolean) as any[];

  const copyToClipboard = (value: string, label: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard`);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `covers/${album.id}.${ext}`;
    const { error } = await supabase.storage.from("audio").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed: " + error.message); return; }
    const { data: urlData } = supabase.storage.from("audio").getPublicUrl(path);
    updateAlbum.mutate({ id: album.id, cover_art: urlData.publicUrl }, {
      onSuccess: () => toast.success("Cover art updated"),
      onError: (err) => toast.error(err.message),
    });
  };

  const CopyField = ({ label, value }: { label: string; value: string }) => (
    <div>
      <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
      <div
        className="text-sm font-medium cursor-pointer hover:text-primary transition-colors flex items-center gap-1.5 group"
        onClick={() => copyToClipboard(value, label)}
        title="Click to copy"
      >
        {value || "—"}
        {value && <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity" />}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/albums"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tighter">{album.title}</h1>
          <p className="text-sm text-muted-foreground">{album.artist} · {album.release_type}</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          <div className="rounded-xl bg-card shadow-studio p-6">
            <h3 className="text-sm font-bold text-primary mb-4">Album Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <CopyField label="Label" value={album.label} />
              <CopyField label="Catalog #" value={album.catalog_number} />
              <CopyField label="UPC" value={album.upc} />
              <CopyField label="Release Date" value={album.release_date} />
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-studio overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50">
              <h3 className="text-sm font-bold text-primary">Tracklist</h3>
            </div>
            {tracks.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No tracks added yet.</div>
            ) : (
              tracks.map((track: any) => (
                <Link to={`/tracks/${track.id}`} key={track.id}>
                  <motion.div whileHover={{ backgroundColor: "hsl(var(--secondary))" }} transition={{ duration: 0.15 }} className="grid grid-cols-[32px_1fr_80px_80px_100px] items-center gap-4 px-4 py-2 border-b border-border/30 cursor-pointer">
                    <span className="text-xs tabular-nums text-muted-foreground text-center">{track.track_number}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {track.title}
                        {track.version_name && track.version_name !== "Original" && (
                          <span className="text-muted-foreground font-normal ml-1.5">({track.version_name})</span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{track.artist}</span>
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">{track.duration}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">{track.bpm} BPM</span>
                    <div className="flex justify-end"><StatusBadge status={track.status} /></div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-card shadow-studio p-4">
          <h3 className="text-sm font-bold text-primary mb-3">Cover Art</h3>
          <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden relative group">
            {album.cover_art ? (
              <img src={album.cover_art} alt={album.title} className="w-full h-full object-cover" />
            ) : (
              <Disc3 className="h-12 w-12 text-muted-foreground/20" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-3.5 w-3.5" />Change
              </Button>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
        </div>
      </div>
    </div>
  );
}
