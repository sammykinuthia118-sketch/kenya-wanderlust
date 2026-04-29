import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Calendar, Users, BedDouble, CheckCircle, MapPin, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AccommodationBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preselect = params.get("accommodation");

  const [items, setItems] = useState<any[]>([]);
  const [accommodationId, setAccommodationId] = useState(preselect || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [rooms, setRooms] = useState("1");
  const [roomType, setRoomType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requests, setRequests] = useState("");
  const [booked, setBooked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Book a Stay | SafariKenya";
    (async () => {
      const { data } = await supabase
        .from("accommodations" as any)
        .select("*")
        .eq("is_active", true)
        .order("name");
      setItems(data || []);
    })();
  }, []);

  const selected = items.find((a) => a.id === accommodationId);
  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const d = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
    return d > 0 ? d : 0;
  })();
  const totalPrice = selected ? Math.round(Number(selected.price_per_night) * nights * Number(rooms || 1)) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book a stay");
      navigate("/auth");
      return;
    }
    if (!accommodationId || !checkIn || !checkOut || !name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (nights <= 0) {
      toast.error("Check-out must be after check-in");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("accommodation_bookings" as any).insert({
      user_id: user.id,
      accommodation_id: accommodationId,
      full_name: name,
      email,
      phone: phone || null,
      check_in: checkIn,
      check_out: checkOut,
      num_guests: parseInt(guests) || 1,
      num_rooms: parseInt(rooms) || 1,
      room_type: roomType || null,
      total_price: totalPrice,
      currency: selected?.currency || "USD",
      special_requests: requests || null,
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }
    setBooked(true);
    setSubmitting(false);
    toast.success("Stay booked! 🏨");
  };

  if (booked && selected) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-accent-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Stay Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Your booking at <strong>{selected.name}</strong> is confirmed.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {checkIn} → {checkOut} · {nights} night{nights > 1 ? "s" : ""} · {selected.currency} {totalPrice.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email will be sent to {email}.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setBooked(false); }} variant="outline">Book Another Stay</Button>
            <Link to="/accommodations"><Button className="bg-gradient-safari">Browse Stays</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Hotel className="h-3.5 w-3.5" /> Accommodation Booking
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Book a <span className="text-gradient-safari">Stay</span>
          </h1>
          <p className="text-muted-foreground mt-3">
            Reserve your room at our partnering hotels, lodges, and camps.
          </p>
        </div>

        {!user && (
          <div className="bg-secondary border border-border rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              <Link to="/auth" className="text-primary font-medium hover:underline">Sign in</Link> to confirm your accommodation booking.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Accommodation</label>
            <Select value={accommodationId} onValueChange={(v) => { setAccommodationId(v); setRoomType(""); }}>
              <SelectTrigger><SelectValue placeholder="Choose an accommodation" /></SelectTrigger>
              <SelectContent>
                {items.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} — {a.currency} {Number(a.price_per_night).toLocaleString()}/night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selected && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {selected.location} · {selected.partner_hotel || selected.category}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Check-in
              </label>
              <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Check-out
              </label>
              <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> Guests
              </label>
              <Input type="number" min="1" max="20" value={guests} onChange={(e) => setGuests(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" /> Rooms
              </label>
              <Input type="number" min="1" max="10" value={rooms} onChange={(e) => setRooms(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Room Type</label>
              {selected && Array.isArray(selected.room_types) && selected.room_types.length > 0 ? (
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {selected.room_types.map((rt: string) => (
                      <SelectItem key={rt} value={rt}>{rt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input placeholder="Standard" value={roomType} onChange={(e) => setRoomType(e.target.value)} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Phone (optional)</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 ..." />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Special Requests (optional)</label>
            <Textarea value={requests} onChange={(e) => setRequests(e.target.value)} placeholder="Late check-in, dietary needs, etc." rows={3} />
          </div>

          {selected && nights > 0 && (
            <div className="bg-secondary rounded-lg p-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {nights} night{nights > 1 ? "s" : ""} × {rooms} room{Number(rooms) > 1 ? "s" : ""} @ {selected.currency} {Number(selected.price_per_night).toLocaleString()}/night
              </div>
              <div className="text-2xl font-bold text-primary">
                {selected.currency} {totalPrice.toLocaleString()}
              </div>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full bg-gradient-safari h-12 text-lg" disabled={submitting}>
            {submitting ? "Processing..." : "Confirm Stay Booking"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AccommodationBooking;
