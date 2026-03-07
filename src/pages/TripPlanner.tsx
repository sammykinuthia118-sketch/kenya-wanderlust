import { useState } from "react";
import { Plus, Trash2, GripVertical, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { destinations } from "@/data/destinations";
import { toast } from "sonner";

interface TripDay {
  id: string;
  day: number;
  destinationId: string;
  notes: string;
}

const TripPlanner = () => {
  const [tripName, setTripName] = useState("My Kenya Adventure");
  const [days, setDays] = useState<TripDay[]>([
    { id: "1", day: 1, destinationId: "7", notes: "Nairobi city tour and Giraffe Centre" },
    { id: "2", day: 2, destinationId: "1", notes: "Full day safari in Maasai Mara" },
    { id: "3", day: 3, destinationId: "2", notes: "Beach relaxation in Diani" },
  ]);

  const addDay = () => {
    const newDay: TripDay = {
      id: Date.now().toString(),
      day: days.length + 1,
      destinationId: "",
      notes: "",
    };
    setDays([...days, newDay]);
  };

  const removeDay = (id: string) => {
    setDays(days.filter((d) => d.id !== id).map((d, i) => ({ ...d, day: i + 1 })));
  };

  const updateDay = (id: string, field: keyof TripDay, value: string) => {
    setDays(days.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const savePlan = () => {
    localStorage.setItem("kenyaTripPlan", JSON.stringify({ name: tripName, days }));
    toast.success("Trip plan saved! 🎉");
  };

  const totalCost = days.reduce((sum, d) => {
    const dest = destinations.find((dest) => dest.id === d.destinationId);
    return sum + (dest?.priceFrom || 0);
  }, 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Trip <span className="text-gradient-safari">Planner</span>
          </h1>
          <p className="text-muted-foreground mt-3">
            Build your perfect Kenyan itinerary day by day.
          </p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">Trip Name</label>
          <Input
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="text-lg font-display"
          />
        </div>

        <div className="space-y-4">
          {days.map((day) => {
            const dest = destinations.find((d) => d.id === day.destinationId);
            return (
              <div
                key={day.id}
                className="bg-card border border-border rounded-xl p-5 animate-scale-in"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-safari flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {day.day}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-card-foreground flex-1">
                    Day {day.day}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => removeDay(day.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Destination</label>
                    <Select
                      value={day.destinationId}
                      onValueChange={(v) => updateDay(day.id, "destinationId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Notes</label>
                    <Input
                      value={day.notes}
                      onChange={(e) => updateDay(day.id, "notes", e.target.value)}
                      placeholder="What will you do?"
                    />
                  </div>
                </div>

                {dest && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {dest.location} · From ${dest.priceFrom}/person
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <Button variant="outline" onClick={addDay} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Day
          </Button>
          <Button onClick={savePlan} className="w-full sm:w-auto bg-gradient-safari">
            Save Trip Plan
          </Button>
          <div className="ml-auto text-sm text-muted-foreground">
            Estimated total: <span className="font-bold text-primary text-lg">${totalCost}</span>/person
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
