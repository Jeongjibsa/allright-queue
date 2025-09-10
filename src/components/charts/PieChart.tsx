import React from "react";

export type PieDatum = { label: string; value: number };

export function computeArcs(data: PieDatum[], cx: number, cy: number, r: number) {
  const sum = data.reduce((a, b) => a + b.value, 0) || 1;
  let angle = -Math.PI / 2; // start at top
  return data.map((d) => {
    const slice = (d.value / sum) * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += slice;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const largeArc = slice > Math.PI ? 1 : 0;
    const path = `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
    return { path, label: d.label };
  });
}

export function PieChart({ data, size = 120 }: { data: PieDatum[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.9;
  const arcs = computeArcs(data, cx, cy, r);
  return (
    <svg width={size} height={size} role="img" aria-label="pie chart">
      {arcs.map((a, i) => (
        <path key={i} d={a.path} fill="currentColor" opacity={0.2 + (i % 5) * 0.15} />
      ))}
    </svg>
  );
}

