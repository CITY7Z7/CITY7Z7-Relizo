import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateTrack, useTracks, useWorks } from "@/hooks/useDatabase";
import { Database } from "@/types/database";
import { GenreMultiSelect } from "@/components/GenreMultiSelect";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function FormField({ label, field, form, onChange, type = "text", placeholder = "", colSpan = false }: { label: string; field: string; form: Record<string, any>; onChange: (field: string, value: string) => void; type?: string; placeholder?: string; colSpan?: boolean }) {
  return (
    <div className={`space-y-1.5 ${colSpan ? "col-span-2" : ""}`}>
      <Label className="text-xs">{label}</Label>
      {type === "textarea" ? (
        <Textarea placeholder={placeholder} value={String(form[field] ?? "")} onChange={e => onChange(field, e.target.value)} rows={3} className="shadow-sm" />
      ) : (
        <Input type={type} placeholder={placeholder} value={String(form[field] ?? "")} onChange={e => onChange(field, e.target.value)} className="shadow-sm" />
      )}
    </div>
  );
}

type TrackType = Database["public"]["Enums"]["track_type"];

const trackTypes: TrackType[] = ["Original", "Remix", "VIP Remix", "Edit", "Extended Mix", "Radio Edit", "Instrumental", "Acapella", "Live"];

export default function AddTrackPage() {
  const navigate = useNavigate();
  const createTrack = useCreateTrack();
  const { data: allTracks = [] } = useTracks();
  const { data: allWorks = [] } = useWorks();

  const [form, setForm] = useState({
    title: "", artist: "", featured_artists: "", work_id: "none",
    genre: "", subgenre: "", language: "", explicit_flag: false,
    track_type: "Original" as TrackType, version_name: "", parent_track_id: "none",
    remixer_artist: "", bpm: "", musical_key: "", duration: "", isrc: "",
    description: "", lyrics: "", album_artist: "", year: "", track_number: "",
    disc_number: "", publisher: "", composer: "", conductor: "", comment: "",
    grouping: "", upc: "", release_type: "", release_date: "",
    track_notes: "", catalog_tags: "", musicians: "", additional_contributors: "",
  });

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.artist.trim()) {
      toast.error("Title and Artist are required");
      return;
    }

    try {
      await createTrack.mutateAsync({
        title: form.title.trim(),
        artist: form.artist.trim(),
        featured_artists: form.featured_artists,
        work_id: form.work_id === "none" ? null : form.work_id,
        genre: form.genre,
        subgenre: form.subgenre,
        language: form.language,
        explicit_flag: form.explicit_flag ? 1 : 0,
        track_type: form.track_type,
        version_name: form.version_name,
        parent_track_id: form.parent_track_id === "none" ? null : form.parent_track_id,
        remixer_artist: form.remixer_artist,
        bpm: form.bpm ? parseInt(form.bpm) : 0,
        musical_key: form.musical_key,
        duration: form.duration,
        isrc: form.isrc,
        description: form.description,
        lyrics: form.lyrics,
        album_artist: form.album_artist,
        year: form.year ? parseInt(form.year) : 0,
        track_number: form.track_number ? parseInt(form.track_number) : 0,
        disc_number: form.disc_number ? parseInt(form.disc_number) : 1,
        publisher: form.publisher,
        composer: form.composer,
        conductor: form.conductor,
        comment: form.comment,
        grouping: form.grouping,
        musicians: form.musicians,
        additional_contributors: form.additional_contributors,
      } as any);
      toast.success("Track added to catalog");
      navigate("/tracks");
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/tracks">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tighter">Add New Track</h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl bg-card shadow-studio p-6 space-y-8">
        <FormSection title="Basic Info">
          <FormField label="Title *" field="title" form={form} onChange={set} placeholder="Track title" />
          <FormField label="Artist *" field="artist" form={form} onChange={set} placeholder="Primary artist" />
          <FormField label="Featured Artists" field="featured_artists" form={form} onChange={set} placeholder="Featured artists" />
          <div className="space-y-1.5">
            <Label className="text-xs">Work (Composition)</Label>
            <Select value={form.work_id} onValueChange={v => set("work_id", v)}>
              <SelectTrigger className="shadow-sm"><SelectValue placeholder="Link to work" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">New Work</SelectItem>
                {allWorks.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.title} — {w.composer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Genre</Label>
            <GenreMultiSelect value={form.genre} onChange={v => set("genre", v)} />
          </div>
          <FormField label="Subgenre" field="subgenre" form={form} onChange={set} placeholder="Subgenre" />
          <FormField label="Language" field="language" form={form} onChange={set} placeholder="e.g. English" />
          <div className="flex items-center gap-3 col-span-2">
            <Switch checked={form.explicit_flag} onCheckedChange={v => set("explicit_flag", v)} />
            <Label className="text-xs">Explicit Content</Label>
          </div>
        </FormSection>

        <FormSection title="Version Info">
          <div className="space-y-1.5">
            <Label className="text-xs">Track Type *</Label>
            <Select value={form.track_type} onValueChange={v => set("track_type", v)}>
              <SelectTrigger className="shadow-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {trackTypes.map((tt) => (<SelectItem key={tt} value={tt}>{tt}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <FormField label="Version Name" field="version_name" form={form} onChange={set} placeholder="e.g. Extended Mix" />
          <div className="space-y-1.5">
            <Label className="text-xs">Parent Track</Label>
            <Select value={form.parent_track_id} onValueChange={v => set("parent_track_id", v)}>
              <SelectTrigger className="shadow-sm"><SelectValue placeholder="Select original" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (original)</SelectItem>
                {allTracks.filter((t) => t.track_type === "Original").map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.title} — {t.artist}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(form.track_type === "Remix" || form.track_type === "VIP Remix") && (
            <FormField label="Remixer Artist" field="remixer_artist" form={form} onChange={set} placeholder="Remixer name" />
          )}
        </FormSection>

        <FormSection title="Core Metadata">
          <FormField label="Album Artist" field="album_artist" form={form} onChange={set} placeholder="Album artist" />
          <FormField label="Year" field="year" form={form} onChange={set} type="number" placeholder="2026" />
          <FormField label="Track Number" field="track_number" form={form} onChange={set} type="number" />
          <FormField label="Disc Number" field="disc_number" form={form} onChange={set} type="number" />
          <FormField label="Publisher" field="publisher" form={form} onChange={set} />
          <FormField label="Composer" field="composer" form={form} onChange={set} />
          <FormField label="Conductor" field="conductor" form={form} onChange={set} />
          <div className="space-y-1.5">
            <Label className="text-xs">Release Type</Label>
            <Select value={form.release_type || "none"} onValueChange={v => set("release_type", v === "none" ? "" : v)}>
              <SelectTrigger className="shadow-sm"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Album">Album</SelectItem>
                <SelectItem value="EP">EP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormField label="Release Date" field="release_date" form={form} onChange={set} placeholder="YYYY-MM-DD" />
        </FormSection>

        <FormSection title="Audio Technical Data">
          <FormField label="BPM" field="bpm" form={form} onChange={set} type="number" placeholder="120" />
          <FormField label="Musical Key" field="musical_key" form={form} onChange={set} placeholder="e.g. G# Minor" />
          <FormField label="Duration" field="duration" form={form} onChange={set} placeholder="e.g. 4:32" />
          <FormField label="ISRC" field="isrc" form={form} onChange={set} placeholder="US-RC1-23-00012" />
          <FormField label="UPC" field="upc" form={form} onChange={set} placeholder="UPC code" />
        </FormSection>

        <FormSection title="Description & Text">
          <FormField label="Description" field="description" form={form} onChange={set} type="textarea" placeholder="Track description" colSpan />
          <FormField label="Comment" field="comment" form={form} onChange={set} type="textarea" colSpan />
          <FormField label="Lyrics" field="lyrics" form={form} onChange={set} type="textarea" placeholder="Paste lyrics" colSpan />
          <FormField label="Grouping" field="grouping" form={form} onChange={set} />
          <FormField label="Track Notes" field="track_notes" form={form} onChange={set} type="textarea" colSpan />
          <FormField label="Catalog Tags" field="catalog_tags" form={form} onChange={set} placeholder="tag1, tag2, ..." />
        </FormSection>

        <FormSection title="Contributors">
          <FormField label="Musicians" field="musicians" form={form} onChange={set} type="textarea" colSpan />
          <FormField label="Additional Contributors" field="additional_contributors" form={form} onChange={set} type="textarea" colSpan />
        </FormSection>

        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <Link to="/tracks">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={createTrack.isPending} className="gap-1.5">
            {createTrack.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {createTrack.isPending ? "Saving..." : "Save Track"}
          </Button>
        </div>
      </form>
    </div>
  );
}
