import { Hero } from "@/components/base/home/hero";
import { ComingSoon } from "@/components/base/home/coming-soon";
import { Fragment } from "react/jsx-runtime";

export default function Page() {
  return (
    <Fragment>
      <Hero />
      <ComingSoon />
    </Fragment>
  );
}
