"use client";

import * as React from "react";
import {
  TimelineRoot,
  TimelineTrack,
  TimelineClip,
  TimelineControls,
  TimelineKeyframe,
  useTimeline,
  TimelinePlayhead,
  TimelineRuler,
  TimelineContent,
} from "@/components/bevelui/timeline";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { IconVolume } from "@tabler/icons-react";
// ─── Data ─────────────────────────────────────────────────────────────────────

const VIDEO_CLIPS = [
  {
    id: "v1",
    start: 0,
    end: 7.5,
    label: "Intro",
    color: "bg-blue-500/25 border-blue-500/50",
  },
  {
    id: "v2",
    start: 8,
    end: 15,
    label: "Scene A",
    color: "bg-indigo-500/25 border-indigo-500/50",
  },
  {
    id: "v3",
    start: 15.5,
    end: 22,
    label: "Scene B",
    color: "bg-violet-500/25 border-violet-500/50",
  },
  {
    id: "v4",
    start: 22.5,
    end: 28,
    label: "Outro",
    color: "bg-purple-500/25 border-purple-500/50",
  },
];

const AUDIO_CLIPS = [
  {
    id: "a1",
    start: 0,
    end: 14,
    label: "BG Music",
    color: "bg-emerald-500/25 border-emerald-500/50",
  },
  {
    id: "a2",
    start: 14.5,
    end: 28,
    label: "Voiceover",
    color: "bg-teal-500/25 border-teal-500/50",
  },
];

const TEXT_CLIPS = [
  {
    id: "t1",
    start: 1,
    end: 4,
    label: "Title card",
    color: "bg-amber-500/25 border-amber-500/50",
  },
  {
    id: "t2",
    start: 10,
    end: 14,
    label: "Lower third",
    color: "bg-orange-500/25 border-orange-500/50",
  },
  {
    id: "t3",
    start: 23,
    end: 27,
    label: "End screen",
    color: "bg-yellow-500/25 border-yellow-500/50",
  },
];

const EFFECT_CLIPS = [
  {
    id: "e1",
    start: 7,
    end: 9,
    label: "Transition",
    color: "bg-rose-500/25 border-rose-500/50",
  },
  {
    id: "e2",
    start: 14.5,
    end: 16,
    label: "Transition",
    color: "bg-rose-500/25 border-rose-500/50",
  },
  {
    id: "e3",
    start: 22,
    end: 23,
    label: "Fade",
    color: "bg-pink-500/25 border-pink-500/50",
  },
];

// ─── Clip renderer ─────────────────────────────────────────────────────────────

function Clip({ label, color }: { label: string; color: string }) {
  return (
    <div
      className={cn(
        "flex items-center h-full px-2 rounded-md border text-[10px] font-medium truncate border-b-4",
        color,
      )}
    >
      {label}
    </div>
  );
}

// ─── Preview — reads currentTime from context, no external prop needed ────────

function VideoPreview() {
  const { currentTime, duration } = useTimeline();
  const pct = Math.round((currentTime / duration) * 100);
  const clip = VIDEO_CLIPS.find(
    (c) => currentTime >= c.start && currentTime <= c.end,
  );

  return (
    <div className="w-full aspect-video h-64 bg-muted/20 border border-border rounded-xl flex items-center justify-center relative overflow-hidden mb-3">
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          background: clip
            ? `oklch(0.2 0.04 ${pct * 3.6})`
            : "hsl(var(--muted))",
        }}
      />
      <div className="relative z-10 text-center">
        <p className="text-xs font-mono text-white/60">{clip?.label ?? "—"}</p>
        <p className="text-[10px] font-mono text-white/30">
          {currentTime.toFixed(2)}s
        </p>
      </div>
    </div>
  );
}

// ─── Inner shell — must be inside TimelineRoot to use useTimeline ─────────────

function TimelineShell() {
  const { scrubTo } = useTimeline();
  const trackControl = (label: string) => {
    return (
      <div className="flex items-center gap-2 justify-center h-full">
        <Button variant={"ghost"} size={"icon"}>
          <IconVolume />
        </Button>
        <div>
          <span className="text-sm">{label}</span>
        </div>
      </div>
    );
  };
  return (
    <>
      <VideoPreview />

      <TimelineControls />
      <TimelineContent>
        <TimelineTrack controls={trackControl("Video")}>
          {VIDEO_CLIPS.map((c) => (
            <TimelineClip key={c.id} start={c.start} end={c.end}>
              <Clip label={c.label} color={c.color} />
            </TimelineClip>
          ))}
        </TimelineTrack>

        <TimelineTrack controls={trackControl("Audio")}>
          {AUDIO_CLIPS.map((c) => (
            <TimelineClip key={c.id} start={c.start} end={c.end}>
              <Clip label={c.label} color={c.color} />
            </TimelineClip>
          ))}
        </TimelineTrack>

        <TimelineTrack controls={trackControl("Text")}>
          {TEXT_CLIPS.map((c) => (
            <TimelineClip key={c.id} start={c.start} end={c.end}>
              <Clip label={c.label} color={c.color} />
            </TimelineClip>
          ))}
        </TimelineTrack>

        <TimelineTrack controls={trackControl("Effects")}>
          {EFFECT_CLIPS.map((c) => (
            <TimelineClip key={c.id} start={c.start} end={c.end}>
              <Clip label={c.label} color={c.color} />
            </TimelineClip>
          ))}
        </TimelineTrack>
      </TimelineContent>
    </>
  );
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export function VideoTimelineDemo() {
  // const [isPlaying, setIsPlaying] = React.useState(false);
  // const [time, setTime] = React.useState(0);
  // const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // React.useEffect(() => {
  //   if (isPlaying) {
  //     intervalRef.current = setInterval(() => {
  //       setTime((t) => {
  //         if (t >= 28) {
  //           setIsPlaying(false);
  //           return 0;
  //         }
  //         return +(t + 0.05).toFixed(3);
  //       });
  //     }, 50);
  //   } else {
  //     if (intervalRef.current) clearInterval(intervalRef.current);
  //   }
  //   return () => {
  //     if (intervalRef.current) clearInterval(intervalRef.current);
  //   };
  // }, [isPlaying]);

  return (
    <div className="w-full max-w-3xl p-4">
      <TimelineRoot
        duration={28}
        config={{
          defaultZoom: 38,
          trackHeight: 40,
          headerWidth: 100,
          rulerHeight: 28,
        }}
        // onTimeChange={(t) => setTime(t)}
      >
        <TimelineShell

        // onPlayPause={() => setIsPlaying((p) => !p)}
        />
      </TimelineRoot>
    </div>
  );
}
// "use client";

// import * as React from "react";
// import {
//   TimelineRoot,
//   TimelineTrack,
//   TimelineClip,
//   TimelineControls,
//   TimelineKeyframe,
//   TimelineContent,
//   useTimeline,
// } from "@/components/bevelui/timeline";

// import { cn } from "@/lib/utils";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { Button } from "@/components/ui/button";
import {
  IconEye,
  IconEyeOff,
  IconLock,
  IconLockOpen,
  IconVideo,
  IconPlayerPlay,
  IconSparkles,
  IconMusic,
} from "@tabler/icons-react";

// ─── Animation Data ─────────────────────────────────────────────────────────
const KF = {
  posX: [
    { t: 0, v: 0 },
    { t: 3, v: 120 },
    { t: 6, v: 60 },
    { t: 9, v: 180 },
  ],
  posY: [
    { t: 0, v: 0 },
    { t: 2, v: -40 },
    { t: 5, v: 30 },
    { t: 8, v: -20 },
  ],
  rotation: [
    { t: 0, v: 0 },
    { t: 4, v: 180 },
    { t: 7, v: 90 },
    { t: 10, v: 360 },
  ],
};

// ─── Interpolation ──────────────────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function valueAt(frames: { t: number; v: number }[], time: number): number {
  if (!frames.length) return 0;
  if (time <= frames[0].t) return frames[0].v;
  if (time >= frames[frames.length - 1].t) return frames[frames.length - 1].v;
  for (let i = 0; i < frames.length - 1; i++) {
    if (time >= frames[i].t && time <= frames[i + 1].t) {
      const p = (time - frames[i].t) / (frames[i + 1].t - frames[i].t);
      return lerp(frames[i].v, frames[i + 1].v, easeInOutCubic(p));
    }
  }
  return frames[frames.length - 1].v;
}

// ─── Live Preview (Unity Game View style) ───────────────────────────────────
function AnimationPreview() {
  const { engine } = useTimeline();
  const t = engine.currentTime;

  const x = valueAt(KF.posX, t);
  const y = valueAt(KF.posY, t);
  const rot = valueAt(KF.rotation, t);

  return (
    <div className="h-72 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden relative mb-4 shadow-2xl">
      <div className="absolute top-3 left-4 flex items-center gap-2 z-20">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-xs font-mono text-zinc-400 tracking-widest">
          GAME VIEW
        </span>
      </div>

      <div className="absolute bottom-3 right-4 font-mono text-xs text-zinc-500 z-20">
        {t.toFixed(2)}s
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="w-full h-px bg-white" />
        <div className="absolute h-full w-px bg-white" />
      </div>

      <div
        className="absolute left-1/2 top-1/2 w-24 h-24 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 rounded-2xl shadow-2xl flex items-center justify-center border border-white/30"
        style={{
          transform: `translate(-50%, -50%) translate(${x * 1.2}px, ${y * 1.2}px) rotate(${rot}deg)`,
          willChange: "transform",
        }}
      >
        <div className="w-8 h-8 bg-white rounded-xl rotate-45" />
      </div>
    </div>
  );
}

// ─── Track Header Component (Unity style) ───────────────────────────────────
function TrackHeader({
  label,
  icon,
  color = "text-white",
}: {
  label: string;
  icon: React.ReactNode;
  color?: string;
}) {
  const [visible, setVisible] = React.useState(true);
  const [locked, setLocked] = React.useState(false);

  return (
    <div className="flex items-center gap-2 h-full px-3 text-sm font-medium">
      {icon}
      <span className={color}>{label}</span>

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={() => setVisible(!visible)}
          className="text-zinc-400 hover:text-white"
        >
          {visible ? <IconEye size={16} /> : <IconEyeOff size={16} />}
        </button>
        <button
          onClick={() => setLocked(!locked)}
          className="text-zinc-400 hover:text-white"
        >
          {locked ? <IconLock size={16} /> : <IconLockOpen size={16} />}
        </button>
      </div>
    </div>
  );
}

// ─── Keyframe Track ─────────────────────────────────────────────────────────
function KFTrack({
  label,
  icon,
  frames,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  frames: { t: number; v: number }[];
  color: string;
}) {
  return (
    <TimelineTrack controls={<TrackHeader label={label} icon={icon} />}>
      <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-700 -translate-y-1/2" />
      {frames.map((f, i) => (
        <TimelineKeyframe key={i} time={f.t}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "w-3 h-3 rotate-45 border-2 shadow-md hover:scale-125 cursor-pointer transition-all",
                  color,
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              {f.t}s : {f.v}
            </TooltipContent>
          </Tooltip>
        </TimelineKeyframe>
      ))}
    </TimelineTrack>
  );
}

// ─── Clip Track (Unity style) ───────────────────────────────────────────────
function AnimationClipTrack() {
  const [clips, setClips] = React.useState([
    { start: 0, end: 3.8, name: "Walk", color: "from-emerald-600 to-teal-600" },
    { start: 4.2, end: 7.1, name: "Run", color: "from-blue-600 to-cyan-600" },
    {
      start: 7.5,
      end: 9.8,
      name: "Jump",
      color: "from-violet-600 to-purple-600",
    },
  ]);

  return (
    <TimelineTrack
      controls={
        <TrackHeader label="MainCharac" icon={<IconPlayerPlay size={18} />} />
      }
    >
      {clips.map((clip, i) => (
        <TimelineClip
          key={i}
          start={clip.start}
          end={clip.end}
          onMove={(s, e) => {
            const newClips = [...clips];
            newClips[i] = { ...newClips[i], start: s, end: e };
            setClips(newClips);
          }}
          className={cn(
            "border border-white/20 text-white text-xs font-medium",
            `bg-gradient-to-r ${clip.color}`,
          )}
        >
          <div className="px-2 py-1 truncate">{clip.name}</div>
        </TimelineClip>
      ))}
    </TimelineTrack>
  );
}

function ParticleTrack() {
  const [clip, setClip] = React.useState({ start: 2.5, end: 6.8 });

  return (
    <TimelineTrack
      controls={
        <TrackHeader
          label="Control Track"
          icon={<IconSparkles size={18} className="text-cyan-400" />}
        />
      }
    >
      <TimelineClip
        start={clip.start}
        end={clip.end}
        onMove={(s, e) => setClip({ start: s, end: e })}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 border border-cyan-400 text-white text-xs"
      >
        <div className="px-2 py-1 flex items-center gap-1">
          <span>particle</span>
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </div>
      </TimelineClip>
    </TimelineTrack>
  );
}

function AudioTrack() {
  const [clip, setClip] = React.useState({ start: 1.2, end: 8.5 });

  return (
    <TimelineTrack
      controls={
        <TrackHeader
          label="None (Audio Source)"
          icon={<IconMusic size={18} className="text-orange-400" />}
        />
      }
    >
      <TimelineClip
        start={clip.start}
        end={clip.end}
        onMove={(s, e) => setClip({ start: s, end: e })}
        className="bg-gradient-to-r from-orange-600 to-amber-600 border border-orange-400 text-white text-xs"
      >
        <div className="px-2 py-1">Airbag</div>
      </TimelineClip>
    </TimelineTrack>
  );
}

// ─── Main Demo ──────────────────────────────────────────────────────────────
export function SequenceTimelineDemo() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Unity Timeline Replica</h1>
        <p className="text-zinc-400">
          Drag clips • Resize • Scrub • Zoom • Live preview
        </p>
      </div>

      <TimelineRoot
        duration={12}
        config={{
          defaultZoom: 95,
          minZoom: 30,
          maxZoom: 280,
          trackHeight: 46,
          headerWidth: 190,
          rulerHeight: 38,
          snapToGrid: true,
          snapInterval: 0.05,
        }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-4 border-b border-zinc-800">
          <TimelineControls />
        </div>

        <TimelineContent>
          <AnimationPreview />

          {/* Unity-style Tracks */}
          <TimelineTrack
            controls={
              <TrackHeader
                label="Directional Light"
                icon={<div className="w-4 h-4 bg-green-500 rounded" />}
              />
            }
          >
            <TimelineClip
              start={0}
              end={11}
              className="bg-green-600/80 border border-green-400"
            >
              <div className="px-3 py-1 text-xs font-medium">Active</div>
            </TimelineClip>
          </TimelineTrack>

          <AnimationClipTrack />
          <ParticleTrack />
          <AudioTrack />

          <KFTrack
            label="Position X"
            icon={<IconSparkles size={18} />}
            frames={KF.posX}
            color="bg-blue-500 border-blue-400"
          />
          <KFTrack
            label="Rotation"
            icon={<IconSparkles size={18} />}
            frames={KF.rotation}
            color="bg-purple-500 border-purple-400"
          />
        </TimelineContent>
      </TimelineRoot>
    </div>
  );
}
