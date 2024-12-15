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
  const correctPin = "1234"; // In a real app, this would be securely stored

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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