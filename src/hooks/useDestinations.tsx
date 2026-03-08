import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Local image mapping for seeded destinations
import maasaiMara from "@/assets/maasai-mara.jpg";
import dianiBeach from "@/assets/diani-beach.jpg";
import mountKenya from "@/assets/mount-kenya.jpg";
import amboseli from "@/assets/amboseli.jpg";
import lakeNakuru from "@/assets/lake-nakuru.jpg";
import maasaiCulture from "@/assets/maasai-culture.jpg";
import nairobi from "@/assets/nairobi.jpg";

const localImages: Record<string, string> = {
  "/assets/maasai-mara.jpg": maasaiMara,
  "/assets/diani-beach.jpg": dianiBeach,
  "/assets/mount-kenya.jpg": mountKenya,
  "/assets/amboseli.jpg": amboseli,
  "/assets/lake-nakuru.jpg": lakeNakuru,
  "/assets/maasai-culture.jpg": maasaiCulture,
  "/assets/nairobi.jpg": nairobi,
};

export type DestinationCategory = "safari" | "beach" | "cultural" | "adventure";

export interface DBDestination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image_url: string | null;
  category: string;
  location: string;
  price_from: number;
  activities: string[];
  travel_tips: string[];
  best_time: string;
  lat: number;
  lng: number;
  is_featured: boolean;
  is_active: boolean;
}

export const resolveImage = (url: string | null): string => {
  if (!url) return "/placeholder.svg";
  return localImages[url] || url;
};

export const categoryLabels: Record<string, string> = {
  safari: "Wildlife Safari",
  beach: "Beach Tourism",
  cultural: "Cultural Tourism",
  adventure: "Adventure Tourism",
};

export const categoryColors: Record<string, string> = {
  safari: "bg-safari text-safari-foreground",
  beach: "bg-ocean text-ocean-foreground",
  cultural: "bg-earth text-earth-foreground",
  adventure: "bg-accent text-accent-foreground",
};

export const useDestinations = () => {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false });
      if (error) throw error;
      return data as DBDestination[];
    },
  });
};

export const useDestinationBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["destination", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data as DBDestination;
    },
    enabled: !!slug,
  });
};
