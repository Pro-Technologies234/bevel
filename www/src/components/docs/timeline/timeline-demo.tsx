// "use client";

import { TimelineRoot } from "@/components/bevelui/timeline";

// import * as React from "react";
// import {
//   TimelineRoot,
//   TimelineTrack,
//   TimelineClip,
//   TimelineControls,
//   useTimeline,
//   TimelineKeyframe,
// } from "@/components/bevelui/timeline";
// import { cn } from "@/lib/utils";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTitle,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// // ─── Data ─────────────────────────────────────────────────────────────────────

// const VIDEO_CLIPS = [
//   {
//     id: "v1",
//     start: 0,
//     end: 7.5,
//     label: "Intro",
//     color: "bg-blue-500/25 border-blue-500/50",
//   },
//   {
//     id: "v2",
//     start: 8,
//     end: 15,
//     label: "Scene A",
//     color: "bg-indigo-500/25 border-indigo-500/50",
//   },
//   {
//     id: "v3",
//     start: 15.5,
//     end: 22,
//     label: "Scene B",
//     color: "bg-violet-500/25 border-violet-500/50",
//   },
//   {
//     id: "v4",
//     start: 22.5,
//     end: 28,
//     label: "Outro",
//     color: "bg-purple-500/25 border-purple-500/50",
//   },
// ];

// const AUDIO_CLIPS = [
//   {
//     id: "a1",
//     start: 0,
//     end: 14,
//     label: "BG Music",
//     color: "bg-emerald-500/25 border-emerald-500/50",
//   },
//   {
//     id: "a2",
//     start: 14.5,
//     end: 28,
//     label: "Voiceover",
//     color: "bg-teal-500/25 border-teal-500/50",
//   },
// ];

// const TEXT_CLIPS = [
//   {
//     id: "t1",
//     start: 1,
//     end: 4,
//     label: "Title card",
//     color: "bg-amber-500/25 border-amber-500/50",
//   },
//   {
//     id: "t2",
//     start: 10,
//     end: 14,
//     label: "Lower third",
//     color: "bg-orange-500/25 border-orange-500/50",
//   },
//   {
//     id: "t3",
//     start: 23,
//     end: 27,
//     label: "End screen",
//     color: "bg-yellow-500/25 border-yellow-500/50",
//   },
// ];

// const EFFECT_CLIPS = [
//   {
//     id: "e1",
//     start: 7,
//     end: 9,
//     label: "Transition",
//     color: "bg-rose-500/25 border-rose-500/50",
//   },
//   {
//     id: "e2",
//     start: 14.5,
//     end: 16,
//     label: "Transition",
//     color: "bg-rose-500/25 border-rose-500/50",
//   },
//   {
//     id: "e3",
//     start: 22,
//     end: 23,
//     label: "Fade",
//     color: "bg-pink-500/25 border-pink-500/50",
//   },
// ];

// // ─── Clip renderer ────────────────────────────────────────────────────────────

// function Clip({ label, color }: { label: string; color: string }) {
//   return (
//     <div
//       className={cn(
//         "flex items-center h-full px-2 rounded-md border text-[10px] font-medium truncate border-b-4",
//         color,
//       )}
//     >
//       {label}
//     </div>
//   );
// }

// // ─── Preview panel ────────────────────────────────────────────────────────────
// // Lives inside TimelineRoot so useTimeline() works with no wrapper gymnastics.

// function VideoPreview() {
//   const { currentTime, duration } = useTimeline();
//   const pct = Math.round((currentTime / duration) * 100);
//   const clip = VIDEO_CLIPS.find(
//     (c) => currentTime >= c.start && currentTime <= c.end,
//   );

//   return (
//     <div className="w-full aspect-video h-64 bg-muted/20 border border-border rounded-xl flex items-center justify-center relative overflow-hidden mb-3">
//       <div
//         className="absolute inset-0 transition-colors duration-300"
//         style={{
//           background: clip
//             ? `oklch(0.2 0.04 ${pct * 3.6})`
//             : "hsl(var(--muted))",
//         }}
//       />
//       <div className="relative z-10 text-center">
//         <p className="text-xs font-mono text-white/60">{clip?.label ?? "—"}</p>
//         <p className="text-[10px] font-mono text-white/30">
//           {currentTime.toFixed(2)}s
//         </p>
//       </div>
//     </div>
//   );
// }

// // ─── Inner shell ──────────────────────────────────────────────────────────────
// // All children share the single TimelineRoot context above them in the tree.

// function TimelineShell({
//   time,
//   isPlaying,
//   onPlayPause,
// }: {
//   time: number;
//   isPlaying: boolean;
//   onPlayPause: () => void;
// }) {
//   const { scrubTo } = useTimeline();

//   // Keep playhead in sync with the external play timer.
//   React.useEffect(() => {
//     scrubTo(time);
//   }, [time]); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <>
//       {/* Preview reads currentTime straight from context — no second root needed */}
//       <VideoPreview />

//       <TimelineControls isPlaying={isPlaying} onPlayPause={onPlayPause} />

//       <TimelineTrack label="📹 Video">
//         {VIDEO_CLIPS.map((c) => (
//           <TimelineClip key={c.id} start={c.start} end={c.end}>
//             <Clip label={c.label} color={c.color} />
//           </TimelineClip>
//         ))}
//       </TimelineTrack>

//       <TimelineTrack label="🎵 Audio">
//         {AUDIO_CLIPS.map((c) => (
//           <TimelineClip key={c.id} start={c.start} end={c.end}>
//             <Clip label={c.label} color={c.color} />
//           </TimelineClip>
//         ))}
//       </TimelineTrack>

//       <TimelineTrack label="💬 Text">
//         {TEXT_CLIPS.map((c) => (
//           <TimelineClip key={c.id} start={c.start} end={c.end}>
//             <Clip label={c.label} color={c.color} />
//           </TimelineClip>
//         ))}
//       </TimelineTrack>

//       <TimelineTrack label="✨ Effects">
//         {EFFECT_CLIPS.map((c) => (
//           <TimelineClip key={c.id} start={c.start} end={c.end}>
//             <Clip label={c.label} color={c.color} />
//           </TimelineClip>
//         ))}
//       </TimelineTrack>
//     </>
//   );
// }

// // ─── Demo ─────────────────────────────────────────────────────────────────────

// export function VideoTimelineDemo() {
//   const [isPlaying, setIsPlaying] = React.useState(false);
//   const [time, setTime] = React.useState(0);
//   const playRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

//   React.useEffect(() => {
//     if (isPlaying) {
//       playRef.current = setInterval(() => {
//         setTime((t) => {
//           if (t >= 28) {
//             setIsPlaying(false);
//             return 0;
//           }
//           return +(t + 0.05).toFixed(3);
//         });
//       }, 50);
//     } else {
//       if (playRef.current) clearInterval(playRef.current);
//     }
//     return () => {
//       if (playRef.current) clearInterval(playRef.current);
//     };
//   }, [isPlaying]);

//   return (
//     <div className="w-full max-w-3xl">
//       <TimelineRoot
//         duration={28}
//         config={{
//           defaultZoom: 38,
//           trackHeight: 40,
//           headerWidth: 100,
//           rulerHeight: 28,
//         }}
//         onTimeChange={(t) => {
//           setTime(t);
//           // setIsPlaying(false);
//         }}
//       >
//         <TimelineShell
//           time={time}
//           isPlaying={isPlaying}
//           onPlayPause={() => setIsPlaying((p) => !p)}
//         />
//       </TimelineRoot>
//     </div>
//   );
// }

// // ─── Keyframe data ────────────────────────────────────────────────────────────

// const KF = {
//   posX: [
//     { t: 0, v: 0 },
//     { t: 3, v: 120 },
//     { t: 6, v: 60 },
//     { t: 9, v: 180 },
//   ],
//   posY: [
//     { t: 0, v: 0 },
//     { t: 2, v: -40 },
//     { t: 5, v: 30 },
//     { t: 8, v: -20 },
//   ],
//   rotation: [
//     { t: 0, v: 0 },
//     { t: 4, v: 180 },
//     { t: 7, v: 90 },
//     { t: 10, v: 360 },
//   ],
//   scale: [
//     { t: 0, v: 1 },
//     { t: 3, v: 1.5 },
//     { t: 6, v: 0.8 },
//     { t: 9, v: 1.2 },
//   ],
//   opacity: [
//     { t: 0, v: 1 },
//     { t: 2, v: 0.3 },
//     { t: 5, v: 1 },
//     { t: 8, v: 0.6 },
//   ],
// };

// // ─── Math & Easing (Curve Mode) ───────────────────────────────────────────────

// function lerp(a: number, b: number, t: number): number {
//   return a + (b - a) * t;
// }

// // "Curve Mode": Smooth easing in and out for beautiful, natural animations
// function easeInOutCubic(t: number): number {
//   return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// }

// function valueAt(frames: { t: number; v: number }[], time: number): number {
//   if (!frames.length) return 0;
//   if (time <= frames[0].t) return frames[0].v;
//   if (time >= frames[frames.length - 1].t) return frames[frames.length - 1].v;

//   for (let i = 0; i < frames.length - 1; i++) {
//     if (time >= frames[i].t && time <= frames[i + 1].t) {
//       // Raw linear progress between these two keyframes (0.0 to 1.0)
//       const progress = (time - frames[i].t) / (frames[i + 1].t - frames[i].t);

//       // Apply the curve easing to the progress
//       const easedProgress = easeInOutCubic(progress);

//       return lerp(frames[i].v, frames[i + 1].v, easedProgress);
//     }
//   }
//   return 0;
// }

// // ─── Animated preview ─────────────────────────────────────────────────────────

// function AnimationPreview({ currentTime }: { currentTime: number }) {
//   const x = valueAt(KF.posX, currentTime);
//   const y = valueAt(KF.posY, currentTime);
//   const rot = valueAt(KF.rotation, currentTime);
//   const sc = valueAt(KF.scale, currentTime);
//   const op = valueAt(KF.opacity, currentTime);

//   return (
//     <div className="h-48 rounded-md border border-border bg-background flex items-center justify-center overflow-hidden relative shadow-inner">
//       <div className="absolute top-3 left-4 flex items-center gap-2">
//         <span className="relative flex h-2 w-2">
//           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
//           <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
//         </span>
//         <p className="text-xs font-mono text-muted-foreground">
//           Render Preview
//         </p>
//       </div>

//       <p className="absolute bottom-3 right-4 text-xs font-mono text-muted-foreground/50">
//         {currentTime.toFixed(2)}s
//       </p>

//       {/* Crosshair background for scale reference */}
//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
//         <div className="w-full h-px bg-foreground" />
//         <div className="h-full w-px bg-foreground absolute" />
//       </div>

//       <div
//         style={{
//           transform: `translate(${x * 0.5}px, ${y * 0.5}px) rotate(${rot}deg) scale(${sc})`,
//           opacity: op,
//           // Hardware acceleration
//           willChange: "transform, opacity",
//         }}
//         className="w-16 h-16 rounded-xl bg-primary shadow-lg border border-primary/50 flex items-center justify-center backdrop-blur-sm"
//       >
//         <div className="w-3 h-3 rounded-full bg-primary-foreground/50" />
//       </div>
//     </div>
//   );
// }

// // ─── Keyframe track ───────────────────────────────────────────────────────────

// function KFTrack({
//   label,
//   frames,
//   color,
// }: {
//   label: string;
//   frames: { t: number; v: number }[];
//   color: string;
// }) {
//   return (
//     <TimelineTrack label={label} height={38}>
//       {/* Lane line connecting keyframes */}
//       <div className="absolute top-1/2 left-0 right-0 h-px bg-border/40 -translate-y-px pointer-events-none" />

//       {frames.map((f, i) => (
//         <TimelineKeyframe key={i} time={f.t}>
//           <Tooltip>
//             <TooltipTrigger>
//               <div
//                 className={cn(
//                   "w-2.5 h-2.5 rotate-45 rounded-[2px] border transition-transform hover:scale-150 hover:z-10",
//                   color,
//                 )}
//               />
//             </TooltipTrigger>
//             <TooltipContent side="top" className="font-mono text-xs">
//               <div className="flex items-center gap-2">
//                 <div
//                   className={cn(
//                     "w-2 h-2 rounded-full",
//                     color.split(" ")[0].replace("/40", ""),
//                   )}
//                 />
//                 <span>
//                   {f.t}s :{" "}
//                   <span className="font-bold text-foreground">{f.v}</span>
//                 </span>
//               </div>
//             </TooltipContent>
//           </Tooltip>
//         </TimelineKeyframe>
//       ))}
//     </TimelineTrack>
//   );
// }

// // ─── Inner component (Syncs with Timeline Context) ───────────────────────────

// function SequenceInner({
//   time,
//   isPlaying,
//   onPlayPause,
// }: {
//   time: number;
//   isPlaying: boolean;
//   onPlayPause: () => void;
// }) {
//   const { scrubTo } = useTimeline();

//   // Physically moves the timeline playhead to match the external loop time
//   React.useEffect(() => {
//     scrubTo(time);
//   }, [time, scrubTo]);

//   return (
//     <>
//       <TimelineControls isPlaying={isPlaying} onPlayPause={onPlayPause} />
//       <KFTrack
//         label="X Position"
//         frames={KF.posX}
//         color="bg-blue-500/80 border-blue-300"
//       />
//       <KFTrack
//         label="Y Position"
//         frames={KF.posY}
//         color="bg-emerald-500/80 border-emerald-300"
//       />
//       <KFTrack
//         label="Rotation"
//         frames={KF.rotation}
//         color="bg-violet-500/80 border-violet-300"
//       />
//       <KFTrack
//         label="Scale"
//         frames={KF.scale}
//         color="bg-amber-500/80 border-amber-300"
//       />
//       <KFTrack
//         label="Opacity"
//         frames={KF.opacity}
//         color="bg-rose-500/80 border-rose-300"
//       />
//     </>
//   );
// }

// // ─── Demo Application ─────────────────────────────────────────────────────────

// export function SequenceTimelineDemo() {
//   const [isPlaying, setIsPlaying] = React.useState(false);
//   const [currentTime, setCurrentTime] = React.useState(0);

//   const requestRef = React.useRef<number | null>(null);
//   const previousTimeRef = React.useRef<number | null>(null);
//   const timeRef = React.useRef(currentTime);

//   const duration = 10;

//   // Keep ref up to date so the animation loop can read the latest value without dependency issues
//   timeRef.current = currentTime;

//   function handlePlayPause() {
//     // If we're at the end of the timeline and click play, start from beginning
//     if (!isPlaying && currentTime >= duration) {
//       setCurrentTime(0);
//     }
//     setIsPlaying((p) => !p);
//   }

//   // Pure requestAnimationFrame loop for ultra-smooth 60fps playback
//   React.useEffect(() => {
//     const updatePlayback = (timestamp: number) => {
//       if (previousTimeRef.current !== null) {
//         const deltaTime = (timestamp - previousTimeRef.current) / 1000;
//         const nextTime = timeRef.current + deltaTime;

//         if (nextTime >= duration) {
//           setCurrentTime(duration);
//           setIsPlaying(false);
//           previousTimeRef.current = null;
//           return;
//         }

//         setCurrentTime(nextTime);
//       }

//       previousTimeRef.current = timestamp;
//       requestRef.current = requestAnimationFrame(updatePlayback);
//     };

//     if (isPlaying) {
//       requestRef.current = requestAnimationFrame(updatePlayback);
//     } else {
//       if (requestRef.current) cancelAnimationFrame(requestRef.current);
//       previousTimeRef.current = null;
//     }

//     return () => {
//       if (requestRef.current) cancelAnimationFrame(requestRef.current);
//     };
//   }, [isPlaying, duration]);

//   return (
//     <div className="flex flex-col gap-4 w-full max-w-3xl">
//       <AnimationPreview currentTime={currentTime} />

//       <TimelineRoot
//         duration={duration}
//         config={{
//           defaultZoom: 80,
//           trackHeight: 38,
//           headerWidth: 110,
//           rulerHeight: 28,
//         }}
//         // If the user manually clicks/drags the playhead, pause playback and jump to time
//         onTimeChange={(t) => {
//           setCurrentTime(t);
//           // setIsPlaying(false);
//         }}
//         className="bg-background rounded-xl border border-border shadow"
//       >
//         <SequenceInner
//           time={currentTime}
//           isPlaying={isPlaying}
//           onPlayPause={handlePlayPause}
//         />
//       </TimelineRoot>
//     </div>
//   );
// }

export function VideoTimelineDemo() {
  return (
    <TimelineRoot
      config={{
        duration: 60,
        pixelsPerSecond: 80,
        snapToGrid: true,
        snapInterval: 0.5,
      }}
      tracks={[
        {
          id: "video",
          label: "Video",
          clips: [
            {
              id: "c1",
              trackId: "video",
              start: 0,
              duration: 10,
              label: "Intro",
              color: "#c2f13c",
            },
          ],
        },
        {
          id: "audio",
          label: "Audio",
          clips: [
            {
              id: "c2",
              trackId: "audio",
              start: 2,
              duration: 30,
              label: "Music",
              color: "#60a5fa",
            },
          ],
        },
      ]}
    />
  );
}
