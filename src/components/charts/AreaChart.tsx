import React from "react";
import type { DataPoint } from "@/components/charts/LineChart";

export function computeAreaPath(points: DataPoint[], width: number, height: number, pad = 16) {
  if (points.length === 0) return "";
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0;
  const maxY = Math.max(1, Math.max(...ys));
  const sx = (x: number) => pad + ((x - minX) / (maxX - minX || 1)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - minY) / (maxY - minY || 1)) * (height - pad * 2);
  const top = points.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x)},${sy(p.y)}`).join(" ");
  const bottom = `L${sx(points[points.length - 1].x)},${sy(0)} L${sx(points[0].x)},${sy(0)} Z`;
  return top + " " + bottom;
}

export function AreaChart({ points, width = 320, height = 120 }: { points: DataPoint[]; width?: number; height?: number }) {
  const d = computeAreaPath(points, width, height);
  return (
    <svg width={width} height={height} role="img" aria-label="area chart">
      <path d={d} fill="currentColor" opacity={0.2} />
      <path d={d.replace(/Z$/, "")} fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

