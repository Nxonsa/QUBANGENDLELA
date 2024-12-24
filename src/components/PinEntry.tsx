import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface PinEntryProps {
  onSuccess: () => void;
}

export const PinEntry = ({ onSuccess }: PinEntryProps) => {
  const [pin, setPin] = useState("");
  const correctPin = "00085";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      onSuccess();
      toast({
        title: "Access Granted",
        description: "PIN verified successfully.",
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