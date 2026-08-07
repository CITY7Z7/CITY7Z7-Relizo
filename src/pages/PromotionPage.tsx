import { useState } from "react";
import { usePromotionChannels, usePromoTasks, useCreatePromotionChannel, useUpdatePromotionChannel, useDeletePromotionChannel, useCreatePromoTask, useUpdatePromoTask, useDeletePromoTask } from "@/hooks/useDatabase";
import { Megaphone, Plus, Loader2, Pencil, Trash2, Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function PromotionPage() {
  const { data: channels = [], isLoading: lc } = usePromotionChannels();
  const { data: promoTasks = [], isLoading: lp } = usePromoTasks();
  const createChannel = useCreatePromotionChannel();
  const updateChannel = useUpdatePromotionChannel();
  const deleteChannel = useDeletePromotionChannel();
  const createPromoTask = useCreatePromoTask();
  const updatePromoTask = useUpdatePromoTask();
  const deletePromoTask = useDeletePromoTask();

  const [addingChannel, setAddingChannel] = useState(false);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [chForm, setChForm] = useState({ platform: "", contact_person: "", email: "", notes: "" });

  const [addingTask, setAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({ campaign_name: "", track_or_album: "", platform: "", scheduled_date: "", content_type: "", status: "Draft" });

  if (lc || lp) {
    return <div className="p-6 flex items-center justify-center min-h-[400px]"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const pendingTasks = promoTasks.filter((t) => t.status !== "Completed");
  const completedTasks = promoTasks.filter((t) => t.status === "Completed");

  const handleAddChannel = () => {
    if (!chForm.platform.trim()) { toast.error("Platform is required"); return; }
    createChannel.mutate(chForm, {
      onSuccess: () => { toast.success("Channel added"); setAddingChannel(false); setChForm({ platform: "", contact_person: "", email: "", notes: "" }); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleUpdateChannel = () => {
    if (!editingChannelId) return;
    updateChannel.mutate({ id: editingChannelId, ...chForm }, {
      onSuccess: () => { toast.success("Updated"); setEditingChannelId(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleAddTask = () => {
    if (!taskForm.campaign_name.trim()) { toast.error("Campaign name is required"); return; }
    createPromoTask.mutate(taskForm, {
      onSuccess: () => { toast.success("Campaign added"); setAddingTask(false); setTaskForm({ campaign_name: "", track_or_album: "", platform: "", scheduled_date: "", content_type: "", status: "Draft" }); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleUpdateTask = () => {
    if (!editingTaskId) return;
    updatePromoTask.mutate({ id: editingTaskId, ...taskForm }, {
      onSuccess: () => { toast.success("Updated"); setEditingTaskId(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const isUrl = (s: string) => s.startsWith("http://") || s.startsWith("https://");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tighter">Promotion</h1>
          <p className="text-sm text-muted-foreground mt-1">{channels.length} channels · {promoTasks.length} campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setAddingChannel(true); setChForm({ platform: "", contact_person: "", email: "", notes: "" }); }}>
            <Plus className="h-3.5 w-3.5" />Add Channel
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => { setAddingTask(true); setTaskForm({ campaign_name: "", track_or_album: "", platform: "", scheduled_date: "", content_type: "", status: "Draft" }); }}>
            <Plus className="h-3.5 w-3.5" />New Campaign
          </Button>
        </div>
      </div>

      {/* Channels */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {addingChannel && (
          <div className="rounded-xl bg-card shadow-studio p-4 border-2 border-primary/20">
            <div className="space-y-2">
              <Input value={chForm.platform} onChange={e => setChForm(f => ({ ...f, platform: e.target.value }))} placeholder="Platform *" className="h-7 text-xs" />
              <Input value={chForm.contact_person} onChange={e => setChForm(f => ({ ...f, contact_person: e.target.value }))} placeholder="Contact Person" className="h-7 text-xs" />
              <Input value={chForm.email} onChange={e => setChForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="h-7 text-xs" />
              <Input value={chForm.notes} onChange={e => setChForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes / URL" className="h-7 text-xs" />
              <div className="flex gap-1 pt-1">
                <Button size="sm" className="h-6 text-[10px]" onClick={handleAddChannel}>Save</Button>
                <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => setAddingChannel(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
        {channels.map((ch) => (
          editingChannelId === ch.id ? (
            <div key={ch.id} className="rounded-xl bg-card shadow-studio p-4 border-2 border-primary/20">
              <div className="space-y-2">
                <Input value={chForm.platform} onChange={e => setChForm(f => ({ ...f, platform: e.target.value }))} className="h-7 text-xs" />
                <Input value={chForm.contact_person} onChange={e => setChForm(f => ({ ...f, contact_person: e.target.value }))} className="h-7 text-xs" />
                <Input value={chForm.email} onChange={e => setChForm(f => ({ ...f, email: e.target.value }))} className="h-7 text-xs" />
                <Input value={chForm.notes} onChange={e => setChForm(f => ({ ...f, notes: e.target.value }))} className="h-7 text-xs" />
                <div className="flex gap-1 pt-1">
                  <Button size="sm" className="h-6 text-[10px]" onClick={handleUpdateChannel}>Save</Button>
                  <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => setEditingChannelId(null)}>Cancel</Button>
                </div>
              </div>
            </div>
          ) : (
            <div key={ch.id} className="rounded-xl bg-card shadow-studio p-4 group relative">
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingChannelId(ch.id); setChForm({ platform: ch.platform, contact_person: ch.contact_person, email: ch.email, notes: ch.notes }); }} className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Delete "{ch.platform}"?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteChannel.mutate(ch.id, { onSuccess: () => toast.success("Deleted") })} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{ch.platform}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <div>{ch.contact_person}</div>
                {ch.email && (
                  <div className="mt-0.5">
                    {isUrl(ch.email) ? (
                      <a href={ch.email} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">{ch.email}<ExternalLink className="h-3 w-3" /></a>
                    ) : ch.email}
                  </div>
                )}
                {ch.notes && (
                  <div className="mt-1 text-[10px]">
                    {isUrl(ch.notes) ? (
                      <a href={ch.notes} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">{ch.notes}<ExternalLink className="h-3 w-3" /></a>
                    ) : ch.notes}
                  </div>
                )}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Active Campaigns */}
      <div className="space-y-4">
        <div className="rounded-xl bg-card shadow-studio overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Active Campaigns ({pendingTasks.length})</h3>
          </div>

          {addingTask && (
            <div className="grid grid-cols-[1fr_120px_100px_100px_80px_80px_60px] items-center gap-3 px-4 py-2 border-b border-primary/20 bg-primary/5">
              <Input value={taskForm.campaign_name} onChange={e => setTaskForm(f => ({ ...f, campaign_name: e.target.value }))} placeholder="Campaign *" className="h-7 text-xs" />
              <Input value={taskForm.track_or_album} onChange={e => setTaskForm(f => ({ ...f, track_or_album: e.target.value }))} placeholder="Track/Album" className="h-7 text-xs" />
              <Input value={taskForm.platform} onChange={e => setTaskForm(f => ({ ...f, platform: e.target.value }))} placeholder="Platform" className="h-7 text-xs" />
              <Input type="date" value={taskForm.scheduled_date} onChange={e => setTaskForm(f => ({ ...f, scheduled_date: e.target.value }))} className="h-7 text-xs" />
              <Input value={taskForm.content_type} onChange={e => setTaskForm(f => ({ ...f, content_type: e.target.value }))} placeholder="Type" className="h-7 text-xs" />
              <Input value={taskForm.status} onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))} placeholder="Status" className="h-7 text-xs" />
              <div className="flex gap-1">
                <button onClick={handleAddTask} className="text-primary"><Check className="h-4 w-4" /></button>
                <button onClick={() => setAddingTask(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {pendingTasks.length === 0 && !addingTask ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No active campaigns.</div>
          ) : pendingTasks.map((pt) => (
            editingTaskId === pt.id ? (
              <div key={pt.id} className="grid grid-cols-[1fr_120px_100px_100px_80px_80px_60px] items-center gap-3 px-4 py-2 border-b border-primary/20 bg-primary/5">
                <Input value={taskForm.campaign_name} onChange={e => setTaskForm(f => ({ ...f, campaign_name: e.target.value }))} className="h-7 text-xs" />
                <Input value={taskForm.track_or_album} onChange={e => setTaskForm(f => ({ ...f, track_or_album: e.target.value }))} className="h-7 text-xs" />
                <Input value={taskForm.platform} onChange={e => setTaskForm(f => ({ ...f, platform: e.target.value }))} className="h-7 text-xs" />
                <Input type="date" value={taskForm.scheduled_date} onChange={e => setTaskForm(f => ({ ...f, scheduled_date: e.target.value }))} className="h-7 text-xs" />
                <Input value={taskForm.content_type} onChange={e => setTaskForm(f => ({ ...f, content_type: e.target.value }))} className="h-7 text-xs" />
                <Input value={taskForm.status} onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))} className="h-7 text-xs" />
                <div className="flex gap-1">
                  <button onClick={handleUpdateTask} className="text-primary"><Check className="h-4 w-4" /></button>
                  <button onClick={() => setEditingTaskId(null)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                </div>
              </div>
            ) : (
              <div key={pt.id} className="grid grid-cols-[1fr_120px_100px_100px_80px_80px_60px] items-center gap-3 px-4 py-3 border-b border-border/30 group hover:bg-muted/30 transition-colors">
                <div>
                  <span className="text-sm font-semibold">{pt.campaign_name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{pt.track_or_album}</span>
                </div>
                <span className="text-xs">{pt.platform}</span>
                <span className="text-xs tabular-nums">{pt.scheduled_date}</span>
                <span className="text-xs">{pt.content_type}</span>
                <span className={`text-xs font-medium ${pt.status === "Scheduled" ? "text-status-scheduled" : "text-muted-foreground"}`}>{pt.status}</span>
                <span></span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingTaskId(pt.id); setTaskForm({ campaign_name: pt.campaign_name, track_or_album: pt.track_or_album, platform: pt.platform, scheduled_date: pt.scheduled_date, content_type: pt.content_type, status: pt.status }); }} className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Delete campaign?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePromoTask.mutate(pt.id, { onSuccess: () => toast.success("Deleted") })} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )
          ))}
        </div>

        {completedTasks.length > 0 && (
          <div className="rounded-xl bg-card shadow-studio overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50">
              <h3 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Completed ({completedTasks.length})</h3>
            </div>
            {completedTasks.map((pt) => (
              <div key={pt.id} className="grid grid-cols-[1fr_120px_100px_100px_80px] items-center gap-4 px-4 py-3 border-b border-border/30 opacity-60">
                <div>
                  <span className="text-sm font-medium">{pt.campaign_name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{pt.track_or_album}</span>
                </div>
                <span className="text-xs">{pt.platform}</span>
                <span className="text-xs tabular-nums">{pt.scheduled_date}</span>
                <span className="text-xs">{pt.content_type}</span>
                <span className="text-xs font-medium text-right text-status-ready">Done</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
