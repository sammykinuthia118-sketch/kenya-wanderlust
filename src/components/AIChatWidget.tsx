import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Jambo! 🦁 I'm your AI travel assistant. Ask me anything about Kenya — destinations, planning tips, wildlife, or local culture!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-travel-assistant", {
        body: { messages: newMessages.filter((m) => m.role !== "assistant" || m !== messages[0]) },
      });

      if (error) throw error;
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Sorry, I couldn't process that." }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble right now. Try again shortly!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-safari shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="h-6 w-6 text-primary-foreground" /> : <MessageCircle className="h-6 w-6 text-primary-foreground" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] bg-card border border-border rounded-xl shadow-2xl flex flex-col animate-scale-in">
          <div className="bg-gradient-safari rounded-t-xl px-4 py-3 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary-foreground" />
            <span className="font-display font-semibold text-primary-foreground">Safari Assistant</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-accent-foreground" />
                  </div>
                )}
                <div className={`rounded-xl px-3 py-2 text-sm max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                  <Bot className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="bg-secondary rounded-xl px-3 py-2 text-sm text-muted-foreground">Thinking...</div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about Kenya..."
              className="h-9 text-sm"
            />
            <Button size="icon" className="h-9 w-9 bg-gradient-safari" onClick={send} disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
