import { Hero } from "@/components/base/home/hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Systems from "@/components/landing/Systems";
import Cta from "@/components/landing/Cta";
import LenisProvider from "@/components/providers/lenis-provider";
import { homeMetadata } from "@/lib/metadata";
export const metadata = homeMetadata;

export default function Page() {
  return (
    <LenisProvider>
      <Hero />
      <Systems />
      <HowItWorks />
      <Problem />
      <Cta />
    </LenisProvider>
  );
}
