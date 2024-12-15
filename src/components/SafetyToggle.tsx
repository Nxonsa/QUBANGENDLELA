import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LucideShieldCheck, LucideShieldOff } from "lucide-react";

interface SafetyToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export const SafetyToggle = ({ enabled, onToggle, className }: SafetyToggleProps) => {
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
      <div className="flex items-center space-x-2">
        {enabled ? (
          <LucideShieldCheck className="w-5 h-5 text-primary" />
        ) : (
          <LucideShieldOff className="w-5 h-5 text-muted-foreground" />
        )}
        <Label className="text-lg font-medium">
          Safety Mode {enabled ? "Enabled" : "Disabled"}
        </Label>
      </div>
    </div>
  );
};