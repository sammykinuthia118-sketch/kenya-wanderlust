import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Calendar, DollarSign, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { destinations, categoryLabels, categoryColors } from "@/data/destinations";
import { useState } from "react";
import { toast } from "sonner";

const DestinationDetail = () => {
  const { slug } = useParams();
  const destination = destinations.find((d) => d.slug === slug);
  const [saved, setSaved] = useState(false);

  if (!destination) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Destination not found</h1>
          <Link to="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(!saved);
    toast(saved ? "Removed from favorites" : "Added to favorites! ❤️");
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <Badge className={`${categoryColors[destination.category]} mb-3`}>
              {categoryLabels[destination.category]}
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-2">
              {destination.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {destination.location}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-savanna text-savanna" /> {destination.rating} ({destination.reviewCount} reviews)
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Best: {destination.bestTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-3 mb-8">
          <Link to="/explore">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Heart className={`mr-2 h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
            {saved ? "Saved" : "Save"}
          </Button>
          <Link to="/booking">
            <Button size="sm" className="bg-gradient-safari">
              <DollarSign className="mr-2 h-4 w-4" /> Book from ${destination.priceFrom}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">{destination.tagline}</h2>
              <p className="text-muted-foreground leading-relaxed">{destination.description}</p>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Activities</h3>
              <div className="grid grid-cols-2 gap-3">
                {destination.activities.map((act) => (
                  <div key={act} className="flex items-center gap-2 text-sm text-card-foreground bg-card border border-border rounded-lg p-3">
                    <Check className="h-4 w-4 text-accent" />
                    {act}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Travel Tips</h3>
              <ul className="space-y-3">
                {destination.travelTips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display text-lg font-bold text-card-foreground mb-2">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Time</span>
                  <span className="font-medium text-card-foreground">{destination.bestTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Starting Price</span>
                  <span className="font-bold text-primary">${destination.priceFrom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium text-card-foreground">{destination.rating}/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
