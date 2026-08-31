import type {
  VisualizerConfig,
  VisualizerEngine,
  VisualizerMode,
  VisualizerSource,
} from "./types";

const DEFAULT_CONFIG: Required<VisualizerConfig> = {
  mode: "bars",
  fftSize: 256,
  smoothingTimeConstant: 0.8,
  barCount: 48,
  gapRatio: 0.3,
  color: "#c2f13c",
  colorStops: [],
  backgroundColor: "transparent",
  lineWidth: 2,
  circularRadiusRatio: 0.35,
};

// createMediaElementSource() throws if called twice on the same element, so we
// cache the source node per element rather than trying to recreate it on reconnect.
const mediaElementSourceCache = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();

export function createVisualizerEngine(configInput: VisualizerConfig = {}): VisualizerEngine {
  let config: Required<VisualizerConfig> = { ...DEFAULT_CONFIG, ...configInput };

  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let sourceNode: AudioNode | null = null;
  let canvasEl: HTMLCanvasElement | null = null;

  let running = false;
  let rafId: number | null = null;
  let freqData: Uint8Array<ArrayBuffer> | null = null;
  let timeData: Uint8Array<ArrayBuffer> | null = null;

  const listeners = new Set<() => void>();
  function notify() {
    listeners.forEach((l) => l());
  }

  function ensureContext() {
    if (audioContext) return;
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = config.fftSize;
    analyser.smoothingTimeConstant = config.smoothingTimeConstant;
    freqData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    timeData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
  }

  function resolveColorStyle(ctx: CanvasRenderingContext2D, height: number): string | CanvasGradient {
    if (config.colorStops.length > 0) {
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      config.colorStops.forEach((s) => gradient.addColorStop(s.offset, s.color));
      return gradient;
    }
    return config.color;
  }

  function drawBars(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (!analyser || !freqData) return;
    analyser.getByteFrequencyData(freqData);

    const barCount = Math.min(config.barCount, freqData.length);
    const binsPerBar = Math.floor(freqData.length / barCount) || 1;
    const barWidth = w / barCount;
    const gap = barWidth * config.gapRatio;

    ctx.fillStyle = resolveColorStyle(ctx, h);
    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < binsPerBar; j++) sum += freqData[i * binsPerBar + j] ?? 0;
      const avg = sum / binsPerBar / 255;
      const barHeight = avg * h;
      const x = i * barWidth + gap / 2;
      ctx.fillRect(x, h - barHeight, barWidth - gap, barHeight);
    }
  }

  function drawWave(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (!analyser || !timeData) return;
    analyser.getByteTimeDomainData(timeData);

    ctx.strokeStyle = resolveColorStyle(ctx, h);
    ctx.lineWidth = config.lineWidth;
    ctx.beginPath();

    const step = w / timeData.length;
    for (let i = 0; i < timeData.length; i++) {
      const v = timeData[i] / 128 - 1; // -1..1
      const y = h / 2 + v * (h / 2);
      const x = i * step;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function drawCircular(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (!analyser || !freqData) return;
    analyser.getByteFrequencyData(freqData);

    const cx = w / 2;
    const cy = h / 2;
    const baseRadius = Math.min(w, h) * config.circularRadiusRatio;
    const barCount = Math.min(config.barCount, freqData.length);
    const binsPerBar = Math.floor(freqData.length / barCount) || 1;

    ctx.strokeStyle = resolveColorStyle(ctx, h);
    ctx.lineWidth = config.lineWidth;

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < binsPerBar; j++) sum += freqData[i * binsPerBar + j] ?? 0;
      const avg = sum / binsPerBar / 255;
      const angle = (i / barCount) * Math.PI * 2;
      const len = avg * baseRadius;

      const x1 = cx + Math.cos(angle) * baseRadius;
      const y1 = cy + Math.sin(angle) * baseRadius;
      const x2 = cx + Math.cos(angle) * (baseRadius + len);
      const y2 = cy + Math.sin(angle) * (baseRadius + len);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function draw() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const w = canvasEl.width;
    const h = canvasEl.height;

    if (config.backgroundColor === "transparent") {
      ctx.clearRect(0, 0, w, h);
    } else {
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    if (config.mode === "bars") drawBars(ctx, w, h);
    else if (config.mode === "wave") drawWave(ctx, w, h);
    else drawCircular(ctx, w, h);
  }

  function loop() {
    if (!running) return;
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function connect(source: VisualizerSource) {
    ensureContext();
    if (!audioContext || !analyser) return;

    disconnect();

    if (source instanceof AudioBuffer) {
      const node = audioContext.createBufferSource();
      node.buffer = source;
      node.connect(analyser);
      node.connect(audioContext.destination);
      node.start();
      sourceNode = node;
    } else if (typeof MediaStream !== "undefined" && source instanceof MediaStream) {
      const node = audioContext.createMediaStreamSource(source);
      node.connect(analyser);
      // Deliberately not connected to destination — avoids feedback/echo for mic input.
      sourceNode = node;
    } else {
      const el = source as HTMLMediaElement;
      let node = mediaElementSourceCache.get(el);
      if (!node) {
        node = audioContext.createMediaElementSource(el);
        mediaElementSourceCache.set(el, node);
      }
      node.connect(analyser);
      node.connect(audioContext.destination);
      sourceNode = node;
    }
  }

  function disconnect() {
    sourceNode?.disconnect();
    sourceNode = null;
  }

  function start() {
    if (running) return;
    running = true;
    notify();
    loop();
  }

  function stop() {
    running = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    notify();
  }

  function setMode(mode: VisualizerMode) {
    config = { ...config, mode };
    notify();
  }

  function setConfig(patch: Partial<VisualizerConfig>) {
    config = { ...config, ...patch };
    if (analyser) {
      if (patch.fftSize !== undefined) {
        analyser.fftSize = patch.fftSize;
        freqData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
        timeData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
      }
      if (patch.smoothingTimeConstant !== undefined) {
        analyser.smoothingTimeConstant = patch.smoothingTimeConstant;
      }
    }
    notify();
  }

  return {
    connect,
    disconnect,
    start,
    stop,
    setMode,
    setConfig,
    isRunning: () => running,
    getMode: () => config.mode,

    attachCanvas: (el) => {
      canvasEl = el;
    },

    resume: async () => {
      if (audioContext?.state === "suspended") await audioContext.resume();
    },

    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy: () => {
      stop();
      disconnect();
      audioContext?.close();
      audioContext = null;
      analyser = null;
      listeners.clear();
    },
  };
}
