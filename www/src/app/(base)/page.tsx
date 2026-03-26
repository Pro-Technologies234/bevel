import { Hero } from "@/components/client/home/hero";
import { ComingSoon } from "@/components/client/home/coming-soon";
import { Fragment } from "react/jsx-runtime";

export default function Page() {
  return (
    <Fragment>
      <Hero />
      <ComingSoon />
    </Fragment>
  );
}
