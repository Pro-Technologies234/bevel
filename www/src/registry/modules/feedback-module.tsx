import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Icon,
  IconMessage,
  IconMoodAngry,
  IconMoodAngryFilled,
  IconMoodHappy,
  IconMoodHappyFilled,
  IconMoodNeutral,
  IconMoodNeutralFilled,
  IconMoodSad,
  IconMoodSadFilled,
  IconMoodSmile,
  IconMoodSmileFilled,
  IconShieldCheck,
  IconX,
} from "@tabler/icons-react";
import { cva, VariantProps } from "class-variance-authority";
import { AnimatePresence } from "motion/react";
import { KeyboardEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RatingField } from "../controls/rating-field";
import { Button } from "@/components/ui/button";

function FeedbackModule({
  value,
  showComment = true,
  isLoading,
  title,
  subtitle,
  placeholder = "Share more details about your experience...",
  submitLabel = "Send Feedback",
  levels = [
    {
      label: "Unprofessional",
      color: "#fb2c36",
      icon: IconMoodAngryFilled,
      emptyIcon: IconMoodAngry,
    },
    {
      label: "Needs Improvement",
      color: "#ff8904",
      icon: IconMoodSadFilled,
      emptyIcon: IconMoodSad,
    },
    {
      label: "Good Service",
      color: "#fdc700",
      icon: IconMoodNeutralFilled,
      emptyIcon: IconMoodNeutral,
    },
    {
      label: "Great Insight",
      color: "#00d492",
      icon: IconMoodSmileFilled,
      emptyIcon: IconMoodSmile,
    },
    {
      label: "Exceptional Expertise",
      color: "#05df72",
      icon: IconMoodHappyFilled,
      emptyIcon: IconMoodHappy,
    },
  ],
  onSubmit,
  className,
  ...props
}: FeedbackModuleProps) {
  const [hover, setHover] = useState(0);
  const isControlled = "value" in props && props.value !== undefined;
  const [internalValue, setInternalValue] = useState<Feedback | undefined>(
    !isControlled
      ? (props as FeedbackModuleUncontrolled).defaultValue
      : undefined,
  );
  const currentValue = (isControlled
    ? (props as FeedbackModuleControlled).value
    : internalValue) || { rating: 0 };
  const { rating, comment } = currentValue;
  const currentDisplay = hover || internalValue?.rating || 0;

  const handleChange = (val: Feedback) => {
    if (!isControlled) setInternalValue(val);
    props.onChange?.(val);
  };
  const handleSubmit = () => {
    onSubmit?.({ rating, comment });
    handleChange({ rating, comment });
  };

  return (
    <div className="relative overflow-hidden p-8 rounded-3xl w-full shadow-2xl transition-all duration-500 bgemra">
      <div className="relative z-10 flex flex-col gap-6">
        {/* Header Section */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <motion.span layout className="text-lg ">
            {title}
          </motion.span>
          <motion.p
            layout
            className="text-sm text-muted-foreground max-w-[250px] leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Interactive Stars */}
        <div className="flex justify-center gap-1.5 ">
          <RatingField
            max={levels.length || 5}
            value={rating}
            onHover={setHover}
            levels={levels}
            single
            onChange={(val) => handleChange({ comment: comment, rating: val })}
          />
        </div>

        {/* Status Feedback */}
        <div className="h-12 flex flex-col items-center justify-center w-full bg-secondary/30 rounded-xl border border-border/40 overflow-hidden">
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
                  style={{
                    color: levels[currentDisplay - 1].color,
                  }}
                  className={cn(
                    `text-xs font-semibold uppercase tracking-tight`,
                  )}
                >
                  {levels[currentDisplay - 1].label}
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        width: i < currentDisplay ? 16 : 4,
                        opacity: i < currentDisplay ? 1 : 0.3,
                        ...(levels[i]?.color && {
                          backgroundColor: levels[currentDisplay - 1]?.color,
                        }),
                      }}
                      className={cn(
                        `h-1 rounded-full`,
                        i < currentDisplay
                          ? "bg-primary"
                          : "bg-muted-foreground",
                      )}
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
        {showComment && (
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
                    value={comment}
                    onChange={(e) =>
                      handleChange({
                        rating,
                        comment: e.target.value,
                      })
                    }
                    placeholder={placeholder}
                    className="min-h-[100px] max-h-[120px] pl-9 rounded-xl resize-none"
                  />
                </div>
                {onSubmit && (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    size={"lg"}
                    className={`w-full h-11 rounded-xl cursor-pointer font-medium shadow-lg hover:brightness-110 transition-all`}
                  >
                    {isLoading ? "Sending..." : submitLabel}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// Controlled
interface FeedbackModuleControlled {
  value: Feedback;
  defaultValue?: never;
  onChange: (feedback: Feedback) => void;
}

// Uncontrolled
interface FeedbackModuleUncontrolled {
  value?: never;
  defaultValue?: Feedback;
  onChange?: (feedback: Feedback) => void;
}
export type Feedback = { rating: number; comment?: string };

export type FeedbackModuleProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  submitLabel?: string;
  showComment?: boolean;
  isLoading?: boolean;
  levels?: {
    label: string;
    color: string;
    icon?: Icon;
    emptyIcon?: Icon;
  }[];
  onSubmit?: (data: Feedback) => void;
  className?: string;
} & (FeedbackModuleControlled | FeedbackModuleUncontrolled);

FeedbackModule.displayName = "FeedbackModule";

export { FeedbackModule };
