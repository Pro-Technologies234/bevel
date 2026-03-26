import React from "react";

interface TourContextType {
  currentStep: number;
  setStep: (step: number) => void;
  totalSteps: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const TourContext = React.createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = React.useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
