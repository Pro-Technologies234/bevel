import { useVisualizerCtx } from "./visualizer-context";

/**
 * Call from anywhere under <AudioVisualizerRoot> to connect a source and control
 * playback of the visualization itself (independent from the audio's own play state).
 */
export function useAudioVisualizer() {
  const ctx = useVisualizerCtx();
  return {
    isRunning: ctx.isRunning,
    mode: ctx.mode,
    config: ctx.config,
    connect: ctx.engine.connect,
    disconnect: ctx.engine.disconnect,
    start: ctx.engine.start,
    stop: ctx.engine.stop,
    setMode: ctx.engine.setMode,
    setConfig: ctx.engine.setConfig,
    resume: ctx.engine.resume,
  };
}
