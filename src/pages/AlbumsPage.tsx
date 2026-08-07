import { useState } from "react";
import { useAlbums, useAlbumTracks } from "@/hooks/useDatabase";
import { Link } from "react-router";
import { Disc3, Loader2, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AlbumsPage() {
  const { data: albums = [], isLoading } = useAlbums();
  const { data: albumTracks = [] } = useAlbumTracks();
  const [sortBy, setSortBy] = useState<string>("title");

  if (isLoading) {
    return <div className="p-6 flex items-center justify-center min-h-[400px]"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const sorted = [...albums].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "release_date") return a.release_date.localeCompare(b.release_date);
    if (sortBy === "artist") return a.artist.localeCompare(b.artist);
    if (sortBy === "type") return a.release_type.localeCompare(b.release_type);
    return 0;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tighter">Albums</h1>
          <p className="text-sm text-muted-foreground mt-1">{albums.length} albums</p>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="title">By Name</SelectItem>
              <SelectItem value="release_date">By Release Date</SelectItem>
              <SelectItem value="artist">By Artist</SelectItem>
              <SelectItem value="type">By Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">No albums yet.</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {sorted.map((album) => {
            const trackCount = albumTracks.filter((at) => at.album_id === album.id).length;
            return (
              <Link to={`/albums/${album.id}`} key={album.id}>
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} className="rounded-xl bg-card shadow-studio overflow-hidden cursor-pointer hover:shadow-studio-lg transition-shadow">
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    {album.cover_art ? (
                      <img src={album.cover_art} alt={album.title} className="w-full h-full object-cover" />
                    ) : (
                      <Disc3 className="h-16 w-16 text-muted-foreground/20" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold truncate">{album.title}</p>
                    <p className="text-xs text-muted-foreground">{album.artist} · {album.release_type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{trackCount} tracks · {album.release_date}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
