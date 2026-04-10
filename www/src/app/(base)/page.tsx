import { Hero } from "@/components/base/home/hero";
import Marquee from "@/components/landing/Marquee";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Systems from "@/components/landing/Systems";
import CodeDemo from "@/components/landing/CodeDemo";
import Cta from "@/components/landing/Cta";
import LenisProvider from "@/components/providers/lenis-provider";

export default function Page() {
  return (
    <LenisProvider>
      <Hero />
      <Marquee />
      <Systems />
      <HowItWorks />
      <Problem />
      {/* <CodeDemo /> */}
      <Cta />
    </LenisProvider>
  );
}
