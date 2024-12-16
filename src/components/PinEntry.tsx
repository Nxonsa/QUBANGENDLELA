import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface PinEntryProps {
  onSuccess: () => void;
  mode: "activate" | "deactivate";
}

export const PinEntry = ({ onSuccess, mode }: PinEntryProps) => {
  const [pin, setPin] = useState("");
  const activatePin = "1234";
  const deactivatePin = "2222";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = mode === "activate" ? activatePin : deactivatePin;
    
    if (pin === correctPin) {
      onSuccess();
      toast({
        title: `Safety Mode ${mode === "activate" ? "Activated" : "Deactivated"}`,
        description: `PIN verified successfully.`,
      });
    } else {
      toast({
        title: "Incorrect PIN",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="password"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter 4-digit PIN"
        className="text-center text-2xl tracking-wider"
      />
      <Button type="submit" className="w-full">
        Verify PIN
      </Button>
    </form>
  );
};