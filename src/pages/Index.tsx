import { useState, useEffect } from "react";
import { SpeedGauge } from "@/components/SpeedGauge";
import { SafetyToggle } from "@/components/SafetyToggle";
import { EmergencyOverride } from "@/components/EmergencyOverride";
import { MessageSettings } from "@/components/MessageSettings";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [speed, setSpeed] = useState(0);
  const [safetyEnabled, setSafetyEnabled] = useState(false);
  const [autoResponse, setAutoResponse] = useState(
    "I'm currently driving. I'll respond when it's safe to do so."
  );
  const { toast } = useToast();

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
      setSafetyEnabled(true);
      toast({
        title: "Safety Mode Activated",
        description: "Speed threshold exceeded. Phone functionality limited.",
      });
    }
  }, [speed, safetyEnabled, toast]);

  const handleEmergencyOverride = () => {
    setSafetyEnabled(false);
    toast({
      title: "Emergency Override Activated",
      description: "Safety mode has been temporarily disabled.",
      variant: "destructive",
    });
  };

  const handleAutoResponseChange = (message: string) => {
    setAutoResponse(message);
    toast({
      title: "Auto-Response Updated",
      description: "Your new message has been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />
        
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="glass-panel p-8 flex flex-col items-center animate-fade-in">
              <SpeedGauge speed={Math.round(speed)} maxSpeed={120} />
              <SafetyToggle
                enabled={safetyEnabled}
                onToggle={setSafetyEnabled}
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
              onAutoResponseChange={handleAutoResponseChange}
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
                  <span>Auto-Response:</span>
                  <span className="font-medium">{autoResponse ? "Configured" : "Not Set"}</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;