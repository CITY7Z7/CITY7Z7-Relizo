import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Flag, Truck, Megaphone, Music, Package } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface GanttSubtask {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  type: string;
  completed: boolean;
}

interface GanttTask {
  id: string;
  title: string;
  track_title: string;
  release_id?: string | null;
  phase: string;
  start_date: string;
  end_date: string;
  progress: number;
  subtasks: GanttSubtask[];
}

interface GanttRelease {
  id: string;
  title: string;
  planned_release_date: string;
  distributor_submission_date?: string;
  marketing_start_date?: string;
  status: string;
}

interface GanttChartProps {
  tasks: GanttTask[];
  releases: GanttRelease[];
  currentMonth: number;
  currentYear: number;
  onTaskUpdate?: (taskId: string, updates: Record<string, any>) => void;
}

const phaseColors: Record<string, { bg: string; text: string; border: string }> = {
  writing: { bg: "bg-status-draft/20", text: "text-status-draft", border: "border-status-draft/40" },
  recording: { bg: "bg-status-scheduled/20", text: "text-status-scheduled", border: "border-status-scheduled/40" },
  mixing: { bg: "bg-status-submitted/20", text: "text-status-submitted", border: "border-status-submitted/40" },
  mastering: { bg: "bg-status-ready/20", text: "text-status-ready", border: "border-status-ready/40" },
  review: { bg: "bg-status-released/20", text: "text-status-released", border: "border-status-released/40" },
};

const subtaskTypeColors: Record<string, { bar: string; dot: string }> = {
  production: { bar: "bg-primary/70", dot: "bg-primary" },
  release_prep: { bar: "bg-status-ready/60", dot: "bg-status-ready" },
  marketing: { bar: "bg-status-submitted/60", dot: "bg-status-submitted" },
  distribution: { bar: "bg-status-scheduled/60", dot: "bg-status-scheduled" },
};

const subtaskTypeIcons: Record<string, React.ReactNode> = {
  production: <Music className="h-3 w-3" />,
  release_prep: <Package className="h-3 w-3" />,
  marketing: <Megaphone className="h-3 w-3" />,
  distribution: <Truck className="h-3 w-3" />,
};

function getDaysBetween(start: string, end: string) {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
}

export function GanttChart({ tasks, releases: allReleases, currentMonth, currentYear, onTaskUpdate }: GanttChartProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(tasks.map(t => t.id)));
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});

  const monthRange = useMemo(() => {
    const months: { month: number; year: number; days: number }[] = [];
    for (let i = -1; i <= 2; i++) {
      let m = currentMonth + i;
      let y = currentYear;
      if (m < 0) { m += 12; y -= 1; }
      if (m > 11) { m -= 12; y += 1; }
      months.push({ month: m, year: y, days: new Date(y, m + 1, 0).getDate() });
    }
    return months;
  }, [currentMonth, currentYear]);

  const totalDays = monthRange.reduce((sum, m) => sum + m.days, 0);
  const startDate = new Date(monthRange[0].year, monthRange[0].month, 1);

  const getDayOffset = (dateStr: string) => {
    const d = new Date(dateStr);
    return Math.max(0, Math.ceil((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const getDayWidth = (dayOffset: number) => (dayOffset / totalDays) * 100;

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  const releasesInRange = useMemo(() => {
    const end = new Date(monthRange[monthRange.length - 1].year, monthRange[monthRange.length - 1].month + 1, 0);
    return allReleases.filter(r => {
      if (!r.planned_release_date) return false;
      const d = new Date(r.planned_release_date);
      return d >= startDate && d <= end;
    });
  }, [monthRange, startDate, allReleases]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const startEditTask = (task: GanttTask) => {
    setEditingTaskId(task.id);
    setEditValues({ start_date: task.start_date, end_date: task.end_date, progress: task.progress });
  };

  const saveEditTask = (taskId: string) => {
    if (onTaskUpdate) onTaskUpdate(taskId, editValues);
    setEditingTaskId(null);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="rounded-xl bg-card shadow-studio overflow-hidden">
        {/* Legend */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border/50 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Legend:</span>
          {Object.entries(subtaskTypeColors).map(([type, colors]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
              <span className="text-[10px] capitalize text-muted-foreground">{type.replace("_", " ")}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <Flag className="h-3 w-3 text-destructive" />
            <span className="text-[10px] text-muted-foreground">Release Date</span>
          </div>
        </div>

        {/* Timeline header */}
        <div className="flex border-b border-border/50">
          <div className="w-[260px] shrink-0 border-r border-border/50 px-3 py-2">
            <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Track / Task</span>
          </div>
          <div className="flex-1 relative">
            <div className="flex">
              {monthRange.map((m, i) => (
                <div key={i} className={`text-center py-2 border-r border-border/30 text-[10px] uppercase tracking-[0.1em] font-semibold ${m.month === currentMonth && m.year === currentYear ? "text-primary bg-primary/5" : "text-muted-foreground"}`} style={{ width: `${(m.days / totalDays) * 100}%` }}>
                  {monthNames[m.month]} {m.year}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Day grid */}
        <div className="flex border-b border-border/30">
          <div className="w-[260px] shrink-0 border-r border-border/50" />
          <div className="flex-1 relative flex">
            {monthRange.map((m, mi) => {
              const weeks: number[] = [];
              for (let d = 1; d <= m.days; d += 7) weeks.push(d);
              return (
                <div key={mi} className="flex border-r border-border/30" style={{ width: `${(m.days / totalDays) * 100}%` }}>
                  {weeks.map((w, wi) => {
                    const daysInWeek = Math.min(7, m.days - w + 1);
                    return <div key={wi} className="text-center text-[9px] tabular-nums text-muted-foreground/60 py-1 border-r border-border/20" style={{ width: `${(daysInWeek / m.days) * 100}%` }}>{w}</div>;
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Task rows */}
        {tasks.map((task) => {
          const isExpanded = expandedTasks.has(task.id);
          const phase = phaseColors[task.phase] || phaseColors.writing;
          const taskStart = getDayOffset(task.start_date);
          const taskDuration = getDaysBetween(task.start_date, task.end_date);
          const release = task.release_id ? allReleases.find(r => r.id === task.release_id) : null;
          const isEditing = editingTaskId === task.id;

          return (
            <div key={task.id}>
              <div className="flex group hover:bg-muted/30 transition-colors">
                <div className="w-[260px] shrink-0 border-r border-border/50 px-3 py-2.5 flex items-center gap-2">
                  <button onClick={() => toggleExpand(task.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{task.track_title}</div>
                    {isEditing ? (
                      <div className="space-y-1.5 mt-1">
                        <div className="flex gap-1">
                          <Input type="date" value={editValues.start_date} onChange={e => setEditValues(v => ({ ...v, start_date: e.target.value }))} className="h-5 text-[9px] px-1" />
                          <Input type="date" value={editValues.end_date} onChange={e => setEditValues(v => ({ ...v, end_date: e.target.value }))} className="h-5 text-[9px] px-1" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Slider value={[editValues.progress]} onValueChange={([v]) => setEditValues(ev => ({ ...ev, progress: v }))} max={100} step={5} className="flex-1" />
                          <span className="text-[9px] tabular-nums w-7 text-right">{editValues.progress}%</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => saveEditTask(task.id)} className="text-[9px] text-primary hover:underline">Save</button>
                          <button onClick={() => setEditingTaskId(null)} className="text-[9px] text-muted-foreground hover:underline">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${phase.bg} ${phase.text} ${phase.border} capitalize font-medium`}>{task.phase}</span>
                        <span className="text-[9px] text-muted-foreground tabular-nums">{task.progress}%</span>
                        {onTaskUpdate && (
                          <button onClick={() => startEditTask(task)} className="text-[9px] text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-auto">Edit</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 relative py-2.5 border-b border-border/20">
                  {monthRange.slice(1).map((m, i) => {
                    const offset = monthRange.slice(0, i + 1).reduce((s, mo) => s + mo.days, 0);
                    return <div key={i} className="absolute top-0 bottom-0 border-l border-border/30" style={{ left: `${getDayWidth(offset)}%` }} />;
                  })}

                  {release?.planned_release_date && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute top-0 bottom-0 flex items-center z-20" style={{ left: `${getDayWidth(getDayOffset(release.planned_release_date))}%` }}>
                          <div className="w-px h-full bg-destructive/40" />
                          <Flag className="h-3 w-3 text-destructive absolute -top-0.5 -left-1.5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-semibold">{release.title}</p>
                        <p className="text-muted-foreground">Release: {release.planned_release_date}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute top-1/2 -translate-y-1/2 h-5 rounded-full overflow-hidden cursor-pointer" style={{ left: `${getDayWidth(taskStart)}%`, width: `${getDayWidth(taskDuration)}%` }}>
                        <div className={`h-full rounded-full ${phase.bg} border ${phase.border}`}>
                          <div className={`h-full rounded-full transition-all ${task.progress === 100 ? "bg-status-released/40" : "bg-primary/30"}`} style={{ width: `${task.progress}%` }} />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p className="font-semibold">{task.title}</p>
                      <p className="text-muted-foreground">{task.start_date} → {task.end_date}</p>
                      <p className="text-muted-foreground">Progress: {task.progress}%</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {isExpanded && task.subtasks.map((sub) => {
                const subStart = getDayOffset(sub.start_date);
                const subDuration = getDaysBetween(sub.start_date, sub.end_date);
                const subColors = subtaskTypeColors[sub.type] || subtaskTypeColors.production;

                return (
                  <div key={sub.id} className="flex hover:bg-muted/20 transition-colors">
                    <div className="w-[260px] shrink-0 border-r border-border/50 pl-9 pr-3 py-1.5 flex items-center gap-2">
                      <span className={`${subColors.dot} p-0.5 rounded`}>{subtaskTypeIcons[sub.type]}</span>
                      <span className={`text-[11px] truncate ${sub.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{sub.title}</span>
                    </div>
                    <div className="flex-1 relative py-1.5 border-b border-border/10">
                      {monthRange.slice(1).map((m, i) => {
                        const offset = monthRange.slice(0, i + 1).reduce((s, mo) => s + mo.days, 0);
                        return <div key={i} className="absolute top-0 bottom-0 border-l border-border/20" style={{ left: `${getDayWidth(offset)}%` }} />;
                      })}
                      {release?.planned_release_date && (
                        <div className="absolute top-0 bottom-0 w-px bg-destructive/20 z-10" style={{ left: `${getDayWidth(getDayOffset(release.planned_release_date))}%` }} />
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`absolute top-1/2 -translate-y-1/2 h-3 rounded-full cursor-pointer ${subColors.bar} ${sub.completed ? "opacity-50" : ""}`} style={{ left: `${getDayWidth(subStart)}%`, width: `${Math.max(getDayWidth(subDuration), 0.8)}%` }} />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-semibold">{sub.title}</p>
                          <p className="text-muted-foreground">{sub.start_date} → {sub.end_date}</p>
                          <p className="text-muted-foreground capitalize">{sub.type.replace("_", " ")} • {sub.completed ? "Done" : "In progress"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Release markers row */}
        <div className="flex border-t border-border/50 bg-muted/20">
          <div className="w-[260px] shrink-0 border-r border-border/50 px-3 py-2">
            <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Flag className="h-3 w-3 text-destructive" />Releases
            </span>
          </div>
          <div className="flex-1 relative py-2">
            {monthRange.slice(1).map((m, i) => {
              const offset = monthRange.slice(0, i + 1).reduce((s, mo) => s + mo.days, 0);
              return <div key={i} className="absolute top-0 bottom-0 border-l border-border/30" style={{ left: `${getDayWidth(offset)}%` }} />;
            })}
            {releasesInRange.map((r) => (
              <Tooltip key={r.id}>
                <TooltipTrigger asChild>
                  <div className="absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer" style={{ left: `${getDayWidth(getDayOffset(r.planned_release_date))}%` }}>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-destructive/10 border border-destructive/30 whitespace-nowrap">
                      <Flag className="h-2.5 w-2.5 text-destructive" />
                      <span className="text-[9px] font-semibold text-destructive">{r.title}</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-muted-foreground">Release: {r.planned_release_date}</p>
                  {r.distributor_submission_date && <p className="text-muted-foreground">Distro: {r.distributor_submission_date}</p>}
                  {r.marketing_start_date && <p className="text-muted-foreground">Marketing: {r.marketing_start_date}</p>}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
