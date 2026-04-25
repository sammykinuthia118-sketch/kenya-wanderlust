import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, BedDouble, Wifi, Search, Hotel } from "lucide-react";

const Accommodations = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("featured");

  useEffect(() => {
    document.title = "Accommodations & Pricing | SafariKenya";
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from("accommodations" as any)
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const filtered = items
    .filter(i =>
      (category === "all" || i.category === category) &&
      (search === "" ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.location.toLowerCase().includes(search.toLowerCase()) ||
        i.partner_hotel?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === "price-asc") return Number(a.price_per_night) - Number(b.price_per_night);
      if (sort === "price-desc") return Number(b.price_per_night) - Number(a.price_per_night);
      if (sort === "rating") return Number(b.rating) - Number(a.rating);
      return 0;
    });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Hotel className="h-3.5 w-3.5" /> Partner Hotels & Lodges
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Accommodations & <span className="text-gradient-safari">Pricing</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore handpicked stays from our partnering hotels, lodges, and camps across Kenya — with transparent nightly rates.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hotels, locations, partners..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="md:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="lodge">Safari Lodge</SelectItem>
              <SelectItem value="resort">Beach Resort</SelectItem>
              <SelectItem value="camp">Tented Camp</SelectItem>
              <SelectItem value="boutique">Boutique</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="md:w-48"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured first</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center text-muted-foreground py-16">Loading accommodations…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <BedDouble className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-display text-lg text-foreground">No accommodations match your filters</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(a => (
              <article
                key={a.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {a.image_url ? (
                    <img
                      src={a.image_url}
                      alt={a.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Hotel className="h-10 w-10" />
                    </div>
                  )}
                  {a.is_featured && (
                    <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-savanna text-foreground font-semibold uppercase tracking-wide">
                      Featured
                    </span>
                  )}
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-background/90 text-foreground font-medium capitalize">
                    {a.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  {a.partner_hotel && (
                    <p className="text-xs text-primary font-medium mb-1">by {a.partner_hotel}</p>
                  )}
                  <h2 className="font-display text-lg font-bold text-card-foreground leading-tight">
                    {a.name}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {a.location || "Kenya"}
                  </p>
                  {a.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <Star className="h-3.5 w-3.5 fill-savanna text-savanna" />
                      <span className="font-medium text-card-foreground">{Number(a.rating).toFixed(1)}</span>
                    </div>
                  )}
                  {a.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.description}</p>
                  )}
                  {Array.isArray(a.amenities) && a.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {a.amenities.slice(0, 3).map((am: string) => (
                        <span key={am} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {am}
                        </span>
                      ))}
                      {a.amenities.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          +{a.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <div className="mt-auto pt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-display text-2xl font-bold text-primary leading-none">
                        {a.currency || "USD"} {Number(a.price_per_night).toLocaleString()}
                        <span className="text-xs text-muted-foreground font-normal ml-1">/ night</span>
                      </p>
                    </div>
                    <Link to="/booking">
                      <Button size="sm" className="bg-gradient-safari">Book</Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accommodations;
