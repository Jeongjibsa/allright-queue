import React from "react";

export type DataPoint = { x: number; y: number };

export function computeLinePath(points: DataPoint[], width: number, height: number, pad = 16) {
  if (points.length === 0) return "";
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0; // baseline at zero
  const maxY = Math.max(1, Math.max(...ys));

  const sx = (x: number) => pad + ((x - minX) / (maxX - minX || 1)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - minY) / (maxY - minY || 1)) * (height - pad * 2);

  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`)
    .join(" ");
}

export function LineChart({ points, width = 320, height = 120 }: { points: DataPoint[]; width?: number; height?: number }) {
  const d = computeLinePath(points, width, height);
  return (
    <svg width={width} height={height} role="img" aria-label="line chart">
      <path d={d} fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

