import { MapPin } from "lucide-react";

interface DestinationMapProps {
  lat: number;
  lng: number;
  name: string;
  location: string;
}

const DestinationMap = ({ lat, lng, name, location }: DestinationMapProps) => {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.5},${lat - 0.3},${lng + 0.5},${lat + 0.3}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <div className="h-[300px]">
        <iframe
          title={`Map of ${name}`}
          src={mapUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-3 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 text-primary" />
        <span>{location}</span>
      </div>
    </div>
  );
};

export default DestinationMap;
