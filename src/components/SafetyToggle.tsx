import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
      <Label className="text-lg font-medium">Safety Mode {enabled ? "Enabled" : "Disabled"}</Label>
    </div>
  );
};