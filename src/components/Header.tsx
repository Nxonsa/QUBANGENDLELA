import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("w-full py-6 text-center glass-panel", className)}>
      <h1 className="text-3xl font-bold">DriveSafe</h1>
      <p className="text-muted-foreground mt-2">Enhancing road safety through smart technology</p>
    </header>
  );
};