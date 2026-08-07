import { useTracks, useReleases, usePromoTasks, useDistributors, useSocialLinks, useUpdateSocialLink } from "@/hooks/useDatabase";
import { StatusBadge } from "@/components/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2, Instagram, Youtube, Music2, ExternalLink, Check, Pencil } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const socialIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  twitter: <span className="text-sm font-bold">𝕏</span>,
  youtube: <Youtube className="h-4 w-4" />,
  tiktok: <Music2 className="h-4 w-4" />,
  spotify: <Music2 className="h-4 w-4" />,
  soundcloud: <Music2 className="h-4 w-4" />,
};

export default function DashboardPage() {
  const { data: tracks = [], isLoading: lt } = useTracks();
  const { data: releases = [], isLoading: lr } = useReleases();
  const { data: promoTasks = [], isLoading: lp } = usePromoTasks();
  const { data: distributors = [], isLoading: ld } = useDistributors();
  const { data: socialLinks = [], isLoading: ls } = useSocialLinks();
  const updateSocialLink = useUpdateSocialLink();
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");

  if (lt || lr || lp || ld || ls) {
    return <div className="p-6 flex items-center justify-center min-h-[400px]"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const statusCounts = releases.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const statusColors: Record<string, string> = {
    Draft: "hsl(215, 16%, 47%)",
    Scheduled: "hsl(199, 89%, 48%)",
    Submitted: "hsl(38, 92%, 50%)",
    Ready: "hsl(142, 71%, 45%)",
    Released: "hsl(262, 83%, 58%)",
  };

  const pieData = barData.map((d) => ({ ...d, color: statusColors[d.name] || "#999" }));
  const pendingPromo = promoTasks.filter((t) => t.status !== "Completed");

  const upcomingReleases = releases
    .filter((r) => r.status !== "Released")
    .sort((a, b) => a.planned_release_date.localeCompare(b.planned_release_date))
    .slice(0, 5);

  const handleSaveSocialLink = (id: string) => {
    updateSocialLink.mutate({ id, url: editUrl }, {
      onSuccess: () => { toast.success("Link saved"); setEditingLink(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="p-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold tracking-tighter mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground mb-6">Distribution Tracker & Overview</p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Tracks", value: tracks.length },
              { label: "Releases", value: releases.length },
              { label: "Active Distributors", value: distributors.filter((d) => d.distribution_status === "Active").length },
              { label: "Pending Promos", value: pendingPromo.length },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-card shadow-studio p-4">
                <div className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">{stat.label}</div>
                <div className="text-3xl font-semibold tabular-nums mt-1">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl bg-card shadow-studio p-4">
              <h2 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-4">Releases by Status</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {barData.map((entry) => (<Cell key={entry.name} fill={statusColors[entry.name] || "#999"} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl bg-card shadow-studio p-4">
              <h2 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-4">Status Distribution</h2>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                      {pieData.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-3 justify-center mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[10px] text-muted-foreground">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-card shadow-studio overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50">
                <h2 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Upcoming Releases</h2>
              </div>
              {upcomingReleases.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No upcoming releases.</div>
              ) : upcomingReleases.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                  <div>
                    <span className="text-sm font-medium">{r.title}</span>
                    <span className="text-xs text-muted-foreground ml-2 tabular-nums">{r.planned_release_date}</span>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-card shadow-studio overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50">
                <h2 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Pending Promotional Tasks</h2>
              </div>
              {pendingPromo.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No pending promos.</div>
              ) : pendingPromo.map((pt) => (
                <div key={pt.id} className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                  <div>
                    <span className="text-sm font-medium">{pt.campaign_name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{pt.platform}</span>
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">{pt.scheduled_date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent tracks - clickable */}
          <div className="rounded-xl bg-card shadow-studio overflow-hidden mt-4">
            <div className="px-4 py-3 border-b border-border/50">
              <h2 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Recent Tracks</h2>
            </div>
            {tracks.slice(0, 8).map((t) => (
              <Link to={`/tracks/${t.id}`} key={t.id} className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <Music2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium truncate block">{t.title}</span>
                    <span className="text-xs text-muted-foreground">{t.artist}</span>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </Link>
            ))}
            {tracks.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No tracks yet.</div>}
          </div>
        </div>

        {/* Social Links Sidebar */}
        <div className="w-[200px] shrink-0">
          <div className="rounded-xl bg-card shadow-studio p-4 sticky top-4">
            <h2 className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground mb-3">Social Networks</h2>
            <div className="space-y-2">
              {socialLinks.map((link) => (
                <div key={link.id} className="group">
                  {editingLink === link.id ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {socialIcons[link.icon] || <ExternalLink className="h-4 w-4" />}
                        <span className="text-xs font-medium">{link.platform}</span>
                      </div>
                      <Input
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="https://..."
                        className="h-7 text-xs"
                        autoFocus
                        aria-label={`${link.platform} profile URL`}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveSocialLink(link.id)}
                      />
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => setEditingLink(null)}>Cancel</Button>
                        <Button size="sm" className="h-6 text-[10px] px-2" onClick={() => handleSaveSocialLink(link.id)} aria-label="Save social link">
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-1">
                      {link.url ? (
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                          {socialIcons[link.icon] || <ExternalLink className="h-4 w-4" />}
                          <span className="text-xs font-medium truncate">{link.platform}</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {socialIcons[link.icon] || <ExternalLink className="h-4 w-4" />}
                          <span className="text-xs truncate">{link.platform}</span>
                        </div>
                      )}
                      <button
                        onClick={() => { setEditingLink(link.id); setEditUrl(link.url || ""); }}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        aria-label={`Edit ${link.platform} link`}
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
