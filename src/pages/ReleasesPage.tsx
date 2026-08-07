import { useReleases, useProductionTasks, useUpdateProductionTask } from "@/hooks/useDatabase";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar, List, GanttChart as GanttIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GanttChart } from "@/components/GanttChart";
import { Link } from "react-router";
import { toast } from "sonner";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ReleasesPage() {
  const { data: releases = [], isLoading: lr } = useReleases();
  const { data: productionTasks = [], isLoading: lp } = useProductionTasks();
  const updateProductionTask = useUpdateProductionTask();
  const [view, setView] = useState<"calendar" | "table" | "gantt">("gantt");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  if (lr || lp) {
    return <div className="p-6 flex items-center justify-center min-h-[400px]"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  const getReleasesForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return releases.filter((r) => r.planned_release_date === dateStr);
  };

  const getProductionEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const events: { label: string; type: "start" | "end" | "release"; id?: string }[] = [];
    productionTasks.forEach((t: any) => {
      if (t.start_date === dateStr) events.push({ label: `🎬 ${t.track_title}`, type: "start", id: t.id });
      if (t.end_date === dateStr) events.push({ label: `✅ ${t.track_title}`, type: "end", id: t.id });
    });
    return events;
  };

  const statusColors: Record<string, string> = {
    Draft: "bg-status-draft/20 text-status-draft border-status-draft/30",
    Scheduled: "bg-status-scheduled/20 text-status-scheduled border-status-scheduled/30",
    Submitted: "bg-status-submitted/20 text-status-submitted border-status-submitted/30",
    Ready: "bg-status-ready/20 text-status-ready border-status-ready/30",
    Released: "bg-status-released/20 text-status-released border-status-released/30",
  };

  const statusDot: Record<string, string> = {
    Draft: "bg-status-draft",
    Scheduled: "bg-status-scheduled",
    Submitted: "bg-status-submitted",
    Ready: "bg-status-ready",
    Released: "bg-status-released",
  };

  const ganttTasks = productionTasks.map((t: any) => ({
    id: t.id,
    title: t.title,
    track_title: t.track_title,
    release_id: t.release_id,
    phase: t.phase,
    start_date: t.start_date,
    end_date: t.end_date,
    progress: t.progress,
    subtasks: t.subtasks || [],
  }));

  const handleTaskUpdate = (taskId: string, updates: Record<string, any>) => {
    updateProductionTask.mutate({ id: taskId, ...updates }, {
      onSuccess: () => toast.success("Task updated"),
      onError: (err) => toast.error(err.message),
    });
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tighter">Release Planning</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {releases.length} releases · {productionTasks.length} productions
          </p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          <Button variant={view === "gantt" ? "default" : "ghost"} size="sm" onClick={() => setView("gantt")} className="gap-1.5 h-7 text-xs">
            <GanttIcon className="h-3.5 w-3.5" />Planner
          </Button>
          <Button variant={view === "calendar" ? "default" : "ghost"} size="sm" onClick={() => setView("calendar")} className="gap-1.5 h-7 text-xs">
            <Calendar className="h-3.5 w-3.5" />Calendar
          </Button>
          <Button variant={view === "table" ? "default" : "ghost"} size="sm" onClick={() => setView("table")} className="gap-1.5 h-7 text-xs">
            <List className="h-3.5 w-3.5" />Table
          </Button>
        </div>
      </div>

      {(view === "calendar" || view === "gantt") && (
        <div className="flex items-center justify-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={prevMonth}>←</Button>
          <span className="text-sm font-semibold min-w-[100px] text-center">{months[currentMonth]} {currentYear}</span>
          <Button variant="ghost" size="sm" onClick={nextMonth}>→</Button>
        </div>
      )}

      {view === "gantt" && (
        <GanttChart tasks={ganttTasks} releases={releases} currentMonth={currentMonth} currentYear={currentYear} onTaskUpdate={handleTaskUpdate} />
      )}

      {view === "calendar" && (
        <div className="rounded-xl bg-card shadow-studio overflow-hidden">
          <div className="grid grid-cols-7">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d} className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground text-center py-2 border-b border-border/50">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] border-b border-r border-border/30 bg-muted/30" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayReleases = getReleasesForDay(day);
              const prodEvents = getProductionEventsForDay(day);
              return (
                <div key={day} className="min-h-[90px] border-b border-r border-border/30 p-1.5">
                  <span className="text-xs tabular-nums text-muted-foreground">{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayReleases.map((r) => (
                      <div key={r.id} className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate border ${statusColors[r.status] || ""}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[r.status] || ""}`} />
                        <span className="truncate">{r.title}</span>
                      </div>
                    ))}
                    {prodEvents.map((ev, idx) => (
                      <div key={idx} className={`px-1.5 py-0.5 rounded-md text-[9px] font-medium truncate cursor-pointer hover:opacity-80 ${ev.type === "start" ? "bg-primary/10 text-primary" : "bg-status-ready/10 text-status-ready"}`}>
                        {ev.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "table" && (
        <div className="rounded-xl bg-card shadow-studio overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_120px_120px_120px] items-center gap-4 px-4 py-2.5 border-b border-border/50 text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">
            <span>Release</span><span>Release Date</span><span>Distributor Sub.</span><span>Marketing Start</span><span className="text-right">Status</span>
          </div>
          {releases.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No releases yet.</div>
          ) : releases.map((r) => (
            <div key={r.id} className="grid grid-cols-[1fr_120px_120px_120px_120px] items-center gap-4 px-4 py-3 border-b border-border/30 hover:bg-muted/30 transition-colors">
              <div>
                <span className="text-sm font-semibold">{r.title}</span>
                <span className="text-xs text-muted-foreground ml-2 capitalize">{r.type}</span>
              </div>
              <span className="text-xs tabular-nums">{r.planned_release_date || "—"}</span>
              <span className="text-xs tabular-nums">{r.distributor_submission_date || "—"}</span>
              <span className="text-xs tabular-nums">{r.marketing_start_date || "—"}</span>
              <div className="flex justify-end"><StatusBadge status={r.status} /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
