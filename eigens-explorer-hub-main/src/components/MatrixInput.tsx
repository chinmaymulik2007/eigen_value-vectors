import { cn } from "@/lib/utils";

interface MatrixInputProps {
  size: number;
  matrix: number[][];
  onChange: (row: number, col: number, value: string) => void;
}

const MatrixInput = ({ size, matrix, onChange }: MatrixInputProps) => {
  return (
    <div className="relative">
      {/* Matrix brackets */}
      <div className="absolute left-0 top-0 bottom-0 w-3 border-l-2 border-t-2 border-b-2 border-primary rounded-l-sm" />
      <div className="absolute right-0 top-0 bottom-0 w-3 border-r-2 border-t-2 border-b-2 border-primary rounded-r-sm" />
      
      <div 
        className="grid gap-2 p-4 mx-3"
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: size }).map((_, row) =>
          Array.from({ length: size }).map((_, col) => (
            <input
              key={`${row}-${col}`}
              type="number"
              step="any"
              value={matrix[row]?.[col] ?? 0}
              onChange={(e) => onChange(row, col, e.target.value)}
              className={cn(
                "w-16 h-12 text-center font-mono text-lg",
                "bg-matrix-cell border border-matrix-border rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:bg-matrix-cell-focus",
                "transition-all duration-200",
                "placeholder:text-muted-foreground",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
              placeholder="0"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MatrixInput;