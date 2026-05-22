/**
 * TimelineEngine — the hot path.
 *
 * This is the motion.dev trick: a vanilla JS object that owns animation state
 * and writes directly to the DOM. React never sees these updates.
 *
 * What lives here (bypasses React):
 *   - currentTime
 *   - playhead position (CSS var --tl-playhead on container)
 *   - pixelsPerSecond / zoom (CSS var --tl-pps on container)
 *   - clip positions during drag (direct style.transform)
 *
 * What lives in React state:
 *   - tracks/clips structure
 *   - isPlaying (triggers RAF loop start/stop)
 *   - selectedClipId
 */
export class TimelineEngine {
  private _currentTime = 0;
  private _duration: number;
  private _pxPerSec: number;
  private _rafId = 0;
  private _lastTimestamp = 0;
  private _container: HTMLElement | null = null;
  private _playheadEl: HTMLElement | null = null;
  private _onPlayEnd: (() => void) | null = null;
  private _onTimeUpdate: ((t: number) => void | null) | null = null;

  constructor(duration: number, pxPerSec: number) {
    this._duration = duration;
    this._pxPerSec = pxPerSec;
  }

  // ── Registration (called by React components via ref) ──────────────────

  setContainer(el: HTMLElement | null) {
    this._container = el;
    if (el) this._writeCssVars();
  }

  setPlayheadEl(el: HTMLElement | null) {
    this._playheadEl = el;
    if (el) this._writePlayhead();
  }

  onPlayEnd(fn: () => void) {
    this._onPlayEnd = fn;
  }
  // 2. Add registration method
  onTimeUpdate(fn: (t: number) => void | null) {
    this._onTimeUpdate = fn;
  }
  // ── Current time (direct DOM write) ───────────────────────────────────

  get currentTime() {
    return this._currentTime;
  }

  seek(t: number) {
    this._currentTime = Math.max(0, Math.min(t, this._duration));
    this._onTimeUpdate?.(this._currentTime);
    this._writePlayhead();
  }

  // ── Zoom (direct DOM write, all clips reposition via CSS) ──────────────

  get pxPerSec() {
    return this._pxPerSec;
  }

  setZoom(pps: number) {
    this._pxPerSec = pps;
    this._writeCssVars();
  }

  setDuration(d: number) {
    this._duration = d;
    this._writeCssVars();
  }

  // ── Playback (RAF loop, never touches React) ───────────────────────────

  play() {
    if (this._rafId) return;
    if (this._currentTime >= this._duration) this._currentTime = 0;
    this._lastTimestamp = performance.now();
    this._tick(this._lastTimestamp);
  }

  pause() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
  }

  get isRunning() {
    return this._rafId !== 0;
  }

  private _tick = (now: number) => {
    const delta = (now - this._lastTimestamp) / 1000;
    this._lastTimestamp = now;
    this._currentTime = Math.min(this._currentTime + delta, this._duration);
    this._writePlayhead();
    // 3. Fire update on every animation frame
    this._onTimeUpdate?.(this._currentTime);

    if (this._currentTime < this._duration) {
      this._rafId = requestAnimationFrame(this._tick);
    } else {
      this._rafId = 0;
      this._onPlayEnd?.();
    }
  };

  // ── DOM writes — no React involved ────────────────────────────────────

  private _writePlayhead() {
    const x = this._currentTime * this._pxPerSec;
    if (this._playheadEl) {
      this._playheadEl.style.transform = `translateX(${x}px)`;
    }
    this._container?.style.setProperty(
      "--tl-current",
      String(this._currentTime),
    );
  }

  private _writeCssVars() {
    if (!this._container) return;
    this._container.style.setProperty("--tl-pps", String(this._pxPerSec));
    this._container.style.setProperty("--tl-duration", String(this._duration));
    // Timeline total width = duration * pxPerSec
    this._container.style.setProperty(
      "--tl-width",
      `${this._duration * this._pxPerSec}px`,
    );
  }

  destroy() {
    this.pause();
  }
}
