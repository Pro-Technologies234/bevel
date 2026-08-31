import { Hero } from "@/components/base/home/hero";
import Proof from "@/components/base/home/proof";
import BentoShowcase from "@/components/base/home/bento-showcase";
import HowItWorks from "@/components/base/home/HowItWorks";
import Systems from "@/components/base/home/Systems";
import CompareTeaser from "@/components/base/home/compare-teaser";
import LenisProvider from "@/components/providers/lenis-provider";
import { homeMetadata } from "@/lib/metadata";
import Honest from "@/components/base/home/honest";
import Close from "@/components/base/home/close";

export const metadata = homeMetadata;

export default function Page() {
  return (
    <LenisProvider>
      <Hero />
      <Proof />
      <BentoShowcase />
      <Honest />
      <Systems />
      <HowItWorks />
      <CompareTeaser />
      <Close />
    </LenisProvider>
  );
}
