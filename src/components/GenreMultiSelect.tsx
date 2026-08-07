import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const GENRES = [
  "Acoustic","Alternative","Ambient","Blues","Classical","Country","Dance","Disco",
  "Drum and Bass","Dub","Dubstep","EDM","Electronic","Electro","Experimental","Folk",
  "Funk","Future Bass","Garage","Gospel","Grime","Grunge","Hard Rock","Hardcore",
  "Hardstyle","Hip Hop","House","Indie","Industrial","Jazz","Jungle","K-Pop","Latin",
  "Lo-Fi","Metal","Minimal","New Age","Nu Disco","Opera","Pop","Progressive House",
  "Psytrance","Punk","R&B","Ragga","Reggae","Reggaeton","Rock","Ska","Soul","Synthwave",
  "Tech House","Techno","Trance","Trap","Trip Hop","UK Garage","Vaporwave","World",
  // Subgenres
  "Acid House","Afrobeat","Bass House","Big Room","Breakbeat","Chillout","Chillwave",
  "Deep House","Downtempo","Electro House","Electronica","Future House","Melodic Techno",
  "Melodic House","Progressive Trance","Psybient","Tropical House","Vocal Trance",
];

interface GenreMultiSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function GenreMultiSelect({ value, onChange }: GenreMultiSelectProps) {
  const selected = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = GENRES.filter(g =>
    g.toLowerCase().includes(search.toLowerCase()) && !selected.includes(g)
  );

  const add = (g: string) => {
    onChange([...selected, g].join(", "));
    setSearch("");
  };

  const remove = (g: string) => {
    onChange(selected.filter(s => s !== g).join(", "));
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex flex-wrap gap-1 mb-1.5">
        {selected.map(g => (
          <Badge key={g} variant="secondary" className="text-[10px] gap-1 pr-1">
            {g}
            <button type="button" onClick={() => remove(g)} className="hover:text-destructive">
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        placeholder="Search genres..."
        value={search}
        onChange={e => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="h-7 text-xs"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-40 overflow-auto rounded-md border bg-popover shadow-md">
          {filtered.slice(0, 20).map(g => (
            <button
              key={g}
              type="button"
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors"
              onClick={() => add(g)}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
