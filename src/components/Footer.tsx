import { MapPin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-earth text-earth-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-savanna" />
              <span className="font-display text-xl font-bold">SafariKenya</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Your gateway to unforgettable Kenyan adventures. Discover wildlife, beaches, and culture.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Explore</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <Link to="/explore" className="hover:opacity-100 transition-opacity">Destinations</Link>
              <Link to="/trip-planner" className="hover:opacity-100 transition-opacity">Trip Planner</Link>
              <Link to="/booking" className="hover:opacity-100 transition-opacity">Book a Tour</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Categories</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <span>Wildlife Safari</span>
              <span>Beach Tourism</span>
              <span>Cultural Tourism</span>
              <span>Adventure Tourism</span>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@safarikenya.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+254 700 123 456</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-earth-foreground/20 mt-12 pt-8 text-center text-sm opacity-60">
          © 2026 SafariKenya. All rights reserved. Karibu Kenya! 🇰🇪
        </div>
      </div>
    </footer>
  );
};

export default Footer;
