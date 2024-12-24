import { useState, useEffect } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [speed, setSpeed] = useState(0);
  const [safetyEnabled, setSafetyEnabled] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(true);
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const [pinMode, setPinMode] = useState<"activate" | "deactivate" | "unlock">("unlock");
  const [autoResponse, setAutoResponse] = useState(
    "I'm currently driving. I'll respond when it's safe to do so."
  );
  const [appUnlocked, setAppUnlocked] = useState(false);

  const handlePinSuccess = () => {
    if (pinMode === "unlock") {
      setShowPinEntry(false);
      setAppUnlocked(true);
    } else if (pinMode === "activate") {
      setSafetyEnabled(true);
      setShowPinEntry(false);
    } else if (pinMode === "deactivate") {
      setSafetyEnabled(false);
      setShowPinEntry(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const change = Math.random() * 10 - 5;
        return Math.max(0, Math.min(120, prev + change));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (speed > 20 && !safetyEnabled) {
      handleSafetyToggle(true);
    }
  }, [speed]);

  const handleAccidentDetected = () => {
    setSafetyEnabled(true);
    toast({
      title: "Safety Mode Activated",
      description: "Safety mode has been automatically enabled due to detected accident.",
      variant: "destructive",
    });
  };

  const handleSafetyToggle = (enabled: boolean) => {
    if (enabled) {
      setPinMode("activate");
      setShowPinEntry(true);
    } else {
      setPinMode("deactivate");
      setShowPinEntry(true);
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

  const handleAcceptSafetyMode = () => {
    setShowSafetyDialog(false);
  };

  if (!appUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Enter PIN to Access</h2>
            <p className="text-gray-500 mt-2">Please enter your PIN to continue</p>
          </div>
          <PinEntry onSuccess={handlePinSuccess} mode="unlock" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapView 
        speed={speed} 
        onAccidentDetected={handleAccidentDetected}
      />
      
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

      <Dialog open={showPinEntry} onOpenChange={setShowPinEntry}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Safety Mode</DialogTitle>
            <DialogDescription>
              {pinMode === "activate" 
                ? "Enter PIN to activate safety mode"
                : pinMode === "deactivate"
                ? "Enter PIN to deactivate safety mode"
                : "Enter PIN to access the application"}
            </DialogDescription>
          </DialogHeader>
          <PinEntry onSuccess={handlePinSuccess} mode={pinMode} />
        </DialogContent>
      </Dialog>

      {safetyEnabled && (
        <Dialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
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
            <DialogFooter>
              <Button onClick={handleAcceptSafetyMode} className="w-full">
                Accept
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;