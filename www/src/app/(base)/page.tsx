import { Hero } from "@/components/base/home/hero";
import { ComingSoon } from "@/components/base/home/coming-soon";
import { Fragment } from "react/jsx-runtime";
import { ValueProposition } from "@/components/base/home/value-proposition";

export default function Page() {
  return (
    <Fragment>
      <Hero />
      {/* <ValueProposition /> */}
      {/* <ComingSoon /> */}
    </Fragment>
  );
}
