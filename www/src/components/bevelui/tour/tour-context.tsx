import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { TourContextValue, TourStepDef } from "./types";

const TourContext = createContext<TourContextValue | undefined>(undefined);

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within <TourProvider>");
  return ctx;
}

interface TourProviderProps {
  children: React.ReactNode;
  steps: TourStepDef[];
  showOverlay: boolean;
  /** Start the tour automatically on mount */
  defaultOpen?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function TourProvider({
  children,
  steps,
  showOverlay,
  defaultOpen = false,
  onComplete,
  onSkip,
}: TourProviderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") skip();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, currentStep]);

  const start = useCallback(() => {
    setCurrentStep(1);
    setIsOpen(true);
  }, []);

  const stop = useCallback(() => setIsOpen(false), []);

  const next = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next > steps.length) {
        setIsOpen(false);
        onComplete?.();
        return prev;
      }
      return next;
    });
  }, [steps.length, onComplete]);

  const prev = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  const goTo = useCallback(
    (step: number) => {
      setCurrentStep(Math.max(1, Math.min(step, steps.length)));
    },
    [steps.length],
  );

  const skip = useCallback(() => {
    setIsOpen(false);
    onSkip?.();
  }, [onSkip]);

  const currentStepDef = steps.find((s) => s.step === currentStep);

  return (
    <TourContext.Provider
      value={{
        steps,
        currentStep,
        totalSteps: steps.length,
        isOpen,
        currentStepDef,
        showOverlay,
        start,
        stop,
        next,
        prev,
        goTo,
        skip,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}
