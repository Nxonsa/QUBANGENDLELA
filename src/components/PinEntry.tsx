import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface PinEntryProps {
  onSuccess: () => void;
  mode?: "activate" | "deactivate" | "unlock";
}

export const PinEntry = ({ onSuccess, mode = "unlock" }: PinEntryProps) => {
  const [pin, setPin] = useState("");
  
  const getPinForMode = () => {
    switch (mode) {
      case "activate":
        return "1234";
      case "deactivate":
        return "2222";
      case "unlock":
        return "00085";
      default:
        return "00085";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getPinForMode();
    
    if (pin === correctPin) {
      onSuccess();
      toast({
        title: "Success",
        description: mode === "unlock" 
          ? "Access granted."
          : `Safety mode ${mode === "activate" ? "activated" : "deactivated"} successfully.`,
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
        maxLength={5}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter PIN"
        className="text-center text-2xl tracking-wider"
      />
      <Button type="submit" className="w-full">
        Verify PIN
      </Button>
    </form>
  );
};