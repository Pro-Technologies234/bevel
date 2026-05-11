// ─── Hex ↔ RGB ────────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

// ─── RGB ↔ HSV ────────────────────────────────────────────────────────────────
// Used internally for the 2D picker (HSV maps cleanly to the canvas axes)

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [
    Math.round(h * 360),
    Math.round(max === 0 ? 0 : (d / max) * 100),
    Math.round(max * 100),
  ];
}

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  s /= 100; v /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) =>
    v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

export function hexToHsv(hex: string): [number, number, number] {
  return rgbToHsv(...hexToRgb(hex));
}

export function hsvToHex(h: number, s: number, v: number): string {
  return rgbToHex(...hsvToRgb(h, s, v));
}

// ─── HSL (for export display) ─────────────────────────────────────────────────

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// ─── Contrast ─────────────────────────────────────────────────────────────────

export function getContrastColor(hex: string): "#000000" | "#ffffff" {
  const [r, g, b] = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#000000" : "#ffffff";
}

// ─── Normalize hex input ──────────────────────────────────────────────────────

export function normalizeHex(raw: string): string | null {
  const h = raw.trim().replace(/^#/, "");
  if (h.length === 3) {
    const expanded = h.split("").map((c) => c + c).join("");
    return `#${expanded.toLowerCase()}`;
  }
  if (h.length === 6 && /^[0-9a-fA-F]{6}$/.test(h)) {
    return `#${h.toLowerCase()}`;
  }
  return null;
}

// ─── Export formatters ────────────────────────────────────────────────────────

export function toHslString(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function toRgbString(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}