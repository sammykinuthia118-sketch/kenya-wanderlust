import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DestinationCard from "@/components/DestinationCard";
import { destinations, DestinationCategory, categoryLabels } from "@/data/destinations";

const filters: { key: DestinationCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "safari", label: "Wildlife Safari" },
  { key: "beach", label: "Beach" },
  { key: "cultural", label: "Cultural" },
  { key: "adventure", label: "Adventure" },
];

const Explore = () => {
  const [activeFilter, setActiveFilter] = useState<DestinationCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = destinations.filter((d) => {
    const matchesCategory = activeFilter === "all" || d.category === activeFilter;
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Explore <span className="text-gradient-safari">Kenya</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Discover breathtaking national parks, pristine beaches, vibrant cultures, and thrilling adventures across Kenya.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={activeFilter === f.key ? "default" : "outline"}
                onClick={() => setActiveFilter(f.key)}
                className={activeFilter === f.key ? "bg-gradient-safari" : ""}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest, i) => (
            <DestinationCard key={dest.id} destination={dest} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No destinations found. Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
