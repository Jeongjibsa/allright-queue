import React from "react";

export type BarDatum = { x: number; y: number };

export function computeBars(data: BarDatum[], width: number, height: number, pad = 16) {
  const maxY = Math.max(1, ...data.map((d) => d.y));
  const barW = (width - pad * 2) / Math.max(1, data.length);
  return data.map((d, i) => {
    const x = pad + i * barW;
    const h = ((d.y / maxY) * (height - pad * 2)) | 0;
    const y = height - pad - h;
    return { x, y, w: Math.max(1, barW * 0.8), h };
  });
}

export function BarChart({ data, width = 320, height = 120 }: { data: BarDatum[]; width?: number; height?: number }) {
  const bars = computeBars(data, width, height);
  return (
    <svg width={width} height={height} role="img" aria-label="bar chart">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="currentColor" opacity={0.85} />
      ))}
    </svg>
  );
}

