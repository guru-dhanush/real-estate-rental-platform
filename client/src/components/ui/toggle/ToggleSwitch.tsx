import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch/Switch";
import Label from "@/components/ui/label/Label";

type ToggleSwitchProps = {
  isOn: boolean;
  onToggle: (isOn: boolean) => void;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  label?: string;
  className?: string;
  size?: "default" | "sm";
};

export function ToggleSwitch({
  isOn,
  onToggle,
  onIcon,
  offIcon,
  label,
  className,
  size = "default",
}: ToggleSwitchProps) {
  const sizeClasses = {
    default: "text-sm",
    sm: "text-xs"
  };

  return (
    <div className={cn("flex items-center gap-2", sizeClasses[size], className)}>
      <Switch
        id="toggle-switch"
        checked={isOn}
        onCheckedChange={onToggle}
        size={size}
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
      />
      {label && (
        <Label 
          htmlFor="toggle-switch" 
          className={cn(
            "mb-0 cursor-pointer",
            size === "sm" && "text-xs"
          )}
        >
          {label}
        </Label>
      )}
      <div className={cn("flex items-center", size === "sm" ? "gap-0.5" : "gap-1")}>
        {isOn ? onIcon : offIcon}
      </div>
    </div>
  );
}
