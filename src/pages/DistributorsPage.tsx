import { useState } from "react";
import { useDistributors, useCreateDistributor, useUpdateDistributor, useDeleteDistributor } from "@/hooks/useDatabase";
import { Truck, Plus, Loader2, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function DistributorsPage() {
  const { data: distributors = [], isLoading } = useDistributors();
  const createDistributor = useCreateDistributor();
  const updateDistributor = useUpdateDistributor();
  const deleteDistributor = useDeleteDistributor();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", contact_email: "", submission_format: "", delivery_method: "", notes: "", distribution_status: "Active" });

  if (isLoading) {
    return <div className="p-6 flex items-center justify-center min-h-[400px]"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const handleAdd = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    createDistributor.mutate(form, {
      onSuccess: () => { toast.success("Distributor added"); setAdding(false); setForm({ name: "", contact_email: "", submission_format: "", delivery_method: "", notes: "", distribution_status: "Active" }); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    updateDistributor.mutate({ id: editingId, ...form }, {
      onSuccess: () => { toast.success("Updated"); setEditingId(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const startEdit = (d: typeof distributors[0]) => {
    setEditingId(d.id);
    setForm({ name: d.name, contact_email: d.contact_email, submission_format: d.submission_format, delivery_method: d.delivery_method, notes: d.notes, distribution_status: d.distribution_status });
  };

  const handleDelete = (id: string, name: string) => {
    deleteDistributor.mutate(id, {
      onSuccess: () => toast.success(`"${name}" deleted`),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tighter">Distribution</h1>
          <p className="text-sm text-muted-foreground mt-1">{distributors.length} distributors</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => { setAdding(true); setForm({ name: "", contact_email: "", submission_format: "", delivery_method: "", notes: "", distribution_status: "Active" }); }}>
          <Plus className="h-3.5 w-3.5" />Add Distributor
        </Button>
      </div>

      <div className="rounded-xl bg-card shadow-studio overflow-hidden">
        <div className="grid grid-cols-[1fr_160px_120px_120px_1fr_80px_60px] items-center gap-3 px-4 py-2.5 border-b border-border/50 text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">
          <span>Name</span><span>Email</span><span>Format</span><span>Delivery</span><span>Notes</span><span className="text-right">Status</span><span></span>
        </div>

        {adding && (
          <div className="grid grid-cols-[1fr_160px_120px_120px_1fr_80px_60px] items-center gap-3 px-4 py-2 border-b border-primary/20 bg-primary/5">
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="h-7 text-xs" />
            <Input value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="Email" className="h-7 text-xs" />
            <Input value={form.submission_format} onChange={e => setForm(f => ({ ...f, submission_format: e.target.value }))} placeholder="Format" className="h-7 text-xs" />
            <Input value={form.delivery_method} onChange={e => setForm(f => ({ ...f, delivery_method: e.target.value }))} placeholder="Delivery" className="h-7 text-xs" />
            <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes" className="h-7 text-xs" />
            <Select value={form.distribution_status} onValueChange={v => setForm(f => ({ ...f, distribution_status: v }))}>
              <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <button onClick={handleAdd} className="text-primary hover:text-primary/80"><Check className="h-4 w-4" /></button>
              <button onClick={() => setAdding(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
          </div>
        )}

        {distributors.map((d) => (
          editingId === d.id ? (
            <div key={d.id} className="grid grid-cols-[1fr_160px_120px_120px_1fr_80px_60px] items-center gap-3 px-4 py-2 border-b border-primary/20 bg-primary/5">
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-7 text-xs" />
              <Input value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} className="h-7 text-xs" />
              <Input value={form.submission_format} onChange={e => setForm(f => ({ ...f, submission_format: e.target.value }))} className="h-7 text-xs" />
              <Input value={form.delivery_method} onChange={e => setForm(f => ({ ...f, delivery_method: e.target.value }))} className="h-7 text-xs" />
              <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="h-7 text-xs" />
              <Select value={form.distribution_status} onValueChange={v => setForm(f => ({ ...f, distribution_status: v }))}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <button onClick={handleUpdate} className="text-primary hover:text-primary/80"><Check className="h-4 w-4" /></button>
                <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
            </div>
          ) : (
            <div key={d.id} className="grid grid-cols-[1fr_160px_120px_120px_1fr_80px_60px] items-center gap-3 px-4 py-3 border-b border-border/30 group hover:bg-muted/30 transition-colors">
              <span className="text-sm font-semibold">{d.name}</span>
              <span className="text-xs text-muted-foreground truncate">{d.contact_email}</span>
              <span className="text-xs">{d.submission_format}</span>
              <span className="text-xs">{d.delivery_method}</span>
              <span className="text-xs text-muted-foreground truncate">{d.notes}</span>
              <span className={`text-xs font-medium text-right ${d.distribution_status === "Active" ? "text-status-ready" : "text-muted-foreground"}`}>{d.distribution_status}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(d)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{d.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(d.id, d.name)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )
        ))}
        {distributors.length === 0 && !adding && <div className="py-8 text-center text-sm text-muted-foreground">No distributors yet.</div>}
      </div>
    </div>
  );
}
