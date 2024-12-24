import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface MessageSettingsProps {
  autoResponse: string;
  onAutoResponseChange: (message: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MessageSettings = ({ 
  autoResponse, 
  onAutoResponseChange, 
  open, 
  onOpenChange 
}: MessageSettingsProps) => {
  const handleSave = () => {
    onOpenChange(false);
    toast({
      title: "Settings Saved",
      description: "Your auto-response message has been updated.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Auto-Response Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="auto-response">Auto-Response Message</Label>
            <Input
              id="auto-response"
              value={autoResponse}
              onChange={(e) => onAutoResponseChange(e.target.value)}
              className="w-full"
              placeholder="Enter your auto-response message"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};