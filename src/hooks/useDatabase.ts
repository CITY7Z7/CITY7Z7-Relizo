import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Type aliases
export type DbTrack = Tables<"tracks">;
export type DbWork = Tables<"works">;
export type DbAlbum = Tables<"albums">;
export type DbAlbumTrack = Tables<"album_tracks">;
export type DbRelease = Tables<"releases">;
export type DbDistributor = Tables<"distributors">;
export type DbPromotionChannel = Tables<"promotion_channels">;
export type DbPromoTask = Tables<"promo_tasks">;
export type DbProductionTask = Tables<"production_tasks">;
export type DbProductionSubtask = Tables<"production_subtasks">;
export type DbTrackRelationship = Tables<"track_relationships">;
export type DbSocialLink = Tables<"social_links">;

// ===== WORKS =====
export function useWorks() {
  return useQuery({
    queryKey: ["works"],
    queryFn: async () => {
      const { data, error } = await supabase.from("works").select("*").order("title");
      if (error) throw error;
      return data as DbWork[];
    },
  });
}

export function useCreateWork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (work: TablesInsert<"works">) => {
      const { data, error } = await supabase.from("works").insert(work).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["works"] }),
  });
}

// ===== TRACKS =====
export function useTracks() {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tracks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbTrack[];
    },
  });
}

export function useTrack(id: string | undefined) {
  return useQuery({
    queryKey: ["tracks", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("tracks").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data as DbTrack | null;
    },
  });
}

export function useCreateTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (track: TablesInsert<"tracks">) => {
      const { data, error } = await supabase.from("tracks").insert(track).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
  });
}

export function useUpdateTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"tracks"> & { id: string }) => {
      const { data, error } = await supabase.from("tracks").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
  });
}

export function useDeleteTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tracks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tracks"] });
      qc.invalidateQueries({ queryKey: ["album_tracks"] });
      qc.invalidateQueries({ queryKey: ["track_relationships"] });
    },
  });
}

// ===== TRACK RELATIONSHIPS =====
export function useTrackRelationships() {
  return useQuery({
    queryKey: ["track_relationships"],
    queryFn: async () => {
      const { data, error } = await supabase.from("track_relationships").select("*");
      if (error) throw error;
      return data as DbTrackRelationship[];
    },
  });
}

export function useCreateTrackRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rel: TablesInsert<"track_relationships">) => {
      const { data, error } = await supabase.from("track_relationships").insert(rel).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["track_relationships"] }),
  });
}

export function useDeleteTrackRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("track_relationships").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["track_relationships"] }),
  });
}

// ===== ALBUMS =====
export function useAlbums() {
  return useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const { data, error } = await supabase.from("albums").select("*").order("title");
      if (error) throw error;
      return data as DbAlbum[];
    },
  });
}

export function useAlbum(id: string | undefined) {
  return useQuery({
    queryKey: ["albums", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("albums").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data as DbAlbum | null;
    },
  });
}

export function useCreateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (album: TablesInsert<"albums">) => {
      const { data, error } = await supabase.from("albums").insert(album).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["albums"] }),
  });
}

export function useUpdateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"albums"> & { id: string }) => {
      const { data, error } = await supabase.from("albums").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["albums"] }),
  });
}

export function useDeleteAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("albums").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["albums"] }),
  });
}

// ===== ALBUM TRACKS =====
export function useAlbumTracks() {
  return useQuery({
    queryKey: ["album_tracks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("album_tracks").select("*").order("track_number");
      if (error) throw error;
      return data as DbAlbumTrack[];
    },
  });
}

export function useCreateAlbumTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (at: TablesInsert<"album_tracks">) => {
      const { data, error } = await supabase.from("album_tracks").insert(at).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["album_tracks"] }),
  });
}

export function useDeleteAlbumTrack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("album_tracks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["album_tracks"] }),
  });
}

// ===== RELEASES =====
export function useReleases() {
  return useQuery({
    queryKey: ["releases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("releases").select("*").order("planned_release_date");
      if (error) throw error;
      return data as DbRelease[];
    },
  });
}

export function useCreateRelease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rel: TablesInsert<"releases">) => {
      const { data, error } = await supabase.from("releases").insert(rel).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["releases"] }),
  });
}

export function useUpdateRelease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"releases"> & { id: string }) => {
      const { data, error } = await supabase.from("releases").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["releases"] }),
  });
}

export function useDeleteRelease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("releases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["releases"] }),
  });
}

// ===== DISTRIBUTORS =====
export function useDistributors() {
  return useQuery({
    queryKey: ["distributors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("distributors").select("*").order("name");
      if (error) throw error;
      return data as DbDistributor[];
    },
  });
}

export function useCreateDistributor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: TablesInsert<"distributors">) => {
      const { data, error } = await supabase.from("distributors").insert(d).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["distributors"] }),
  });
}

export function useUpdateDistributor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"distributors"> & { id: string }) => {
      const { data, error } = await supabase.from("distributors").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["distributors"] }),
  });
}

export function useDeleteDistributor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("distributors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["distributors"] }),
  });
}

// ===== PROMOTION =====
export function usePromotionChannels() {
  return useQuery({
    queryKey: ["promotion_channels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("promotion_channels").select("*").order("platform");
      if (error) throw error;
      return data as DbPromotionChannel[];
    },
  });
}

export function useCreatePromotionChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ch: TablesInsert<"promotion_channels">) => {
      const { data, error } = await supabase.from("promotion_channels").insert(ch).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotion_channels"] }),
  });
}

export function useUpdatePromotionChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"promotion_channels"> & { id: string }) => {
      const { data, error } = await supabase.from("promotion_channels").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotion_channels"] }),
  });
}

export function useDeletePromotionChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promotion_channels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotion_channels"] }),
  });
}

export function usePromoTasks() {
  return useQuery({
    queryKey: ["promo_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("promo_tasks").select("*").order("scheduled_date");
      if (error) throw error;
      return data as DbPromoTask[];
    },
  });
}

export function useCreatePromoTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (t: TablesInsert<"promo_tasks">) => {
      const { data, error } = await supabase.from("promo_tasks").insert(t).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promo_tasks"] }),
  });
}

export function useUpdatePromoTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"promo_tasks"> & { id: string }) => {
      const { data, error } = await supabase.from("promo_tasks").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promo_tasks"] }),
  });
}

export function useDeletePromoTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promo_tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promo_tasks"] }),
  });
}

// ===== PRODUCTION TASKS =====
export function useProductionTasks() {
  return useQuery({
    queryKey: ["production_tasks"],
    queryFn: async () => {
      const { data: tasks, error } = await supabase.from("production_tasks").select("*").order("start_date");
      if (error) throw error;
      const { data: subtasks, error: subError } = await supabase.from("production_subtasks").select("*");
      if (subError) throw subError;
      return (tasks || []).map(t => ({
        ...t,
        subtasks: (subtasks || []).filter(s => s.production_task_id === t.id),
      }));
    },
  });
}

export function useCreateProductionTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { task: TablesInsert<"production_tasks">; subtasks: Omit<TablesInsert<"production_subtasks">, "production_task_id">[] }) => {
      const { data: task, error } = await supabase.from("production_tasks").insert(payload.task).select().single();
      if (error) throw error;
      if (payload.subtasks.length > 0) {
        const subs = payload.subtasks.map(s => ({ ...s, production_task_id: task.id }));
        const { error: subError } = await supabase.from("production_subtasks").insert(subs);
        if (subError) throw subError;
      }
      return task;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["production_tasks"] }),
  });
}

export function useUpdateProductionTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"production_tasks"> & { id: string }) => {
      const { data, error } = await supabase.from("production_tasks").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["production_tasks"] }),
  });
}

// ===== TRACK AUDIO FILES =====
export function useTrackAudioFiles(trackId: string | undefined) {
  return useQuery({
    queryKey: ["track_audio_files", trackId],
    enabled: !!trackId,
    queryFn: async () => {
      const { data, error } = await supabase.from("track_audio_files").select("*").eq("track_id", trackId!).order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTrackAudioFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: { track_id: string; file_url: string; file_format: string; file_size: number; is_primary: boolean }) => {
      const { data, error } = await supabase.from("track_audio_files").insert(file).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["track_audio_files", vars.track_id] }),
  });
}

export function useDeleteTrackAudioFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, trackId }: { id: string; trackId: string }) => {
      const { error } = await supabase.from("track_audio_files").delete().eq("id", id);
      if (error) throw error;
      return trackId;
    },
    onSuccess: (trackId) => qc.invalidateQueries({ queryKey: ["track_audio_files", trackId] }),
  });
}

// ===== TRACK DISTRIBUTORS (many-to-many) =====
export function useTrackDistributors(trackId?: string) {
  return useQuery({
    queryKey: ["track_distributors", trackId],
    enabled: !!trackId,
    queryFn: async () => {
      const { data, error } = await supabase.from("track_distributors").select("*").eq("track_id", trackId!);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTrackDistributor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (td: { track_id: string; distributor_id: string }) => {
      const { data, error } = await supabase.from("track_distributors").insert(td).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["track_distributors", vars.track_id] }),
  });
}

export function useDeleteTrackDistributor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, trackId }: { id: string; trackId: string }) => {
      const { error } = await supabase.from("track_distributors").delete().eq("id", id);
      if (error) throw error;
      return trackId;
    },
    onSuccess: (trackId) => qc.invalidateQueries({ queryKey: ["track_distributors", trackId] }),
  });
}

// ===== TRACK PROMOTIONS (many-to-many) =====
export function useTrackPromotions(trackId?: string) {
  return useQuery({
    queryKey: ["track_promotions", trackId],
    enabled: !!trackId,
    queryFn: async () => {
      const { data, error } = await supabase.from("track_promotions").select("*").eq("track_id", trackId!);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTrackPromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tp: { track_id: string; promo_task_id: string }) => {
      const { data, error } = await supabase.from("track_promotions").insert(tp).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["track_promotions", vars.track_id] }),
  });
}

export function useDeleteTrackPromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, trackId }: { id: string; trackId: string }) => {
      const { error } = await supabase.from("track_promotions").delete().eq("id", id);
      if (error) throw error;
      return trackId;
    },
    onSuccess: (trackId) => qc.invalidateQueries({ queryKey: ["track_promotions", trackId] }),
  });
}

// ===== SOCIAL LINKS =====
export function useSocialLinks() {
  return useQuery({
    queryKey: ["social_links"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_links").select("*").order("platform");
      if (error) throw error;
      return data as DbSocialLink[];
    },
  });
}

export function useUpdateSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string }) => {
      const { data, error } = await supabase.from("social_links").update({ url }).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social_links"] }),
  });
}
