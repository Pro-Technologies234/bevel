"use client";

import * as React from "react";
import {
  IconPlus,
  IconTrash,
  IconVolume,
  IconMovie,
  IconToggleLeft,
  IconLock,
  IconLockOpen,
  IconEye,
  IconEyeOff,
  IconSettings,
} from "@tabler/icons-react";

// Bevel UI Primitives
import { TimelineRoot } from "@/components/bevelui/timeline/timeline-root";
import { TimelineContent } from "@/components/bevelui/timeline/timeline-content";
import { TimelineControls } from "@/components/bevelui/timeline/timeline-controls";
import { TimelineTrack } from "@/components/bevelui/timeline/timeline-track";
import { TimelineClip } from "@/components/bevelui/timeline/timeline-clip";
import { TimelineKeyframe } from "@/components/bevelui/timeline/timeline-keyframe";

// Component State Interfaces
interface ClipData {
  id: string;
  name: string;
  start: number;
  end: number;
  color: string;
}

interface TrackData {
  id: string;
  name: string;
  type: "animation" | "activation" | "audio";
  locked: boolean;
  muted: boolean;
  clips: ClipData[];
}

const INITIAL_TRACKS: TrackData[] = [
  {
    id: "track-1",
    name: "Main Camera Track",
    type: "animation",
    locked: false,
    muted: false,
    clips: [
      {
        id: "clip-1",
        name: "Intro_Pan",
        start: 1.0,
        end: 4.5,
        color: "bg-sky-500/20 border-sky-400 text-sky-300",
      },
      {
        id: "clip-2",
        name: "CloseUp_Look",
        start: 5.0,
        end: 9.0,
        color: "bg-indigo-500/20 border-indigo-400 text-indigo-300",
      },
    ],
  },
  {
    id: "track-2",
    name: "Player Activation",
    type: "activation",
    locked: false,
    muted: false,
    clips: [
      {
        id: "clip-3",
        name: "Active State",
        start: 2.0,
        end: 8.5,
        color: "bg-emerald-500/20 border-emerald-400 text-emerald-300",
      },
    ],
  },
  {
    id: "track-3",
    name: "Background Theme",
    type: "audio",
    locked: false,
    muted: true,
    clips: [
      {
        id: "clip-4",
        name: "Ambient_Loop.wav",
        start: 0.0,
        end: 7.0,
        color: "bg-amber-500/20 border-amber-400 text-amber-300",
      },
    ],
  },
];

export default function UnityTimelineApp() {
  const [tracks, setTracks] = React.useState<TrackData[]>(INITIAL_TRACKS);
  const [selectedTrackId, setSelectedTrackId] = React.useState<string | null>(
    null,
  );
  const [selectedClipId, setSelectedClipId] = React.useState<string | null>(
    null,
  );
  const [timelineDuration, setTimelineDuration] = React.useState(12);

  // Computed selections
  const activeTrack = tracks.find((t) => t.id === selectedTrackId) || null;
  const activeClip =
    tracks.flatMap((t) => t.clips).find((c) => c.id === selectedClipId) || null;
  const activeClipTrack =
    tracks.find((t) => t.clips.some((c) => c.id === selectedClipId)) || null;

  // Track actions
  const addTrack = (type: "animation" | "activation" | "audio") => {
    const newTrack: TrackData = {
      id: `track-${Date.now()}`,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Track`,
      type,
      locked: false,
      muted: false,
      clips: [],
    };
    setTracks([...tracks, newTrack]);
    setSelectedTrackId(newTrack.id);
    setSelectedClipId(null);
  };

  const deleteTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTracks(tracks.filter((t) => t.id !== trackId));
    if (selectedTrackId === trackId) setSelectedTrackId(null);
    if (activeClipTrack?.id === trackId) setSelectedClipId(null);
  };

  const toggleTrackLock = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTracks(
      tracks.map((t) => (t.id === trackId ? { ...t, locked: !t.locked } : t)),
    );
  };

  const toggleTrackMute = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTracks(
      tracks.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t)),
    );
  };

  // Clip Actions
  const addClipToTrack = (trackId: string) => {
    setTracks(
      tracks.map((t) => {
        if (t.id !== trackId) return t;
        const endPos = Math.min(timelineDuration, 3);
        const newClip: ClipData = {
          id: `clip-${Date.now()}`,
          name: "New Clip",
          start: 0,
          end: endPos,
          color:
            t.type === "animation"
              ? "bg-sky-500/20 border-sky-400 text-sky-300"
              : t.type === "activation"
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "bg-amber-500/20 border-amber-400 text-amber-300",
        };
        return { ...t, clips: [...t.clips, newClip] };
      }),
    );
  };

  const handleClipMove = (
    trackId: string,
    clipId: string,
    nextStart: number,
    nextEnd: number,
  ) => {
    setTracks(
      tracks.map((t) => {
        if (t.id !== trackId) return t;
        return {
          ...t,
          clips: t.clips.map((c) =>
            c.id === clipId ? { ...c, start: nextStart, end: nextEnd } : c,
          ),
        };
      }),
    );
  };

  const updateSelectedClipTimes = (field: "start" | "end", value: number) => {
    if (!selectedClipId || !activeClipTrack) return;
    setTracks(
      tracks.map((t) => {
        if (t.id !== activeClipTrack.id) return t;
        return {
          ...t,
          clips: t.clips.map((c) => {
            if (c.id !== selectedClipId) return c;
            let ns = field === "start" ? value : c.start;
            let ne = field === "end" ? value : c.end;

            if (ns < 0) ns = 0;
            if (ne > timelineDuration) ne = timelineDuration;
            if (ns >= ne) ne = ns + 0.1;

            return { ...c, start: ns, end: ne };
          }),
        };
      }),
    );
  };

  const deleteSelectedClip = () => {
    if (!selectedClipId || !activeClipTrack) return;
    setTracks(
      tracks.map((t) => {
        if (t.id !== activeClipTrack.id) return t;
        return { ...t, clips: t.clips.filter((c) => c.id !== selectedClipId) };
      }),
    );
    setSelectedClipId(null);
  };

  const getTrackIcon = (type: TrackData["type"]) => {
    switch (type) {
      case "animation":
        return <IconMovie size={12} />;
      case "activation":
        return <IconToggleLeft size={12} />;
      case "audio":
        return <IconVolume size={12} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#1c1c1c] text-neutral-200 antialiased overflow-hidden font-sans select-none text-xs">
      {/* LEFT PANEL: Workspace Structure hierarchy */}
      <div className="w-56 border-r border-neutral-800 flex flex-col bg-[#242424] shrink-0">
        <div className="h-9 border-b border-neutral-800 flex items-center px-3 font-semibold text-neutral-400 bg-[#2a2a2a] gap-1.5">
          <IconSettings size={13} className="text-neutral-500" />
          <span>Timeline Hierarchy</span>
        </div>

        {/* Track Generators */}
        <div className="p-2 border-b border-neutral-800 bg-[#202020] flex flex-col gap-1">
          <span className="text-[10px] text-neutral-500 font-bold tracking-wider uppercase px-1 mb-1">
            Add Track Sequence
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => addTrack("animation")}
              className="bg-[#2d2d2d] hover:bg-[#383838] border border-neutral-700/80 rounded py-1 px-1.5 text-[10px] text-center font-medium transition-colors"
            >
              Animation
            </button>
            <button
              onClick={() => addTrack("activation")}
              className="bg-[#2d2d2d] hover:bg-[#383838] border border-neutral-700/80 rounded py-1 px-1.5 text-[10px] text-center font-medium transition-colors"
            >
              Activation
            </button>
            <button
              onClick={() => addTrack("audio")}
              className="bg-[#2d2d2d] hover:bg-[#383838] border border-neutral-700/80 rounded py-1 px-1.5 text-[10px] text-center font-medium transition-colors"
            >
              Audio
            </button>
          </div>
        </div>

        {/* Flat Track Listing for instant selection */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => {
                setSelectedTrackId(track.id);
                setSelectedClipId(null);
              }}
              className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${selectedTrackId === track.id && !selectedClipId ? "bg-primary/10 border border-primary/20 text-white font-medium" : "hover:bg-[#2d2d2d] text-neutral-400"}`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {getTrackIcon(track.type)}
                <span className="truncate text-[11px]">{track.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addClipToTrack(track.id);
                }}
                className="p-0.5 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded"
                title="Add Clip segment"
              >
                <IconPlus size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER AREA: Master Timeline Orchestrator */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1b1b1b]">
        <TimelineRoot
          duration={timelineDuration}
          config={{
            defaultZoom: 90,
            trackHeight: 40,
            headerWidth: 160,
            rulerHeight: 28,
            snapToGrid: true,
            snapInterval: 0.1,
          }}
        >
          {/* Timeline Transport Action Header Row */}
          <div className="h-9 border-b border-neutral-800 bg-[#2a2a2a] px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <TimelineControls />
              <div className="flex items-center gap-2 border-l border-neutral-700 pl-4">
                <span className="text-[10px] font-mono text-neutral-500">
                  Duration
                </span>
                <input
                  type="number"
                  value={timelineDuration}
                  onChange={(e) =>
                    setTimelineDuration(Math.max(1, Number(e.target.value)))
                  }
                  className="bg-[#202020] border border-neutral-700/80 rounded w-12 text-center text-[11px] h-5 font-mono font-medium focus:outline-none focus:border-primary/50 text-neutral-300"
                />
                <span className="text-[10px] font-mono text-neutral-500">
                  s
                </span>
              </div>
            </div>

            <div className="text-[10px] font-mono bg-[#1f1f1f] text-neutral-400 px-2 py-0.5 rounded border border-neutral-800/80 shadow-inner">
              Unity Sequencing Context Engine
            </div>
          </div>

          {/* Interactive Content Sheet Viewport */}
          <div className="flex-1 overflow-hidden p-3">
            <TimelineContent className="h-full border-neutral-800 bg-[#1e1e1e]">
              {tracks.map((track) => (
                <TimelineTrack
                  key={track.id}
                  title={track.name}
                  icon={getTrackIcon(track.type)}
                  selected={selectedTrackId === track.id && !selectedClipId}
                  onSelect={() => {
                    setSelectedTrackId(track.id);
                    setSelectedClipId(null);
                  }}
                  actions={
                    <div className="flex items-center gap-0.5 bg-[#1a1a1a]/80 p-0.5 rounded border border-neutral-800">
                      <button
                        onClick={(e) => toggleTrackMute(track.id, e)}
                        className={`p-0.5 rounded transition-colors ${track.muted ? "text-red-400 bg-red-500/10" : "text-neutral-500 hover:text-neutral-300"}`}
                      >
                        {track.muted ? (
                          <IconEyeOff size={10} />
                        ) : (
                          <IconEye size={10} />
                        )}
                      </button>
                      <button
                        onClick={(e) => toggleTrackLock(track.id, e)}
                        className={`p-0.5 rounded transition-colors ${track.locked ? "text-amber-400 bg-amber-500/10" : "text-neutral-500 hover:text-neutral-300"}`}
                      >
                        {track.locked ? (
                          <IconLock size={10} />
                        ) : (
                          <IconLockOpen size={10} />
                        )}
                      </button>
                      <button
                        onClick={(e) => deleteTrack(track.id, e)}
                        className="p-0.5 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/15"
                      >
                        <IconTrash size={10} />
                      </button>
                    </div>
                  }
                >
                  {/* Render track clips inside this lane */}
                  {track.clips.map((clip) => (
                    <TimelineClip
                      key={clip.id}
                      start={clip.start}
                      end={clip.end}
                      locked={track.locked}
                      onMove={(ns, ne) =>
                        handleClipMove(track.id, clip.id, ns, ne)
                      }
                      className={`border px-2 flex flex-col justify-center transition-all cursor-grab rounded-sm shadow-md ${clip.color} ${selectedClipId === clip.id ? "ring-1 ring-primary/80 border-white/40 shadow-primary/5" : ""}`}
                    >
                      <div
                        className="w-full h-full flex items-center"
                        onPointerDown={(e) => {
                          e.stopPropagation(); // Select target clip without clearing context
                          setSelectedClipId(clip.id);
                          setSelectedTrackId(track.id);
                        }}
                      >
                        <span className="text-[10px] font-medium tracking-wide truncate select-none pointer-events-none">
                          {clip.name}
                        </span>
                      </div>
                    </TimelineClip>
                  ))}
                </TimelineTrack>
              ))}
            </TimelineContent>
          </div>
        </TimelineRoot>
      </div>

      {/* RIGHT SIDEBAR: Properties Inspector (Unity-style) */}
      <div className="w-64 border-l border-neutral-800 flex flex-col bg-[#242424] shrink-0">
        <div className="h-9 border-b border-neutral-800 flex items-center px-3 font-semibold text-neutral-400 bg-[#2a2a2a]">
          <span>Inspector</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Scenario A: Clip Selection Rules */}
          {selectedClipId && activeClip ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                <span className="font-bold text-[11px] text-primary tracking-wider uppercase">
                  Timeline Clip
                </span>
                <button
                  onClick={deleteSelectedClip}
                  className="flex items-center gap-1 text-[10px] text-red-400 hover:bg-red-500/10 px-1.5 py-0.5 rounded transition-colors"
                >
                  <IconTrash size={11} /> Remove
                </button>
              </div>

              {/* Inline Property Editor Field rows */}
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-neutral-500 block mb-0.5 font-medium">
                    Display Label
                  </label>
                  <input
                    type="text"
                    value={activeClip.name}
                    onChange={(e) => {
                      const updatedName = e.target.value;
                      setTracks(
                        tracks.map((t) =>
                          t.id === activeClipTrack?.id
                            ? {
                                ...t,
                                clips: t.clips.map((c) =>
                                  c.id === selectedClipId
                                    ? { ...c, name: updatedName }
                                    : c,
                                ),
                              }
                            : t,
                        ),
                      );
                    }}
                    className="w-full bg-[#1e1e1e] border border-neutral-700/80 rounded px-2 py-1 text-[11px] text-neutral-200 focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-0.5 font-medium">
                      Start Time
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={Number(activeClip.start.toFixed(2))}
                      onChange={(e) =>
                        updateSelectedClipTimes(
                          "start",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-full bg-[#1e1e1e] border border-neutral-700/80 rounded px-2 py-0.5 text-[11px] font-mono text-neutral-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-0.5 font-medium">
                      End Time
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={Number(activeClip.end.toFixed(2))}
                      onChange={(e) =>
                        updateSelectedClipTimes(
                          "end",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-full bg-[#1e1e1e] border border-neutral-700/80 rounded px-2 py-0.5 text-[11px] font-mono text-neutral-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[10px] text-neutral-500 block mb-0.5 font-medium">
                    Duration
                  </label>
                  <div className="w-full bg-[#1a1a1a] border border-neutral-800 text-neutral-400 rounded px-2 py-1 text-[11px] font-mono">
                    {(activeClip.end - activeClip.start).toFixed(2)}s
                  </div>
                </div>
              </div>
            </div>
          ) : selectedTrackId && activeTrack ? (
            /* Scenario B: Track Selection Rules */
            <div className="space-y-3">
              <div className="border-b border-neutral-800 pb-1.5">
                <span className="font-bold text-[11px] text-neutral-400 tracking-wider uppercase">
                  Track Configuration
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-neutral-500 block mb-0.5 font-medium">
                    Track Name
                  </label>
                  <input
                    type="text"
                    value={activeTrack.name}
                    onChange={(e) => {
                      const updatedName = e.target.value;
                      setTracks(
                        tracks.map((t) =>
                          t.id === selectedTrackId
                            ? { ...t, name: updatedName }
                            : t,
                        ),
                      );
                    }}
                    className="w-full bg-[#1e1e1e] border border-neutral-700/80 rounded px-2 py-1 text-[11px] text-neutral-200 focus:outline-none"
                  />
                </div>

                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between items-center bg-[#1e1e1e] px-2 py-1 rounded border border-neutral-800/60">
                    <span className="text-[11px] text-neutral-400">
                      Track Pipeline Type
                    </span>
                    <span className="text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300 capitalize">
                      {activeTrack.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#1e1e1e] px-2 py-1 rounded border border-neutral-800/60">
                    <span className="text-[11px] text-neutral-400">
                      Total Clip Layers
                    </span>
                    <span className="text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                      {activeTrack.clips.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Scenario C: No Active Target selection */
            <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-neutral-800 rounded">
              <span className="text-neutral-500 text-[11px] font-medium">
                No Track or Clip Selected
              </span>
              <span className="text-neutral-600 text-[10px] mt-0.5">
                Click a clip body or a track entry header to inspector
                parameters.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
