import { useState, useCallback } from "react";
import { Calculator, RefreshCw, Sparkles } from "lucide-react";
import MatrixInput from "@/components/MatrixInput";
import ResultDisplay from "@/components/ResultDisplay";
import SizeSelector from "@/components/SizeSelector";
import { calculateEigen, EigenResult } from "@/lib/eigenCalculator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const createEmptyMatrix = (size: number): number[][] => {
  return Array.from({ length: size }, () => Array(size).fill(0));
};

const Index = () => {
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState<number[][]>(createEmptyMatrix(3));
  const [result, setResult] = useState<EigenResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setMatrix(createEmptyMatrix(newSize));
    setResult(null);
    setError(null);
  }, []);

  const handleMatrixChange = useCallback((row: number, col: number, value: string) => {
    setMatrix((prev) => {
      const newMatrix = prev.map((r) => [...r]);
      newMatrix[row][col] = value === "" ? 0 : parseFloat(value) || 0;
      return newMatrix;
    });
  }, []);

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setError(null);
    
    // Small delay for animation effect
    setTimeout(() => {
      try {
        const eigenResult = calculateEigen(matrix);
        setResult(eigenResult);
        toast.success("Calculation complete!", {
          description: `Found ${eigenResult.eigenvalues.length} eigenvalue(s)`,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to calculate eigenvalues";
        setError(message);
        toast.error("Calculation failed", { description: message });
      } finally {
        setIsCalculating(false);
      }
    }, 300);
  }, [matrix]);

  const handleReset = useCallback(() => {
    setMatrix(createEmptyMatrix(size));
    setResult(null);
    setError(null);
    toast.info("Matrix cleared");
  }, [size]);

  const handleExample = useCallback(() => {
    const examples: Record<number, number[][]> = {
      2: [[4, 2], [1, 3]],
      3: [[2, 0, 0], [0, 3, 4], [0, 4, 9]],
      4: [[4, 1, 0, 0], [1, 4, 1, 0], [0, 1, 4, 1], [0, 0, 1, 4]],
    };
    setMatrix(examples[size]);
    setResult(null);
    setError(null);
    toast.info("Example matrix loaded");
  }, [size]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Virtual Lab On Eigen Value & Eigen Vectors</h1>
              </div>
            </div>
            <img 
              src="/assets/pccoe-logo.png" 
              alt="PCCOE Logo" 
              className="h-14 w-auto"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Info Card */}
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border border-primary/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Matrix Eigenvalue & Eigenvector Calculator
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Enter your square matrix values below. The calculator will compute eigenvalues (λ) 
              satisfying <span className="font-mono text-primary">det(A - λI) = 0</span> and their 
              corresponding eigenvectors (v) satisfying <span className="font-mono text-primary">Av = λv</span>.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SizeSelector size={size} onSizeChange={handleSizeChange} />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExample}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Load Example
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>

          {/* Matrix Input */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
              Input Matrix A
            </h3>
            <div className="flex justify-center">
              <MatrixInput size={size} matrix={matrix} onChange={handleMatrixChange} />
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleCalculate}
              disabled={isCalculating}
              className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-3"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Calculate Eigenvalues
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
              Results
            </h3>
            <ResultDisplay result={result} error={error} matrix={matrix} />
          </div>

          {/* Footer Info */}
          <footer className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            <p>
              Supports real and complex eigenvalues • Matrices up to 4×4 • 
              Powered by <span className="text-primary font-medium">math.js</span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;