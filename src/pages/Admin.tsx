import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { BarChart3, Users, Calendar, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { destinations } from "@/data/destinations";
import { toast } from "sonner";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [tab, setTab] = useState<"bookings" | "reviews" | "users">("bookings");

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    const [b, r, p] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("reviews").select("*, profiles(display_name)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);
    if (b.data) setBookings(b.data);
    if (r.data) setReviews(r.data);
    if (p.data) setProfiles(p.data);
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

  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const getDestName = (id: string) => destinations.find((d) => d.id === id)?.name || id;

  const stats = [
    { icon: Calendar, label: "Total Bookings", value: bookings.length, color: "text-primary" },
    { icon: Star, label: "Total Reviews", value: reviews.length, color: "text-savanna" },
    { icon: Users, label: "Total Users", value: profiles.length, color: "text-accent" },
    { icon: BarChart3, label: "Revenue", value: `$${bookings.reduce((s, b) => s + Number(b.total_price), 0).toLocaleString()}`, color: "text-ocean" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Admin <span className="text-gradient-safari">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mb-8">Manage bookings, reviews, and users.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
              <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["bookings", "reviews", "users"] as const).map((t) => (
            <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" onClick={() => setTab(t)}
              className={tab === t ? "bg-gradient-safari" : ""}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <div className="space-y-3">
            {bookings.map((b) => (
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
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-card-foreground text-sm">{(r.profiles as any)?.display_name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{getDestName(r.destination_id)}</span>
                  </div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map((s) => (
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
            {profiles.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-xl p-5">
                <p className="font-medium text-card-foreground">{p.display_name || "—"}</p>
                <p className="text-sm text-muted-foreground">Joined {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
