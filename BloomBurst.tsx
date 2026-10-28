"use client";
import { Peony } from "./Peony";
/** Show on results/achievement screens. Flowers bloom once and fade; disabled with reduced motion. */
export function BloomBurst() {
  const spots = [["10%","20%",90],["78%","12%",120],["20%","68%",110],["72%","62%",80],["46%","30%",140]] as const;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {spots.map(([l, t, s], i) => (
        <div key={i} className="bloom absolute" style={{ left: l, top: t, animationDelay: `${i * 0.15}s` }}>
          <Peony size={s} />
        </div>))}
    </div>
  );
}
