"use client";

import * as React from "react";
import {
  AudioVisualizerRoot,
  VisualizerCanvas,
  useAudioVisualizer,
} from "@/components/bevelui/audio-visualizer";
import type { VisualizerMode } from "@/components/bevelui/audio-visualizer";
import { cn } from "@/lib/utils";

const MODES: { value: VisualizerMode; label: string }[] = [
  { value: "bars", label: "Bars" },
  { value: "wave", label: "Wave" },
  { value: "circular", label: "Circular" },
];

/**
 * Demo-only: generates a procedural test tone via Web Audio so the visualizer
 * has something to render without depending on an external audio file.
 * Real usage connects an <audio> element, a MediaStream (mic), or an AudioBuffer.
 */
function useTestTone() {
  const audioElRef = React.useRef<HTMLAudioElement | null>(null);
  const stopFnRef = React.useRef<(() => void) | null>(null);
  const [playing, setPlaying] = React.useState(false);

  function toggle(onReady: (el: HTMLAudioElement) => void) {
    if (playing) {
      stopFnRef.current?.();
      stopFnRef.current = null;
      setPlaying(false);
      return;
    }

    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = 110;
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 220;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 40;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    const gain = ctx.createGain();
    gain.gain.value = 0.15;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);

    osc1.start();
    osc2.start();
    lfo.start();

    if (!audioElRef.current) {
      audioElRef.current = new Audio();
      audioElRef.current.loop = true;
    }
    const el = audioElRef.current;
    el.srcObject = dest.stream;
    el.play();
    onReady(el);

    stopFnRef.current = () => {
      osc1.stop();
      osc2.stop();
      lfo.stop();
      el.pause();
      ctx.close();
    };

    setPlaying(true);
  }

  React.useEffect(() => () => stopFnRef.current?.(), []);

  return { playing, toggle };
}

function DemoControls() {
  const { mode, setMode, isRunning, start, stop, connect, resume } = useAudioVisualizer();
  const { playing, toggle } = useTestTone();

  async function onToggle() {
    await resume();
    if (playing) {
      toggle(() => {}); // stops the test tone
      stop(); // stops the visualizer render loop
    } else {
      toggle((el) => {
        connect(el);
        start();
      });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "rounded-md border border-border px-3 py-1.5 text-[12px] font-medium transition-colors",
          playing ? "bg-primary/10 text-primary" : "bg-card/80 text-foreground/80 hover:bg-muted/60",
        )}
      >
        {playing ? "Stop test tone" : "Play test tone"}
      </button>

      <div className="flex items-center gap-1 rounded-md border border-border bg-card/80 p-0.5">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={cn(
              "rounded px-2 py-1 text-[11px] font-medium transition-colors",
              mode === m.value
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <span className="text-[11px] text-muted-foreground/60">
        {isRunning ? "Rendering" : "Idle"}
      </span>
    </div>
  );
}

export function AudioVisualizerDemo() {
  return (
    <AudioVisualizerRoot config={{ mode: "bars", color: "#c2f13c", fftSize: 512, barCount: 64 }}>
      <div className="flex h-[280px] flex-col gap-3 rounded-xl border border-border bg-background/60 p-4">
        <DemoControls />
        <div className="flex-1 overflow-hidden rounded-lg border border-border/60 bg-card/40">
          <VisualizerCanvas />
        </div>
      </div>
    </AudioVisualizerRoot>
  );
}

AudioVisualizerDemo.displayName = "AudioVisualizerDemo";
