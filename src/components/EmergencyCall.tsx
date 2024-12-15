import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export const EmergencyCall = () => {
  const handleEmergencyCall = () => {
    window.location.href = "tel:112";
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      className="fixed bottom-4 right-4 z-50 rounded-full h-16 w-16 p-0 animate-pulse"
      onClick={handleEmergencyCall}
    >
      <Phone className="h-8 w-8" />
    </Button>
  );
};