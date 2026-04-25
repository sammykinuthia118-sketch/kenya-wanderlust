import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, ToggleLeft, ToggleRight, Upload, Trash2, Hotel } from "lucide-react";
import { toast } from "sonner";

const empty = {
  name: "", slug: "", partner_hotel: "", description: "", location: "",
  destination_id: "", image_url: "", price_per_night: 0, currency: "USD",
  amenities: "", room_types: "", rating: 0, category: "hotel",
  is_active: true, is_featured: false,
};

const AdminAccommodations = ({ destinations }: { destinations: any[] }) => {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(empty);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("accommodations" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (a: any) => {
    setEditing(a);
    setForm({
      name: a.name, slug: a.slug, partner_hotel: a.partner_hotel || "",
      description: a.description || "", location: a.location || "",
      destination_id: a.destination_id || "", image_url: a.image_url || "",
      price_per_night: a.price_per_night, currency: a.currency || "USD",
      amenities: (a.amenities || []).join(", "),
      room_types: (a.room_types || []).join(", "),
      rating: a.rating || 0, category: a.category || "hotel",
      is_active: a.is_active, is_featured: a.is_featured,
    });
    setOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `accommodations/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('destination-images').upload(fileName, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('destination-images').getPublicUrl(fileName);
    setForm((f: any) => ({ ...f, image_url: publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    const slug = (form.slug || form.name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!form.name.trim() || !slug) { toast.error("Name is required"); return; }
    const payload: any = {
      name: form.name.trim(), slug,
      partner_hotel: form.partner_hotel, description: form.description,
      location: form.location, image_url: form.image_url || null,
      destination_id: form.destination_id || null,
      price_per_night: Number(form.price_per_night), currency: form.currency,
      amenities: String(form.amenities).split(",").map((s: string) => s.trim()).filter(Boolean),
      room_types: String(form.room_types).split(",").map((s: string) => s.trim()).filter(Boolean),
      rating: Number(form.rating), category: form.category,
      is_active: form.is_active, is_featured: form.is_featured,
    };
    const { error } = editing
      ? await supabase.from("accommodations" as any).update(payload).eq("id", editing.id)
      : await supabase.from("accommodations" as any).insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Accommodation updated" : "Accommodation added");
    setOpen(false);
    fetchData();
  };

  const toggleActive = async (a: any) => {
    const { error } = await supabase.from("accommodations" as any).update({ is_active: !a.is_active }).eq("id", a.id);
    if (error) toast.error(error.message);
    else { toast.success(a.is_active ? "Hidden" : "Activated"); fetchData(); }
  };

  const remove = async (a: any) => {
    if (!confirm(`Delete "${a.name}"?`)) return;
    const { error } = await supabase.from("accommodations" as any).delete().eq("id", a.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); fetchData(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{items.length} accommodations</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-safari" onClick={openNew}>
              <Plus className="h-4 w-4 mr-1" /> Add Accommodation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? "Edit" : "New"} Accommodation</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Hotel / Lodge Name</Label>
                  <Input value={form.name} onChange={e => {
                    const name = e.target.value;
                    const auto = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setForm((f: any) => ({ ...f, name, slug: editing ? f.slug : auto }));
                  }} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={e => setForm((f: any) => ({ ...f, slug: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Partner Hotel / Operator</Label>
                <Input value={form.partner_hotel} onChange={e => setForm((f: any) => ({ ...f, partner_hotel: e.target.value }))} placeholder="e.g. Serena Hotels & Resorts" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm((f: any) => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="lodge">Safari Lodge</SelectItem>
                      <SelectItem value="resort">Beach Resort</SelectItem>
                      <SelectItem value="camp">Tented Camp</SelectItem>
                      <SelectItem value="boutique">Boutique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={form.location} onChange={e => setForm((f: any) => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Linked Destination (optional)</Label>
                <Select value={form.destination_id || "none"} onValueChange={v => setForm((f: any) => ({ ...f, destination_id: v === "none" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    {destinations.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Price / night</Label>
                  <Input type="number" value={form.price_per_night} onChange={e => setForm((f: any) => ({ ...f, price_per_night: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select value={form.currency} onValueChange={v => setForm((f: any) => ({ ...f, currency: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="KES">KES</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rating (0-5)</Label>
                  <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm((f: any) => ({ ...f, rating: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <Label>Image</Label>
                {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />}
                <label className="block">
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                  <div className="flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-input bg-background text-sm cursor-pointer hover:bg-muted transition-colors">
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </div>
                </label>
                <Input className="mt-2" value={form.image_url} onChange={e => setForm((f: any) => ({ ...f, image_url: e.target.value }))} placeholder="Or paste image URL..." />
              </div>
              <div>
                <Label>Amenities (comma separated)</Label>
                <Input value={form.amenities} onChange={e => setForm((f: any) => ({ ...f, amenities: e.target.value }))} placeholder="WiFi, Pool, Spa, Restaurant" />
              </div>
              <div>
                <Label>Room Types (comma separated)</Label>
                <Input value={form.room_types} onChange={e => setForm((f: any) => ({ ...f, room_types: e.target.value }))} placeholder="Standard, Deluxe, Suite" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={form.is_featured} onCheckedChange={v => setForm((f: any) => ({ ...f, is_featured: v }))} /> Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={form.is_active} onCheckedChange={v => setForm((f: any) => ({ ...f, is_active: v }))} /> Active
                </label>
              </div>
              <Button className="w-full bg-gradient-safari" onClick={save}>
                {editing ? "Save Changes" : "Add Accommodation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {items.map(a => (
        <div key={a.id} className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-full md:w-24 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
            {a.image_url ? <img src={a.image_url} alt={a.name} className="w-full h-full object-cover" /> :
              <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Hotel className="h-6 w-6" /></div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-card-foreground">{a.name}</p>
              {a.is_featured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-savanna/20 text-savanna font-medium">Featured</span>}
              {!a.is_active && <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive font-medium">Hidden</span>}
            </div>
            {a.partner_hotel && <p className="text-xs text-primary">by {a.partner_hotel}</p>}
            <p className="text-sm text-muted-foreground capitalize">
              {a.category} · {a.location || "Kenya"} · {a.currency} {Number(a.price_per_night).toLocaleString()}/night
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
              <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => toggleActive(a)}>
              {a.is_active ? <ToggleRight className="h-4 w-4 text-accent" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => remove(a)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-center text-muted-foreground py-8">No accommodations yet. Add your first one!</p>}
    </div>
  );
};

export default AdminAccommodations;
