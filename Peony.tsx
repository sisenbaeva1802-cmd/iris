/** Decorative layered peony. Purely ornamental (aria-hidden). */
export function Peony({ size = 220, className = "" }: { size?: number; className?: string }) {
  const rings = [
    { n: 8, rx: 46, ry: 22, d: 42, fill: "#F7E8E8", rot: 0 },
    { n: 7, rx: 38, ry: 19, d: 32, fill: "#F0D0DB", rot: 20 },
    { n: 6, rx: 30, ry: 16, d: 23, fill: "#E8B7C8", rot: 8 },
    { n: 5, rx: 20, ry: 11, d: 13, fill: "#D79AB0", rot: 30 },
  ];
  return (
    <svg viewBox="-100 -100 200 200" width={size} height={size} className={className} aria-hidden="true">
      <g stroke="#8C9A7B" strokeWidth="2" fill="#DCE3D2" opacity=".9">
        <ellipse cx="-62" cy="58" rx="30" ry="11" transform="rotate(-30 -62 58)" />
        <ellipse cx="62" cy="58" rx="30" ry="11" transform="rotate(30 62 58)" />
      </g>
      {rings.map((r, k) => (
        <g key={k}>{Array.from({ length: r.n }).map((_, i) => (
          <ellipse key={i} cx={r.d} cy="0" rx={r.rx / 2} ry={r.ry} fill={r.fill} stroke="#E0A9BC" strokeWidth=".8"
            transform={`rotate(${r.rot + (360 / r.n) * i})`} />))}</g>
      ))}
      <circle r="5" fill="#C98AA1" />
    </svg>
  );
}
