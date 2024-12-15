import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyOverrideProps {
  onOverride: () => void;
  className?: string;
}

export const EmergencyOverride = ({ onOverride, className }: EmergencyOverrideProps) => {
  return (
    <Button
      variant="destructive"
      className={cn("flex items-center space-x-2 px-6 py-4", className)}
      onClick={onOverride}
    >
      <AlertCircle className="w-5 h-5" />
      <span>Emergency Override</span>
    </Button>
  );
};