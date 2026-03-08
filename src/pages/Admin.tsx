import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { BarChart3, Users, Calendar, Star, Trash2, MapPin, FileText, LayoutDashboard, Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

type Tab = "overview" | "bookings" | "reviews" | "users" | "destinations" | "content";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "bookings", label: "Bookings", icon: Calendar },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "users", label: "Users", icon: Users },
  { key: "destinations", label: "Destinations", icon: MapPin },
  { key: "content", label: "Content", icon: FileText },
];

const CHART_COLORS = ["hsl(24,80%,50%)", "hsl(195,70%,45%)", "hsl(145,40%,40%)", "hsl(38,70%,55%)", "hsl(20,35%,30%)"];

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [dbDestinations, setDbDestinations] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [destDialogOpen, setDestDialogOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<any>(null);
  const [destForm, setDestForm] = useState({
    name: "", slug: "", tagline: "", description: "", category: "safari",
    location: "", price_from: 0, best_time: "", lat: 0, lng: 0,
    activities: "", travel_tips: "", is_featured: false, is_active: true, image_url: "",
  });

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    const [b, r, p, d, c] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("destinations").select("*").order("created_at", { ascending: false }),
      supabase.from("site_content").select("*").order("key"),
    ]);
    if (b.data) setBookings(b.data);
    if (r.data) setReviews(r.data);
    if (p.data) setProfiles(p.data);
    if (d.data) setDbDestinations(d.data);
    if (c.data) setSiteContent(c.data);
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Review deleted"); fetchData(); }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Booking ${status}`); fetchData(); }
  };

  // Destination CRUD
  const openNewDest = () => {
    setEditingDest(null);
    setDestForm({ name: "", slug: "", tagline: "", description: "", category: "safari", location: "", price_from: 0, best_time: "", lat: 0, lng: 0, activities: "", travel_tips: "", is_featured: false, is_active: true, image_url: "" });
    setDestDialogOpen(true);
  };

  const openEditDest = (d: any) => {
    setEditingDest(d);
    setDestForm({
      name: d.name, slug: d.slug, tagline: d.tagline, description: d.description,
      category: d.category, location: d.location, price_from: d.price_from,
      best_time: d.best_time, lat: d.lat, lng: d.lng,
      activities: (d.activities || []).join(", "), travel_tips: (d.travel_tips || []).join(", "),
      is_featured: d.is_featured, is_active: d.is_active, image_url: d.image_url || "",
    });
    setDestDialogOpen(true);
  };

  const saveDest = async () => {
    const payload = {
      name: destForm.name, slug: destForm.slug, tagline: destForm.tagline,
      description: destForm.description, category: destForm.category, location: destForm.location,
      price_from: Number(destForm.price_from), best_time: destForm.best_time,
      lat: Number(destForm.lat), lng: Number(destForm.lng),
      activities: destForm.activities.split(",").map(s => s.trim()).filter(Boolean),
      travel_tips: destForm.travel_tips.split(",").map(s => s.trim()).filter(Boolean),
      is_featured: destForm.is_featured, is_active: destForm.is_active,
      image_url: destForm.image_url || null,
    };
    if (editingDest) {
      const { error } = await supabase.from("destinations").update(payload).eq("id", editingDest.id);
      if (error) return toast.error(error.message);
      toast.success("Destination updated");
    } else {
      const { error } = await supabase.from("destinations").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Destination created");
    }
    setDestDialogOpen(false);
    fetchData();
  };

  const toggleDestActive = async (d: any) => {
    const { error } = await supabase.from("destinations").update({ is_active: !d.is_active }).eq("id", d.id);
    if (error) toast.error(error.message);
    else { toast.success(d.is_active ? "Destination hidden" : "Destination activated"); fetchData(); }
  };

  // Content management
  const updateContent = async (id: string, title: string, body: string) => {
    const { error } = await supabase.from("site_content").update({ title, body }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Content saved"); fetchData(); }
  };

  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const getDestName = (id: string) => dbDestinations.find((d) => d.id === id)?.name || id;

  // Analytics data
  const bookingsByMonth = bookings.reduce((acc: any[], b) => {
    const month = new Date(b.created_at).toLocaleDateString("en", { month: "short", year: "2-digit" });
    const existing = acc.find(a => a.month === month);
    if (existing) { existing.count++; existing.revenue += Number(b.total_price); }
    else acc.push({ month, count: 1, revenue: Number(b.total_price) });
    return acc;
  }, []).reverse();

  const bookingsByDest = bookings.reduce((acc: any[], b) => {
    const name = getDestName(b.destination_id);
    const existing = acc.find(a => a.name === name);
    if (existing) existing.value++;
    else acc.push({ name, value: 1 });
    return acc;
  }, []);

  const bookingsByStatus = bookings.reduce((acc: any[], b) => {
    const existing = acc.find(a => a.name === b.status);
    if (existing) existing.value++;
    else acc.push({ name: b.status, value: 1 });
    return acc;
  }, []);

  const stats = [
    { icon: Calendar, label: "Total Bookings", value: bookings.length, color: "text-primary" },
    { icon: Star, label: "Total Reviews", value: reviews.length, color: "text-savanna" },
    { icon: Users, label: "Total Users", value: profiles.length, color: "text-accent" },
    { icon: BarChart3, label: "Revenue", value: `$${bookings.reduce((s, b) => s + Number(b.total_price), 0).toLocaleString()}`, color: "text-ocean" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-3 space-y-1">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin Panel</p>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.key ? "bg-gradient-safari text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}>
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Admin <span className="text-gradient-safari">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mb-6 text-sm">Manage your SafariKenya platform.</p>

            {/* Mobile tabs */}
            <div className="flex md:hidden gap-1.5 mb-6 overflow-x-auto pb-2">
              {TABS.map(t => (
                <Button key={t.key} variant={tab === t.key ? "default" : "outline"} size="sm"
                  onClick={() => setTab(t.key)} className={tab === t.key ? "bg-gradient-safari shrink-0" : "shrink-0"}>
                  <t.icon className="h-3.5 w-3.5 mr-1" /> {t.label}
                </Button>
              ))}
            </div>

            {/* Overview Tab */}
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map(s => (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-5">
                      <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
                      <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Bookings over time */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-display font-semibold text-card-foreground mb-4">Bookings Over Time</h3>
                    {bookingsByMonth.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={bookingsByMonth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(24,80%,50%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : <p className="text-muted-foreground text-sm text-center py-12">No booking data yet.</p>}
                  </div>

                  {/* Revenue over time */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-display font-semibold text-card-foreground mb-4">Revenue Trend</h3>
                    {bookingsByMonth.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={bookingsByMonth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} />
                          <Line type="monotone" dataKey="revenue" stroke="hsl(145,40%,40%)" strokeWidth={2} dot={{ fill: "hsl(145,40%,40%)" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : <p className="text-muted-foreground text-sm text-center py-12">No revenue data yet.</p>}
                  </div>

                  {/* Popular destinations */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-display font-semibold text-card-foreground mb-4">Popular Destinations</h3>
                    {bookingsByDest.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie data={bookingsByDest} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
                            {bookingsByDest.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : <p className="text-muted-foreground text-sm text-center py-12">No booking data yet.</p>}
                  </div>

                  {/* Booking statuses */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-display font-semibold text-card-foreground mb-4">Booking Status</h3>
                    {bookingsByStatus.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie data={bookingsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {bookingsByStatus.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : <p className="text-muted-foreground text-sm text-center py-12">No booking data yet.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {tab === "bookings" && (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-card-foreground">{b.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {getDestName(b.destination_id)} · {b.tour_type} · {b.num_tourists} tourists
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(b.booking_date).toLocaleDateString()} · ${b.total_price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        b.status === "confirmed" ? "bg-accent/20 text-accent" :
                        b.status === "cancelled" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                      }`}>{b.status}</span>
                      {b.status === "confirmed" && (
                        <Button variant="outline" size="sm" onClick={() => updateBookingStatus(b.id, "cancelled")}>Cancel</Button>
                      )}
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <p className="text-center text-muted-foreground py-8">No bookings yet.</p>}
              </div>
            )}

            {/* Reviews Tab */}
            {tab === "reviews" && (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-card-foreground text-sm">User</span>
                        <span className="text-xs text-muted-foreground">{getDestName(r.destination_id)}</span>
                      </div>
                      <div className="flex gap-0.5 mb-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-savanna text-savanna" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      <p className="font-semibold text-card-foreground text-sm">{r.title}</p>
                      {r.content && <p className="text-sm text-muted-foreground">{r.content}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteReview(r.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-center text-muted-foreground py-8">No reviews yet.</p>}
              </div>
            )}

            {/* Users Tab */}
            {tab === "users" && (
              <div className="space-y-3">
                {profiles.map(p => (
                  <div key={p.id} className="bg-card border border-border rounded-xl p-5">
                    <p className="font-medium text-card-foreground">{p.display_name || "—"}</p>
                    <p className="text-sm text-muted-foreground">Joined {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
                {profiles.length === 0 && <p className="text-center text-muted-foreground py-8">No users yet.</p>}
              </div>
            )}

            {/* Destinations Tab */}
            {tab === "destinations" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{dbDestinations.length} destinations</p>
                  <Dialog open={destDialogOpen} onOpenChange={setDestDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-safari" onClick={openNewDest}>
                        <Plus className="h-4 w-4 mr-1" /> Add Destination
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="font-display">{editingDest ? "Edit" : "New"} Destination</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label>Name</Label><Input value={destForm.name} onChange={e => setDestForm(f => ({ ...f, name: e.target.value }))} /></div>
                          <div><Label>Slug</Label><Input value={destForm.slug} onChange={e => setDestForm(f => ({ ...f, slug: e.target.value }))} /></div>
                        </div>
                        <div><Label>Tagline</Label><Input value={destForm.tagline} onChange={e => setDestForm(f => ({ ...f, tagline: e.target.value }))} /></div>
                        <div><Label>Description</Label><Textarea value={destForm.description} onChange={e => setDestForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Category</Label>
                            <Select value={destForm.category} onValueChange={v => setDestForm(f => ({ ...f, category: v }))}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="safari">Safari</SelectItem>
                                <SelectItem value="beach">Beach</SelectItem>
                                <SelectItem value="cultural">Cultural</SelectItem>
                                <SelectItem value="adventure">Adventure</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div><Label>Location</Label><Input value={destForm.location} onChange={e => setDestForm(f => ({ ...f, location: e.target.value }))} /></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div><Label>Price From ($)</Label><Input type="number" value={destForm.price_from} onChange={e => setDestForm(f => ({ ...f, price_from: Number(e.target.value) }))} /></div>
                          <div><Label>Latitude</Label><Input type="number" step="any" value={destForm.lat} onChange={e => setDestForm(f => ({ ...f, lat: Number(e.target.value) }))} /></div>
                          <div><Label>Longitude</Label><Input type="number" step="any" value={destForm.lng} onChange={e => setDestForm(f => ({ ...f, lng: Number(e.target.value) }))} /></div>
                        </div>
                        <div><Label>Best Time</Label><Input value={destForm.best_time} onChange={e => setDestForm(f => ({ ...f, best_time: e.target.value }))} /></div>
                        <div><Label>Image URL</Label><Input value={destForm.image_url} onChange={e => setDestForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." /></div>
                        <div><Label>Activities (comma separated)</Label><Input value={destForm.activities} onChange={e => setDestForm(f => ({ ...f, activities: e.target.value }))} /></div>
                        <div><Label>Travel Tips (comma separated)</Label><Input value={destForm.travel_tips} onChange={e => setDestForm(f => ({ ...f, travel_tips: e.target.value }))} /></div>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-sm">
                            <Switch checked={destForm.is_featured} onCheckedChange={v => setDestForm(f => ({ ...f, is_featured: v }))} /> Featured
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Switch checked={destForm.is_active} onCheckedChange={v => setDestForm(f => ({ ...f, is_active: v }))} /> Active
                          </label>
                        </div>
                        <Button className="w-full bg-gradient-safari" onClick={saveDest}>
                          {editingDest ? "Save Changes" : "Create Destination"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {dbDestinations.map(d => (
                  <div key={d.id} className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-card-foreground">{d.name}</p>
                        {d.is_featured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-savanna/20 text-savanna font-medium">Featured</span>}
                        {!d.is_active && <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive font-medium">Hidden</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{d.category} · {d.location} · From ${d.price_from}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDest(d)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleDestActive(d)}>
                        {d.is_active ? <ToggleRight className="h-4 w-4 text-accent" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </div>
                ))}
                {dbDestinations.length === 0 && <p className="text-center text-muted-foreground py-8">No destinations in database yet.</p>}
              </div>
            )}

            {/* Content Tab */}
            {tab === "content" && (
              <div className="space-y-6">
                {siteContent.map(c => (
                  <ContentEditor key={c.id} content={c} onSave={updateContent} />
                ))}
                {siteContent.length === 0 && <p className="text-center text-muted-foreground py-8">No content entries yet.</p>}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const ContentEditor = ({ content, onSave }: { content: any; onSave: (id: string, title: string, body: string) => void }) => {
  const [title, setTitle] = useState(content.title);
  const [body, setBody] = useState(content.body);
  const dirty = title !== content.title || body !== content.body;

  const keyLabels: Record<string, string> = {
    hero_heading: "🏠 Hero Section",
    cta_heading: "📣 Call to Action Section",
    announcement: "📢 Announcement Banner",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <p className="font-display font-semibold text-card-foreground">{keyLabels[content.key] || content.key}</p>
      <div>
        <Label>Title / Heading</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <Label>Body / Description</Label>
        <Textarea value={body} onChange={e => setBody(e.target.value)} rows={3} />
      </div>
      {dirty && (
        <Button size="sm" className="bg-gradient-safari" onClick={() => onSave(content.id, title, body)}>
          Save Changes
        </Button>
      )}
    </div>
  );
};

export default Admin;
