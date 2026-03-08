import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string | null;
  created_at: string;
  profiles?: { display_name: string | null } | null;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-5 w-5 ${star <= rating ? "fill-savanna text-savanna" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer hover:text-savanna" : ""}`}
        onClick={() => interactive && onRate?.(star)}
      />
    ))}
  </div>
);

const ReviewSection = ({ destinationId }: { destinationId: string }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles!reviews_user_id_profiles_fkey(display_name)")
      .eq("destination_id", destinationId)
      .order("created_at", { ascending: false });
    if (data) setReviews(data as any);
  };

  useEffect(() => { fetchReviews(); }, [destinationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (rating === 0) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      destination_id: destinationId,
      rating,
      title,
      content,
    });
    if (error) {
      toast.error(error.message.includes("unique") ? "You've already reviewed this destination" : error.message);
    } else {
      toast.success("Review submitted! ⭐");
      setRating(0); setTitle(""); setContent("");
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="font-display text-xl font-bold text-foreground">Reviews</h3>
        <span className="text-sm text-muted-foreground">({reviews.length})</span>
        <div className="flex items-center gap-1 ml-auto">
          <Star className="h-5 w-5 fill-savanna text-savanna" />
          <span className="font-bold text-foreground">{avgRating}</span>
        </div>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-3">
          <p className="text-sm font-medium text-foreground">Leave a review</p>
          <StarRating rating={rating} onRate={setRating} interactive />
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title" required />
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your experience..." rows={3} />
          <Button type="submit" size="sm" className="bg-gradient-safari" disabled={submitting}>
            <Send className="mr-2 h-4 w-4" /> {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 mb-6 text-center">
          <p className="text-muted-foreground text-sm">
            <Link to="/auth" className="text-primary font-medium hover:underline">Sign in</Link> to leave a review
          </p>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-card-foreground text-sm">
                {(review.profiles as any)?.display_name || "Traveler"}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <StarRating rating={review.rating} />
            <h4 className="font-semibold text-card-foreground mt-2">{review.title}</h4>
            {review.content && <p className="text-sm text-muted-foreground mt-1">{review.content}</p>}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
