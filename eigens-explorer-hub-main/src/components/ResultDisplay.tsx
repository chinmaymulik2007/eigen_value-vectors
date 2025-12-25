import { cn } from "@/lib/utils";
import CalculationSteps from "./CalculationSteps";

interface EigenResult {
  eigenvalues: { real: number; imag: number }[];
  eigenvectors: { real: number[]; imag: number[] }[];
}

interface ResultDisplayProps {
  result: EigenResult | null;
  error: string | null;
  matrix?: number[][];
}

const formatComplex = (real: number, imag: number): string => {
  const realPart = Math.abs(real) < 1e-10 ? 0 : parseFloat(real.toFixed(6));
  const imagPart = Math.abs(imag) < 1e-10 ? 0 : parseFloat(imag.toFixed(6));
  
  if (imagPart === 0) return realPart.toString();
  if (realPart === 0) return `${imagPart}i`;
  return `${realPart} ${imagPart > 0 ? '+' : '-'} ${Math.abs(imagPart)}i`;
};

const formatVector = (real: number[], imag: number[]): string[] => {
  return real.map((r, i) => formatComplex(r, imag[i]));
};

const ResultDisplay = ({ result, error, matrix }: ResultDisplayProps) => {
  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 animate-fade-in">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          Enter your matrix values and click calculate to see eigenvalues and eigenvectors
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Eigenvalues */}
      <div className="bg-card border border-border rounded-lg p-6 glow-primary">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-primary">λ</span> Eigenvalues
        </h3>
        <div className="flex flex-wrap gap-3">
          {result.eigenvalues.map((ev, index) => (
            <div
              key={index}
              className={cn(
                "px-4 py-2 bg-primary/10 border border-primary/30 rounded-md",
                "font-mono text-foreground"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-muted-foreground text-sm">λ{index + 1} = </span>
              <span className="font-semibold">{formatComplex(ev.real, ev.imag)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Eigenvectors */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-primary">v</span> Eigenvectors
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.eigenvectors.map((ev, index) => (
            <div
              key={index}
              className="bg-secondary/50 border border-border rounded-lg p-4"
              style={{ animationDelay: `${(index + result.eigenvalues.length) * 100}ms` }}
            >
              <p className="text-sm text-muted-foreground mb-2">
                For λ{index + 1} = {formatComplex(result.eigenvalues[index].real, result.eigenvalues[index].imag)}
              </p>
              <div className="relative">
                {/* Vector brackets */}
                <div className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-t-2 border-b-2 border-accent rounded-l-sm" />
                <div className="absolute right-0 top-0 bottom-0 w-2 border-r-2 border-t-2 border-b-2 border-accent rounded-r-sm" />
                
                <div className="flex flex-col gap-1 px-4 py-2 mx-2">
                  {formatVector(ev.real, ev.imag).map((val, i) => (
                    <span key={i} className="font-mono text-center text-foreground">
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculation Steps */}
      {matrix && (
        <CalculationSteps matrix={matrix} result={result} />
      )}
    </div>
  );
};

export default ResultDisplay;