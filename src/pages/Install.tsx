import { useState, useEffect } from "react";
import { Download, Smartphone, CheckCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-md px-4 text-center">
        <div className="mb-6">
          <img src="/pwa-icon-512.png" alt="SafariKenya" className="w-24 h-24 mx-auto rounded-2xl shadow-lg" />
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Install <span className="text-primary">SafariKenya</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Add SafariKenya to your home screen for the best experience — fast, offline-ready, and always at your fingertips.
        </p>

        {installed ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="h-12 w-12 text-accent" />
            <p className="font-semibold text-card-foreground">App installed successfully!</p>
            <p className="text-sm text-muted-foreground">You can now find SafariKenya on your home screen.</p>
          </div>
        ) : isIOS ? (
          <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4">
            <h3 className="font-display text-lg font-semibold text-card-foreground">Install on iPhone/iPad</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                <span>Tap the <Share className="inline h-4 w-4 text-primary" /> <strong>Share</strong> button in Safari</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                <span>Tap <strong>"Add"</strong> to confirm</span>
              </li>
            </ol>
          </div>
        ) : deferredPrompt ? (
          <Button onClick={handleInstall} size="lg" className="bg-gradient-safari h-12 text-base gap-2">
            <Download className="h-5 w-5" /> Install App
          </Button>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 text-left space-y-3">
            <h3 className="font-display text-lg font-semibold text-card-foreground">Install from Browser</h3>
            <p className="text-sm text-muted-foreground">
              Open your browser menu and look for <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.
            </p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Smartphone, label: "Works Offline" },
            { icon: Download, label: "Fast Loading" },
            { icon: CheckCircle, label: "No App Store" },
          ].map((item) => (
            <div key={item.label} className="text-muted-foreground">
              <item.icon className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Install;
