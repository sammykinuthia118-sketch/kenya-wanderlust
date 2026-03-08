import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { DBDestination, categoryLabels, categoryColors, resolveImage } from "@/hooks/useDestinations";
import { Badge } from "./ui/badge";

interface DestinationCardProps {
  destination: DBDestination;
  index?: number;
}

const DestinationCard = ({ destination, index = 0 }: DestinationCardProps) => {
  return (
    <Link
      to={`/destination/${destination.slug}`}
      className="group block rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={resolveImage(destination.image_url)}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${categoryColors[destination.category] || ""} text-xs font-medium`}>
            {categoryLabels[destination.category] || destination.category}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent h-20" />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {destination.name}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
          <MapPin className="h-3.5 w-3.5" />
          {destination.location}
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{destination.tagline}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            {destination.is_featured && (
              <>
                <Star className="h-4 w-4 fill-savanna text-savanna" />
                <span className="text-xs text-muted-foreground">Featured</span>
              </>
            )}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">from </span>
            <span className="font-bold text-primary">${destination.price_from}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
