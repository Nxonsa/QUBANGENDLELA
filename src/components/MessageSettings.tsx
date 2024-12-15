import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MessageSettingsProps {
  autoResponse: string;
  onAutoResponseChange: (message: string) => void;
  className?: string;
}

export const MessageSettings = ({ autoResponse, onAutoResponseChange, className }: MessageSettingsProps) => {
  return (
    <Card className={cn("w-full max-w-md glass-panel", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Auto-Response Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
      </CardContent>
    </Card>
  );
};