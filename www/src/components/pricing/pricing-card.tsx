"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  IconCircleCheckFilled,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import * as React from "react";

export interface PricingCardProps {
  /**
   * Plan title (e.g., "Lifetime Access", "Pro Yearly")
   */
  title: string;
  /**
   * Current price amount (numeric)
   */
  price: number;
  /**
   * Optional original price for strikethrough discount display
   */
  originalPrice?: number;
  /**
   * Billing period text (e.g., "one-time", "yearly", "month")
   */
  period?: string;
  /**
   * Optional short description below the price
   */
  description?: string;
  /**
   * List of features to display with checkmarks
   */
  features: string[];
  /**
   * Optional badge text (e.g., "Most Popular")
   */
  badge?: string;
  /**
   * Primary CTA button text
   */
  buttonText: string;
  /**
   * Callback when checkout button is clicked
   */
  onCheckout?: () => void | Promise<void>;
  /**
   * Accent color in hex (default: #c2f13c)
   */
  accentColor?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the card should be visually highlighted (featured)
   */
  featured?: boolean;
  /**
   * Loading state for the checkout button
   */
  isLoading?: boolean;
}

/**
 * Reusable pricing card component with glowing accent, badge support,
 * discount strikethrough, and fully customizable features.
 * Designed for lifetime deals, subscriptions, and SaaS pricing pages.
 */
export function PricingCard({
  title,
  price,
  originalPrice,
  period = "one-time",
  description,
  features,
  badge,
  buttonText,
  onCheckout,
  accentColor = "#c2f13c",
  className,
  featured = false,
  isLoading = false,
}: PricingCardProps) {
  // Convert hex to RGB for dynamic opacity backgrounds
  const hexToRgb = (hex: string) => {
    const sanitized = hex.replace("#", "");
    const r = parseInt(sanitized.substring(0, 2), 16);
    const g = parseInt(sanitized.substring(2, 4), 16);
    const b = parseInt(sanitized.substring(4, 6), 16);
    return { r, g, b };
  };

  const rgb = hexToRgb(accentColor);
  const bgOpacity = 0.04;
  const borderOpacity = 0.3;
  const badgeBgOpacity = 0.15;

  // const formatPrice = (value: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }).format(value);
  // };

  const handleCheckout = async () => {
    if (onCheckout) {
      await onCheckout();
    }
  };

  return (
    <div
      className={cn(
        "bg-muted/40 rounded-2xl p-7 flex flex-col gap-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl",

        className,
      )}
    >
      {badge && (
        <Badge className="absolute top-4 right-4 text-[10px] font-semibold z-10 bg-linear-to-tr from-yellow-400 to-yellow-200 border-none ">
          {badge}
        </Badge>
      )}

      {/* Plan header */}
      <div>
        <p className="text-sm tracking-tight  mb-3">{title}</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-4xl font-semibold tracking-tight">
            {formatPrice(price)}
          </span>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>
        {originalPrice && (
          <p className="text-sm text-muted-foreground line-through mt-1">
            {formatPrice(originalPrice)}{" "}
            {period === "one-time" ? "one-time" : `/${period}`}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Features list */}
      <ul className="flex flex-col gap-3 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2.5 text-sm">
            <IconRosetteDiscountCheckFilled
              size={14}
              strokeWidth={2.5}
              className="shrink-0 text-foreground"
            />
            <span className="text-foreground/90">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full font-semibold transition-all rounded-full p-5 font-sans cursor-pointer"
        variant={featured ? "default" : "inverted"}
      >
        {isLoading ? "Processing..." : buttonText}
      </Button>
    </div>
  );
}
