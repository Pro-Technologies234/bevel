"use client";

import { LenisOptions } from "lenis";
import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export default function LenisProvider({
  children,
  ...props
}: {
  children: ReactNode;
  options?: LenisOptions;
}) {
  return (
    <ReactLenis
      root
      options={{
        ...props.options,
        autoRaf: true,
        lerp: 0.4,
        duration: 1.5,
        smoothWheel: true,
        allowNestedScroll: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
