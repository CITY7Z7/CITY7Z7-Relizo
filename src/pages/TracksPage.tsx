import { useState } from "react";
import { useTracks, useWorks, useDeleteTrack, DbTrack, DbWork } from "@/hooks/useDatabase";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Music, ChevronRight, GitBranch, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function TracksPage() {
  const { data: tracks = [], isLoading: loadingTracks } = useTracks();
  const { data: works = [], isLoading: loadingWorks } = useWorks();
  const deleteTrack = useDeleteTrack();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"work" | "flat">("work");
  const [expandedWorks, setExpandedWorks] = useState<Set<string>>(new Set());

  // Auto-expand works on first load
  const [initialized, setInitialized] = useState(false);
  if (!initialized && works.length > 0) {
    setExpandedWorks(new Set(works.map(w => w.id)));
    setInitialized(true);
  }

  const genres = [...new Set(tracks.map((t) => t.genre).filter(Boolean))];

  const matchesFilter = (t: DbTrack) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase()) ||
      t.isrc.toLowerCase().includes(search.toLowerCase()) ||
      t.version_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchGenre = genreFilter === "all" || t.genre === genreFilter;
    return matchSearch && matchStatus && matchGenre;
  };

  const toggleWork = (workId: string) => {
    setExpandedWorks((prev) => {
      const next = new Set(prev);
      next.has(workId) ? next.delete(workId) : next.add(workId);
      return next;
    });
  };

  const workGroups = works
    .map((work) => ({
      work,
      tracks: tracks.filter((t) => t.work_id === work.id && matchesFilter(t)),
    }))
    .filter((g) => g.tracks.length > 0);

  const orphanTracks = tracks.filter((t) => !t.work_id && matchesFilter(t));
  const flatFiltered = tracks.filter(matchesFilter);

  const handleDelete = (trackId: string, trackTitle: string) => {
    const children = tracks.filter(t => t.parent_track_id === trackId);
    if (children.length > 0) {
      toast.warning(`"${trackTitle}" has ${children.length} derived version(s). They will be unlinked.`);
    }
    deleteTrack.mutate(trackId, {
      onSuccess: () => toast.success(`"${trackTitle}" deleted`),
      onError: (err) => toast.error(`Failed to delete: ${err.message}`),
    });
  };

  const keyColors: Record<string, string> = {
    "C Major": "bg-status-ready/15 text-status-ready",
    "C Minor": "bg-status-ready/10 text-status-ready",
    "C# Major": "bg-status-scheduled/15 text-status-scheduled",
    "C# Minor": "bg-status-scheduled/10 text-status-scheduled",
    "D Major": "bg-status-submitted/15 text-status-submitted",
    "D Minor": "bg-status-submitted/10 text-status-submitted",
    "D# Major": "bg-destructive/15 text-destructive",
    "D# Minor": "bg-destructive/10 text-destructive",
    "E Major": "bg-status-released/15 text-status-released",
    "E Minor": "bg-status-released/10 text-status-released",
    "F Major": "bg-primary/15 text-primary",
    "F Minor": "bg-primary/10 text-primary",
    "F# Major": "bg-status-submitted/15 text-status-submitted",
    "F# Minor": "bg-status-submitted/10 text-status-submitted",
    "G Major": "bg-status-ready/15 text-status-ready",
    "G Minor": "bg-status-ready/10 text-status-ready",
    "G# Major": "bg-status-released/15 text-status-released",
    "G# Minor": "bg-status-released/10 text-status-released",
    "A Major": "bg-status-scheduled/15 text-status-scheduled",
    "A Minor": "bg-status-scheduled/10 text-status-scheduled",
    "A# Major": "bg-primary/15 text-primary",
    "A# Minor": "bg-primary/10 text-primary",
    "B Major": "bg-destructive/15 text-destructive",
    "B Minor": "bg-destructive/10 text-destructive",
  };
  const getKeyColor = (key: string) => keyColors[key] || "bg-muted text-muted-foreground";

  const trackTypeColors: Record<string, { text: string; bg: string }> = {
    Original: { text: "text-status-released", bg: "bg-status-released/10" },
    Remix: { text: "text-status-scheduled", bg: "bg-status-scheduled/10" },
    "VIP Remix": { text: "text-status-submitted", bg: "bg-status-submitted/10" },
    Edit: { text: "text-status-ready", bg: "bg-status-ready/10" },
    "Extended Mix": { text: "text-primary", bg: "bg-primary/10" },
    "Radio Edit": { text: "text-status-ready", bg: "bg-status-ready/10" },
    Instrumental: { text: "text-status-draft", bg: "bg-status-draft/10" },
    Acapella: { text: "text-status-submitted", bg: "bg-status-submitted/10" },
    Live: { text: "text-destructive", bg: "bg-destructive/10" },
  };

  const TrackRow = ({ track, indent = false }: { track: DbTrack; indent?: boolean }) => {
    const typeColor = trackTypeColors[track.track_type] || trackTypeColors.Original;
    return (
      <div className={`grid grid-cols-[1fr_100px_80px_80px_100px_40px] items-center gap-4 px-4 py-2 border-b border-border/30 group ${indent ? "pl-12" : ""}`}>
        <Link to={`/tracks/${track.id}`} className="flex items-center gap-3 min-w-0">
          <div className={`h-8 w-8 rounded-sm ${typeColor.bg} flex items-center justify-center shrink-0`}>
            <Music className={`h-3.5 w-3.5 ${typeColor.text}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-150">
              {track.version_name || track.title}
              {track.track_type !== "Original" && (
                <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {track.track_type}
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {track.remixer_artist ? `${track.remixer_artist} · ` : ""}{track.artist}
              {track.featured_artists && ` ft. ${track.featured_artists}`}
            </span>
          </div>
        </Link>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">{track.isrc}</span>
        <span className={`text-xs font-medium text-center py-1 rounded ${getKeyColor(track.musical_key)}`}>{track.musical_key}</span>
        <span className="text-xs tabular-nums text-right">{track.bpm}</span>
        <div className="flex justify-end">
          <StatusBadge status={track.status} />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete track?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{track.title} ({track.version_name})". This action cannot be undone.
                {tracks.filter(t => t.parent_track_id === track.id).length > 0 && (
                  <span className="block mt-2 text-destructive font-medium">
                    ⚠️ This track has derived versions that will be unlinked.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(track.id, track.title)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  if (loadingTracks || loadingWorks) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tighter">Track Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tracks.length} tracks · {works.length} works
          </p>
        </div>
        <Link to="/tracks/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Track
          </Button>
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tracks, artists, ISRC, versions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 shadow-sm" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] shadow-sm"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Ready">Ready</SelectItem>
            <SelectItem value="Released">Released</SelectItem>
          </SelectContent>
        </Select>
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-[140px] shadow-sm"><SelectValue placeholder="Genre" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((g) => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
          </SelectContent>
        </Select>
        <div className="flex rounded-md shadow-sm border border-input overflow-hidden">
          <button onClick={() => setViewMode("work")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "work" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            <GitBranch className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setViewMode("flat")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "flat" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            <Music className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="rounded-xl shadow-studio bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_80px_80px_100px_40px] items-center gap-4 px-4 py-2.5 border-b border-border/50 text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">
          <span>Title / Artist</span>
          <span>ISRC</span>
          <span className="text-center">Key</span>
          <span className="text-right">BPM</span>
          <span className="text-right">Status</span>
          <span></span>
        </div>

        {viewMode === "work" ? (
          <>
            {workGroups.map(({ work, tracks: wTracks }) => {
              const originals = wTracks.filter((t) => !t.parent_track_id);
              const children = wTracks.filter((t) => t.parent_track_id);
              const isExpanded = expandedWorks.has(work.id);

              return (
                <Collapsible key={work.id} open={isExpanded} onOpenChange={() => toggleWork(work.id)}>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border/30 cursor-pointer hover:bg-muted/80 transition-colors">
                      <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                      <span className="text-sm font-semibold">{work.title}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">
                        {wTracks.length} version{wTracks.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-auto">{work.composer}</span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <AnimatePresence>
                      {originals.map((track) => (
                        <div key={track.id}>
                          <TrackRow track={track} indent />
                          {children.filter((c) => c.parent_track_id === track.id).map((child) => (
                            <div key={child.id} className="border-l-2 border-primary/20 ml-8">
                              <TrackRow track={child} indent />
                            </div>
                          ))}
                        </div>
                      ))}
                      {children.filter((c) => !originals.some((o) => o.id === c.parent_track_id)).map((child) => (
                        <div key={child.id} className="border-l-2 border-primary/20 ml-8">
                          <TrackRow track={child} indent />
                        </div>
                      ))}
                    </AnimatePresence>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
            {orphanTracks.map((track) => (<TrackRow key={track.id} track={track} />))}
          </>
        ) : (
          flatFiltered.map((track) => (<TrackRow key={track.id} track={track} />))
        )}

        {(viewMode === "work" ? workGroups.length === 0 && orphanTracks.length === 0 : flatFiltered.length === 0) && (
          <div className="py-12 text-center text-sm text-muted-foreground">No tracks match your filters.</div>
        )}
      </div>
    </div>
  );
}
