import { Link, useLocation } from "react-router-dom";
import { MapPin, Menu, X, LogIn, LogOut, Shield, User } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore Kenya" },
  { to: "/trip-planner", label: "Trip Planner" },
  { to: "/booking", label: "Book a Tour" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out. Kwaheri! 👋");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Safari<span className="text-primary">Kenya</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                location.pathname === "/admin"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="ml-2">
              <LogOut className="mr-1 h-4 w-4" /> Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="ml-2">
                <LogIn className="mr-1 h-4 w-4" /> Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              🛡️ Admin Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
              Sign Out
            </button>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-muted">
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
