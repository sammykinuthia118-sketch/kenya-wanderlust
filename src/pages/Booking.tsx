import { useState } from "react";
import { Calendar, Users, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDestinations } from "@/hooks/useDestinations";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const tourTypes = [
  { value: "safari", label: "Safari Tour", multiplier: 1.5 },
  { value: "beach", label: "Beach Package", multiplier: 1.2 },
  { value: "cultural", label: "Cultural Tour", multiplier: 1.0 },
  { value: "adventure", label: "Adventure Package", multiplier: 1.8 },
];

const Booking = () => {
  const { user } = useAuth();
  const { data: destinations = [] } = useDestinations();
  const [destinationId, setDestinationId] = useState("");
  const [tourType, setTourType] = useState("");
  const [date, setDate] = useState("");
  const [tourists, setTourists] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [booked, setBooked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dest = destinations.find((d) => d.id === destinationId);
  const tour = tourTypes.find((t) => t.value === tourType);
  const numTourists = parseInt(tourists) || 1;
  const basePrice = dest?.price_from || 0;
  const totalPrice = Math.round(basePrice * (tour?.multiplier || 1) * numTourists);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationId || !tourType || !date || !name || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    if (user) {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        destination_id: destinationId,
        tour_type: tourType,
        booking_date: date,
        num_tourists: numTourists,
        total_price: totalPrice,
        full_name: name,
        email,
      });
      if (error) {
        toast.error(error.message);
        setSubmitting(false);
        return;
      }
    }

    setBooked(true);
    setSubmitting(false);
    toast.success("Booking confirmed! 🎉");
  };

  if (booked) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-accent-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Your {tour?.label} to <strong>{dest?.name}</strong> has been booked.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Date: {date} · {numTourists} tourist{numTourists > 1 ? "s" : ""} · Total: ${totalPrice}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email will be sent to {email}.
          </p>
          <Button onClick={() => setBooked(false)} className="bg-gradient-safari">
            Book Another Tour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Book a <span className="text-gradient-safari">Tour</span>
          </h1>
          <p className="text-muted-foreground mt-3">
            Reserve your unforgettable Kenyan experience today.
          </p>
        </div>

        {!user && (
          <div className="bg-secondary border border-border rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              <Link to="/auth" className="text-primary font-medium hover:underline">Sign in</Link> to save your booking to your account.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@email.com" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Destination</label>
            <Select value={destinationId} onValueChange={setDestinationId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Tour Type</label>
              <Select value={tourType} onValueChange={setTourType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {tourTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Date
              </label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> Tourists
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                value={tourists}
                onChange={(e) => setTourists(e.target.value)}
              />
            </div>
          </div>

          {dest && tour && (
            <div className="bg-secondary rounded-lg p-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Price estimate for {numTourists} tourist{numTourists > 1 ? "s" : ""}
              </div>
              <div className="text-2xl font-bold text-primary">${totalPrice}</div>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full bg-gradient-safari h-12 text-lg" disabled={submitting}>
            {submitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
