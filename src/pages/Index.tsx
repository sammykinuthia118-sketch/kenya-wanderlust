import { Link } from "react-router-dom";
import { Search, ArrowRight, Compass, Mountain, Waves, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DestinationCard from "@/components/DestinationCard";
import { destinations } from "@/data/destinations";
import heroImage from "@/assets/hero-savanna.jpg";

const categories = [
  { icon: Compass, label: "Wildlife Safari", count: 3 },
  { icon: Waves, label: "Beach Tourism", count: 1 },
  { icon: Users, label: "Cultural Tourism", count: 2 },
  { icon: Mountain, label: "Adventure Tourism", count: 1 },
];

const Index = () => {
  const [search, setSearch] = useState("");
  const featured = destinations.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Kenya Savanna at sunset with elephants"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/70" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-4 animate-fade-up">
            Discover the Magic of <span className="text-savanna">Kenya</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-fade-up font-body" style={{ animationDelay: "200ms" }}>
            From the vast savannas of Maasai Mara to the pristine beaches of Diani. 
            Your unforgettable African adventure starts here.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "400ms" }}>
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background/90 backdrop-blur-sm border-border h-12"
              />
            </div>
            <Link to="/explore">
              <Button size="lg" className="h-12 px-6 bg-gradient-safari hover:opacity-90">
                Explore <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Explore by Category
            </h2>
            <p className="text-muted-foreground mt-2">Choose your perfect Kenyan experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.label}
                to="/explore"
                className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border hover:border-primary hover:shadow-lg transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-safari flex items-center justify-center group-hover:scale-110 transition-transform">
                  <cat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-display font-semibold text-card-foreground text-center text-sm">{cat.label}</span>
                <span className="text-xs text-muted-foreground">{cat.count} destinations</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Featured Destinations
              </h2>
              <p className="text-muted-foreground mt-2">Handpicked experiences you'll love</p>
            </div>
            <Link to="/explore" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/explore">
              <Button variant="outline">View All Destinations</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-safari">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready for Your Kenyan Adventure?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Plan your dream safari, beach getaway, or cultural expedition. Let us help you create memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/trip-planner">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Plan Your Trip
              </Button>
            </Link>
            <Link to="/booking">
              <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Book a Tour
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
