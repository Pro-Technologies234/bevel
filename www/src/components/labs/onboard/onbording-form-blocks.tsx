import { useFormEngineContext } from "@/components/bevelui/form-engine";
import { BevelIcon } from "@/components/shared/brand-mark";
import { motion } from "motion/react";
function OnboardingFormMeta() {
  const { config, currentStep } = useFormEngineContext();
  const title = config.steps[currentStep].title;
  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <span className=" text-2xl text-center font-bold tracking-tight">
        {title}
      </span>
    </div>
  );
}

function OnboardingFormHeader() {
  const { config, currentStep, totalSteps } = useFormEngineContext();
  const title = config.steps[currentStep].title;

  // Progress fraction for framer-motion (0 to 1)
  const progress = currentStep / totalSteps;

  return (
    <div className="w-full flex justify-between gap-2 items-center mb-8 h-20 px-6 border-b border-border/60 relative">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="h-1 bg-linear-to-r to-rose-600 from-pink-400 rounded-full absolute top-0 left-0 w-full origin-left"
      />

      <div className="flex items-center gap-2">
        <BevelIcon className="w-6 h-6 shrink-0 text-rose-400" />
        <span className="font-semibold font-sans text-lg tracking-tight">
          Bevel Studios
        </span>
      </div>

      <div className="text-right">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest opacity-60">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
      </div>
    </div>
  );
}

export { OnboardingFormMeta, OnboardingFormHeader };
