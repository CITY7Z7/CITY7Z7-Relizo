import { TrackStatus } from "@/types/music";

const statusMap: Record<TrackStatus, { color: string; bg: string }> = {
  Draft: { color: "text-status-draft", bg: "bg-status-draft/10" },
  Scheduled: { color: "text-status-scheduled", bg: "bg-status-scheduled/10" },
  Submitted: { color: "text-status-submitted", bg: "bg-status-submitted/10" },
  Ready: { color: "text-status-ready", bg: "bg-status-ready/10" },
  Released: { color: "text-status-released", bg: "bg-status-released/10" },
};

export function StatusBadge({ status }: { status: TrackStatus }) {
  const s = statusMap[status] || statusMap.Draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${s.color} ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
      {status}
    </span>
  );
}
