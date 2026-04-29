import { Hero } from "@/components/base/home/hero";
import Problem from "@/components/base/home/Problem";
import HowItWorks from "@/components/base/home/HowItWorks";
import Systems from "@/components/base/home/Systems";
import Cta from "@/components/base/home/Cta";
import LenisProvider from "@/components/providers/lenis-provider";
import { homeMetadata } from "@/lib/metadata";
import Honest from "@/components/base/home/honest";
import Close from "@/components/base/home/close";
export const metadata = homeMetadata;

export default function Page() {
  return (
    <LenisProvider>
      <Hero />
      <Honest />
      <Systems />
      <HowItWorks />
      {/* <Problem /> */}
      <Close />
      {/* <Cta /> */}
    </LenisProvider>
  );
}
