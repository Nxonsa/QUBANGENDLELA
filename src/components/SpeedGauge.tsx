import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SpeedGaugeProps {
  speed: number;
  maxSpeed: number;
  className?: string;
}

export const SpeedGauge = ({ speed, maxSpeed, className }: SpeedGaugeProps) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calculatedPercentage = (Math.floor(speed) / maxSpeed) * 100;
    setPercentage(Math.min(calculatedPercentage, 100));
  }, [speed, maxSpeed]);

  // Format speed to always show 3 digits, removing decimals
  const formattedSpeed = Math.floor(speed).toString().padStart(3, '0');

  return (
    <div className={cn("gauge-container relative w-32 h-32", className)} style={{ "--speed": `${percentage}` } as React.CSSProperties}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="45" className="gauge-bg" />
        <circle
          cx="50"
          cy="50"
          r="45"
          className="gauge-fill animate-gauge"
          pathLength="100"
        />
      </svg>
      <div className="gauge-center">
        <div className="text-center">
          <span className="text-3xl font-bold font-mono">{formattedSpeed}</span>
          <span className="text-xs ml-1">km/h</span>
        </div>
      </div>
    </div>
  );
};