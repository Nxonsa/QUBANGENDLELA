import { useState, useEffect } from "react";
import { SpeedGauge } from "@/components/SpeedGauge";
import { SafetyToggle } from "@/components/SafetyToggle";
import { EmergencyOverride } from "@/components/EmergencyOverride";
import { MessageSettings } from "@/components/MessageSettings";
import { PinEntry } from "@/components/PinEntry";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Index = () => {
  const [speed, setSpeed] = useState(0);
  const [safetyEnabled, setSafetyEnabled] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pinMode, setPinMode] = useState<"activate" | "deactivate">("activate");
  const [canDeactivate, setCanDeactivate] = useState(true);
  const [autoResponse, setAutoResponse] = useState(
    "I'm currently driving. I'll respond when it's safe to do so."
  );

  // Simulate speed changes
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
      // Start 15-minute timer
      setTimeout(() => {
        setCanDeactivate(true);
        toast({
          title: "Safety Mode Can Be Deactivated",
          description: "15-minute waiting period has elapsed.",
        });
      }, 900000); // 15 minutes in milliseconds
    } else {
      setSafetyEnabled(false);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-accent p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Safe Drive Mode</h1>
          <p className="text-muted-foreground">
            Enhance your driving safety with automatic phone restrictions
          </p>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="glass-panel p-8 flex flex-col items-center animate-fade-in">
              <SpeedGauge speed={Math.round(speed)} maxSpeed={120} />
              <SafetyToggle
                enabled={safetyEnabled}
                onToggle={handleSafetyToggle}
                className="mt-6"
              />
            </div>
            
            <EmergencyOverride
              onOverride={handleEmergencyOverride}
              className="w-full animate-fade-in"
            />
          </div>
          
          <div className="space-y-8 animate-fade-in">
            <MessageSettings
              autoResponse={autoResponse}
              onAutoResponseChange={setAutoResponse}
            />
            
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Current Speed:</span>
                  <span className="font-medium">{Math.round(speed)} km/h</span>
                </li>
                <li className="flex justify-between">
                  <span>Safety Mode:</span>
                  <span className="font-medium">{safetyEnabled ? "Active" : "Inactive"}</span>
                </li>
                <li className="flex justify-between">
                  <span>Can Deactivate:</span>
                  <span className="font-medium">{canDeactivate ? "Yes" : "No"}</span>
                </li>
              </ul>
            </div>
          </div>
        </main>

        <Dialog open={showPinEntry} onOpenChange={setShowPinEntry}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {pinMode === "activate" ? "Activate" : "Deactivate"} Safety Mode
              </DialogTitle>
            </DialogHeader>
            <PinEntry onSuccess={handlePinSuccess} mode={pinMode} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;