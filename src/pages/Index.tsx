import { useState, useEffect } from "react";
import { SpeedGauge } from "@/components/SpeedGauge";
import { SafetyToggle } from "@/components/SafetyToggle";
import { EmergencyOverride } from "@/components/EmergencyOverride";
import { MessageSettings } from "@/components/MessageSettings";
import { PinEntry } from "@/components/PinEntry";
import { toast } from "@/components/ui/use-toast";
import { MapView } from "@/components/MapView";
import { EmergencyCall } from "@/components/EmergencyCall";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Index = () => {
  const [speed, setSpeed] = useState(0);
  const [safetyEnabled, setSafetyEnabled] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pinMode, setPinMode] = useState<"activate" | "deactivate">("activate");
  const [canDeactivate, setCanDeactivate] = useState(true);
  const [showDeactivatePin, setShowDeactivatePin] = useState(false);
  const [autoResponse, setAutoResponse] = useState(
    "I'm currently driving. I'll respond when it's safe to do so."
  );

  // Simulate speed changes (in a real app, this would use GPS)
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const change = Math.random() * 10 - 5;
        return Math.max(0, Math.min(120, prev + change));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-enable safety mode when speed exceeds threshold
  useEffect(() => {
    if (speed > 20 && !safetyEnabled) {
      handleSafetyToggle(true);
    }
  }, [speed]);

  // Show deactivation PIN after 15 minutes
  useEffect(() => {
    if (!canDeactivate) {
      const timer = setTimeout(() => {
        setCanDeactivate(true);
        setShowDeactivatePin(true);
        toast({
          title: "Safety Mode Can Be Deactivated",
          description: "15-minute waiting period has elapsed. You can now enter your PIN.",
        });
      }, 900000); // 15 minutes
      return () => clearTimeout(timer);
    }
  }, [canDeactivate]);

  const handleSafetyToggle = (enabled: boolean) => {
    if (enabled) {
      setPinMode("activate");
      setShowPinEntry(true);
    } else if (canDeactivate) {
      setPinMode("deactivate");
      setShowPinEntry(true);
    } else {
      toast({
        title: "Cannot Deactivate",
        description: "Please wait 15 minutes before deactivating safety mode.",
        variant: "destructive",
      });
    }
  };

  const handlePinSuccess = () => {
    setShowPinEntry(false);
    if (pinMode === "activate") {
      setSafetyEnabled(true);
      setCanDeactivate(false);
      // Email activation code would be sent here in a real implementation
      toast({
        title: "Activation Code Sent",
        description: "Please check your email for the activation code.",
      });
    } else {
      setSafetyEnabled(false);
      setShowDeactivatePin(false);
    }
  };

  const handleEmergencyOverride = () => {
    setPinMode("deactivate");
    setShowPinEntry(true);
    toast({
      title: "Emergency Override",
      description: "Please enter your PIN to disable safety mode.",
    });
  };

  return (
    <div className="relative">
      <MapView speed={speed} />
      
      <div className="fixed top-4 left-4 z-10 space-y-4">
        <div className="glass-panel p-4">
          <SafetyToggle
            enabled={safetyEnabled}
            onToggle={handleSafetyToggle}
          />
        </div>
        
        <EmergencyOverride
          onOverride={handleEmergencyOverride}
          className="w-full"
        />
      </div>

      <EmergencyCall />

      <Dialog open={showPinEntry || showDeactivatePin} onOpenChange={setShowPinEntry}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pinMode === "activate" ? "Activate" : "Deactivate"} Safety Mode
            </DialogTitle>
            <DialogDescription>
              {pinMode === "activate" 
                ? "An activation code will be sent to your email."
                : "Enter your PIN to deactivate safety mode."}
            </DialogDescription>
          </DialogHeader>
          <PinEntry onSuccess={handlePinSuccess} mode={pinMode} />
        </DialogContent>
      </Dialog>

      <Dialog open={safetyEnabled} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Safety Mode Active</DialogTitle>
            <DialogDescription>
              Phone functionality is limited while driving. Emergency calls (112) are still available.
            </DialogDescription>
          </DialogHeader>
          <MessageSettings
            autoResponse={autoResponse}
            onAutoResponseChange={setAutoResponse}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;