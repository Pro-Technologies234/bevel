import { IconFlask } from "@tabler/icons-react";
import { Wrapper } from "../shared/wrapper";

export function Intro() {
  return (
    <section className="h-120 flex items-center flex-col justify-center space-y-4 relative z-1 text-center">
      <div
        className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase"
        style={{
          background: "rgba(194,241,60,0.07)",
          border: "1px solid rgba(194,241,60,0.2)",
          color: "#c2f13c",
        }}
      >
        <IconFlask size={11} />
        Bevel Labs
      </div>
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight  mb-4 font-sans">
        See the systems in production.
      </h1>
      <p className="text-base  max-w-lg mx-auto leading-relaxed font-light mb-2">
        Six fully functional applications built entirely with Bevel systems. Not
        demos — real working software you can use right now.
      </p>
      {/* <p className="text-sm text-muted-foreground/60">
        Pro subscribers get the full source code for all six.
      </p> */}
    </section>
  );
}
