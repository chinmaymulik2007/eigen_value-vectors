import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  size: number;
  onSizeChange: (size: number) => void;
}

const sizes = [2, 3, 4];

const SizeSelector = ({ size, onSizeChange }: SizeSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground">Matrix Size:</span>
      <div className="flex gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => onSizeChange(s)}
            className={cn(
              "w-12 h-10 rounded-md font-mono text-sm font-medium transition-all duration-200",
              size === s
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {s}×{s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;