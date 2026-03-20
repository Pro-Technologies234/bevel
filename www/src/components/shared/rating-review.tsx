import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon, IconMessage, IconShieldCheck, IconStar } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface RatingConfig {
  title: string;
  subtitle: string;
  icon: Icon;
  accentColor: string;
  levels: { label: string; color: string }[];
  placeholder: string;
}

interface RatingReviewProps {
  onRate?: (stars: number) => void;
  onSubmit?: (data: { rating: number; review: string }) => void;
  config?: Partial<RatingConfig>;
  trigger?: React.ReactNode;
}

const DEFAULT_CONFIG: RatingConfig = {
  title: "Rate Agent",
  subtitle: "How would you describe their service and market expertise?",
  icon: IconShieldCheck,
  accentColor: "bg-primary",
  placeholder: "Share more details about your experience...",
  levels: [
    { label: "Unprofessional", color: "text-red-500" },
    { label: "Needs Improvement", color: "text-orange-400" },
    { label: "Good Service", color: "text-yellow-400" },
    { label: "Great Insight", color: "text-green-400" },
    { label: "Exceptional Expertise", color: "text-primary" },
  ],
};

const RatingReviewDialog = ({
  onRate,
  onSubmit,
  config,
  trigger,
}: RatingReviewProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [open, setOpen] = useState(false);

  const ui = { ...DEFAULT_CONFIG, ...config };
  const currentDisplay = hover || rating;
  const Icon = ui.icon;

  const handleSubmit = () => {
    onSubmit?.({ rating, review });
    setOpen(false); // Close dialog on submit
    // Reset state after a delay to avoid flicker during exit animation
    setTimeout(() => {
      setRating(0);
      setReview("");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Leave a Review</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
        {/* The Card Component inside the Dialog */}
        <div className="relative overflow-hidden bg-background border border-border p-8 rounded-[2rem] w-full shadow-2xl transition-all duration-500">
          {/* Dynamic Ambient Background Glow */}
          <motion.div
            animate={{
              opacity: currentDisplay > 0 ? 0.15 : 0,
              scale: currentDisplay > 0 ? 1.2 : 0.8,
            }}
            className={`absolute -top-20 -right-20 size-64 ${ui.accentColor} rounded-full blur-[90px] pointer-events-none transition-colors duration-500`}
          />

          <div className="relative z-10 flex flex-col gap-6">
            {/* Header Section */}
            <div className="text-center space-y-3 flex flex-col items-center">
              <motion.div
                layout
                className={`inline-flex items-center justify-center p-2.5 rounded-2xl ${ui.accentColor}/10 mb-1`}
              >
                <Icon
                  className={`size-6 ${ui.accentColor.replace("bg-", "text-")}`}
                />
              </motion.div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-center">
                  {ui.title}
                </DialogTitle>
              </DialogHeader>
              <motion.p
                layout
                className="text-sm text-muted-foreground max-w-[250px] leading-relaxed"
              >
                {ui.subtitle}
              </motion.p>
            </div>

            {/* Interactive Stars */}
            <div className="flex justify-center gap-1.5 ">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= currentDisplay;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setRating(starValue);
                      onRate?.(starValue);
                    }}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                    className="relative p-1.5 outline-none group cursor-pointer"
                  >
                    <IconStar
                      size={36}
                      strokeWidth={1.5}
                      className={`transition-all duration-300 ${
                        isActive
                          ? `fill-current ${ui.accentColor.replace("bg-", "text-")} drop-shadow-md`
                          : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
                      }`}
                    />
                    {rating === starValue && (
                      <motion.div
                        layoutId="active-glow"
                        className={`absolute inset-0 ${ui.accentColor}/20 rounded-full blur-lg -z-10`}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Status Feedback */}
            <div className="h-14 flex flex-col items-center justify-center w-full bg-secondary/30 rounded-2xl border border-border/40 overflow-hidden">
              <AnimatePresence mode="wait">
                {currentDisplay > 0 ? (
                  <motion.div
                    key={currentDisplay}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      className={`text-xs font-black uppercase tracking-[0.15em] ${ui.levels[currentDisplay - 1].color}`}
                    >
                      {ui.levels[currentDisplay - 1].label}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            width: i < currentDisplay ? 16 : 4,
                            opacity: i < currentDisplay ? 1 : 0.3,
                          }}
                          className={`h-1 rounded-full ${i < currentDisplay ? ui.accentColor : "bg-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest"
                  >
                    Tap a star to begin
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Review Input Section */}
            <AnimatePresence>
              {rating > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-4 "
                >
                  <div className="relative">
                    <div className="absolute left-3 top-3">
                      <IconMessage className="size-4 text-muted-foreground/50" />
                    </div>
                    <Textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder={ui.placeholder}
                      className="min-h-[100px] pl-9 rounded-xl resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className={`w-full py-2 ${ui.accentColor} text-white rounded-lg cursor-pointer font-medium shadow-lg hover:brightness-110 transition-all`}
                  >
                    Submit Review
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingReviewDialog;
