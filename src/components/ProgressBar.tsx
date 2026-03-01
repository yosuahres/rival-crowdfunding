"use client";

interface ProgressBarProps {
  /** Current amount raised */
  current: number;
  /** Goal amount */
  goal: number;
}

export default function ProgressBar({ current, goal }: ProgressBarProps) {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="w-full max-w-2xl">
      {/* Track */}
      <div className="h-4 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur">
        {/* Fill */}
        <div
          className="h-full rounded-full bg-[#8eac7a] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Amount + percentage */}
      <p className="mt-2 text-center text-sm font-medium text-white/80">
        <span className="font-bold text-white">Rp{current.toLocaleString("id-ID")}</span> out of{" "}
        <span className="font-bold text-white">Rp{goal.toLocaleString("id-ID")}</span>{" "}
        <span className="text-white/50">({percentage.toFixed(1)}%)</span>
      </p>
    </div>
  );
}
