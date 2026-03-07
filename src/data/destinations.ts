import maasaiMara from "@/assets/maasai-mara.jpg";
import dianiBeach from "@/assets/diani-beach.jpg";
import mountKenya from "@/assets/mount-kenya.jpg";
import amboseli from "@/assets/amboseli.jpg";
import lakeNakuru from "@/assets/lake-nakuru.jpg";
import maasaiCulture from "@/assets/maasai-culture.jpg";
import nairobi from "@/assets/nairobi.jpg";

export type DestinationCategory = "safari" | "beach" | "cultural" | "adventure";

export interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  category: DestinationCategory;
  location: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  activities: string[];
  travelTips: string[];
  bestTime: string;
  coordinates: { lat: number; lng: number };
}

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Maasai Mara National Reserve",
    slug: "maasai-mara",
    tagline: "The Greatest Wildlife Show on Earth",
    description: "Home to the iconic Great Migration, Maasai Mara offers unparalleled wildlife viewing across vast golden savannas. Witness millions of wildebeest, zebras, and gazelles cross the Mara River, while predators like lions, cheetahs, and leopards roam freely. The reserve also holds deep cultural significance with the Maasai people.",
    image: maasaiMara,
    category: "safari",
    location: "Narok County, Kenya",
    rating: 4.9,
    reviewCount: 2847,
    priceFrom: 250,
    activities: ["Game Drives", "Hot Air Balloon Safari", "Maasai Village Visit", "Bush Walking", "Bird Watching", "Photography Tours"],
    travelTips: ["Visit during July-October for the Great Migration", "Book accommodation well in advance", "Bring binoculars and a good camera", "Wear neutral-colored clothing"],
    bestTime: "July - October",
    coordinates: { lat: -1.4833, lng: 35.0 },
  },
  {
    id: "2",
    name: "Diani Beach",
    slug: "diani-beach",
    tagline: "Africa's Leading Beach Destination",
    description: "Diani Beach is a stunning stretch of white sand along Kenya's Indian Ocean coast. Crystal-clear turquoise waters, swaying palm trees, and vibrant coral reefs make it a paradise for beach lovers and water sports enthusiasts. Explore nearby marine parks, go snorkeling, or simply relax in this tropical haven.",
    image: dianiBeach,
    category: "beach",
    location: "Kwale County, Kenya",
    rating: 4.8,
    reviewCount: 1923,
    priceFrom: 120,
    activities: ["Snorkeling", "Scuba Diving", "Kitesurfing", "Deep Sea Fishing", "Glass Bottom Boat", "Dolphin Watching"],
    travelTips: ["Best weather from December to March", "Protect yourself from sun exposure", "Try local Swahili cuisine", "Visit Colobus Conservation center"],
    bestTime: "December - March",
    coordinates: { lat: -4.3167, lng: 39.5833 },
  },
  {
    id: "3",
    name: "Mount Kenya",
    slug: "mount-kenya",
    tagline: "Africa's Second Highest Peak",
    description: "Mount Kenya, a UNESCO World Heritage Site, rises majestically to 5,199 meters. Its diverse ecosystems range from dense montane forests to alpine meadows and glacial peaks. Trekking routes offer stunning scenery, unique flora, and encounters with wildlife like elephants and buffalo in the lower forests.",
    image: mountKenya,
    category: "adventure",
    location: "Central Kenya",
    rating: 4.7,
    reviewCount: 1245,
    priceFrom: 300,
    activities: ["Mountain Trekking", "Rock Climbing", "Fishing", "Nature Walks", "Bird Watching", "Camping"],
    travelTips: ["Acclimatize properly to avoid altitude sickness", "Hire experienced guides", "Pack warm layers and rain gear", "Start training months before your climb"],
    bestTime: "January - February, August - September",
    coordinates: { lat: -0.1521, lng: 37.3084 },
  },
  {
    id: "4",
    name: "Amboseli National Park",
    slug: "amboseli",
    tagline: "Land of Giants Under Kilimanjaro",
    description: "Amboseli is famous for its large elephant herds and breathtaking views of Mount Kilimanjaro. The park's open plains provide incredible photo opportunities with elephants silhouetted against Africa's highest peak. Swamps fed by Kilimanjaro's snowmelt attract diverse wildlife year-round.",
    image: amboseli,
    category: "safari",
    location: "Kajiado County, Kenya",
    rating: 4.8,
    reviewCount: 1876,
    priceFrom: 200,
    activities: ["Game Drives", "Photography", "Bird Watching", "Maasai Cultural Tours", "Nature Walks", "Sunset Viewing"],
    travelTips: ["Early mornings offer clearest views of Kilimanjaro", "Dry season (June-October) is best for wildlife", "Bring a telephoto lens", "Stay in lodges with Kilimanjaro views"],
    bestTime: "June - October",
    coordinates: { lat: -2.6527, lng: 37.2606 },
  },
  {
    id: "5",
    name: "Lake Nakuru National Park",
    slug: "lake-nakuru",
    tagline: "The Pink Lake of a Million Flamingos",
    description: "Lake Nakuru is a soda lake famous for attracting millions of flamingos that paint the shoreline pink. The surrounding park is a rhino sanctuary and home to lions, leopards, buffaloes, and over 400 bird species. The dramatic landscape of cliffs and woodlands adds to the experience.",
    image: lakeNakuru,
    category: "safari",
    location: "Nakuru County, Kenya",
    rating: 4.6,
    reviewCount: 1534,
    priceFrom: 150,
    activities: ["Game Drives", "Bird Watching", "Rhino Tracking", "Baboon Cliff Viewpoint", "Photography", "Nature Walks"],
    travelTips: ["Flamingo numbers vary seasonally", "Visit Baboon Cliff for panoramic views", "Combine with Lake Naivasha visit", "Binoculars are essential"],
    bestTime: "June - March",
    coordinates: { lat: -0.3667, lng: 36.0833 },
  },
  {
    id: "6",
    name: "Maasai Cultural Experience",
    slug: "maasai-culture",
    tagline: "Step Into Ancient Traditions",
    description: "Immerse yourself in the rich cultural heritage of the Maasai people, one of Africa's most iconic tribes. Visit traditional villages, learn about their nomadic lifestyle, witness ceremonial dances, and understand their deep connection to the land and wildlife that surrounds them.",
    image: maasaiCulture,
    category: "cultural",
    location: "Southern Kenya",
    rating: 4.7,
    reviewCount: 982,
    priceFrom: 80,
    activities: ["Village Visits", "Traditional Dancing", "Beadwork Workshops", "Storytelling", "Cattle Herding", "Market Visits"],
    travelTips: ["Ask permission before photographing people", "Buy authentic crafts directly from artisans", "Learn a few Maa words", "Respect local customs and dress codes"],
    bestTime: "Year-round",
    coordinates: { lat: -1.8, lng: 35.8 },
  },
  {
    id: "7",
    name: "Nairobi",
    slug: "nairobi",
    tagline: "The Green City in the Sun",
    description: "Kenya's vibrant capital combines urban energy with wild nature. Visit the only national park within a city, explore world-class museums, enjoy thriving food scenes, and experience the beating heart of East Africa. Nairobi is the perfect starting point for any Kenyan adventure.",
    image: nairobi,
    category: "cultural",
    location: "Nairobi, Kenya",
    rating: 4.5,
    reviewCount: 2156,
    priceFrom: 50,
    activities: ["Nairobi National Park", "Giraffe Centre", "Karen Blixen Museum", "Nairobi National Museum", "Kazuri Beads Factory", "Carnivore Restaurant"],
    travelTips: ["Use ride-hailing apps for transport", "Visit David Sheldrick Wildlife Trust in the morning", "Try nyama choma at Carnivore", "Nairobi can be cool - bring a jacket"],
    bestTime: "Year-round",
    coordinates: { lat: -1.2921, lng: 36.8219 },
  },
];

export const categoryLabels: Record<DestinationCategory, string> = {
  safari: "Wildlife Safari",
  beach: "Beach Tourism",
  cultural: "Cultural Tourism",
  adventure: "Adventure Tourism",
};

export const categoryColors: Record<DestinationCategory, string> = {
  safari: "bg-safari text-safari-foreground",
  beach: "bg-ocean text-ocean-foreground",
  cultural: "bg-earth text-earth-foreground",
  adventure: "bg-accent text-accent-foreground",
};
