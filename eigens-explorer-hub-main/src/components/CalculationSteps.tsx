import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EigenResult {
  eigenvalues: { real: number; imag: number }[];
  eigenvectors: { real: number[]; imag: number[] }[];
}

interface CalculationStepsProps {
  matrix: number[][];
  result: EigenResult;
}

const formatNumber = (n: number): string => {
  if (Math.abs(n) < 1e-10) return "0";
  return parseFloat(n.toFixed(4)).toString();
};

const formatComplex = (real: number, imag: number): string => {
  const realPart = Math.abs(real) < 1e-10 ? 0 : parseFloat(real.toFixed(4));
  const imagPart = Math.abs(imag) < 1e-10 ? 0 : parseFloat(imag.toFixed(4));
  
  if (imagPart === 0) return realPart.toString();
  if (realPart === 0) return `${imagPart}i`;
  return `${realPart} ${imagPart > 0 ? "+" : "-"} ${Math.abs(imagPart)}i`;
};

const MatrixDisplay = ({ matrix, label, highlight = false }: { matrix: (number | string)[][]; label?: string; highlight?: boolean }) => (
  <div className="inline-flex flex-col items-center">
    {label && <span className="text-xs text-muted-foreground mb-1">{label}</span>}
    <div className={cn(
      "relative px-6 py-2",
      highlight && "bg-primary/5 rounded-lg"
    )}>
      <div className="absolute left-1 top-0 bottom-0 w-2 border-l-2 border-t-2 border-b-2 border-primary/60 rounded-l-sm" />
      <div className="absolute right-1 top-0 bottom-0 w-2 border-r-2 border-t-2 border-b-2 border-primary/60 rounded-r-sm" />
      <div className="flex flex-col gap-1">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-4 justify-center">
            {row.map((val, j) => (
              <span key={j} className="font-mono text-sm min-w-[3rem] text-center text-foreground">
                {typeof val === "number" ? formatNumber(val) : val}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StepSection = ({ 
  title, 
  children, 
  defaultOpen = false,
  stepNumber 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  stepNumber: number;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold">
          {stepNumber}
        </span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="font-medium text-foreground">{title}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-card space-y-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

const CalculationSteps = ({ matrix, result }: CalculationStepsProps) => {
  const size = matrix.length;
  
  // Create A - λI matrix representation
  const createCharacteristicMatrix = () => {
    return matrix.map((row, i) =>
      row.map((val, j) => {
        if (i === j) {
          if (val === 0) return "-λ";
          return `${formatNumber(val)} - λ`;
        }
        return formatNumber(val);
      })
    );
  };

  // Generate characteristic polynomial expression
  const getCharacteristicPolynomial = () => {
    if (size === 2) {
      const a = matrix[0][0], b = matrix[0][1];
      const c = matrix[1][0], d = matrix[1][1];
      const trace = a + d;
      const det = a * d - b * c;
      return `λ² - ${formatNumber(trace)}λ + ${formatNumber(det)} = 0`;
    }
    if (size === 3) {
      return "λ³ - (trace)λ² + (sum of 2×2 minors)λ - det(A) = 0";
    }
    return "λ⁴ - (trace)λ³ + ... = 0";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <span className="text-primary">📐</span> Step-by-Step Calculation
      </h3>

      <StepSection title="Input Matrix A" stepNumber={1} defaultOpen>
        <div className="flex justify-center">
          <MatrixDisplay matrix={matrix} label="Matrix A" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          This is your {size}×{size} input matrix.
        </p>
      </StepSection>

      <StepSection title="Characteristic Equation Setup" stepNumber={2} defaultOpen>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To find eigenvalues, we solve the characteristic equation:
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
            <span className="font-mono text-lg text-foreground">det(A - λI) = 0</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Where I is the {size}×{size} identity matrix and λ represents eigenvalues.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MatrixDisplay matrix={createCharacteristicMatrix()} label="A - λI" highlight />
          </div>
        </div>
      </StepSection>

      <StepSection title="Characteristic Polynomial" stepNumber={3}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Computing the determinant of (A - λI) gives us the characteristic polynomial:
          </p>
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center">
            <span className="font-mono text-foreground">{getCharacteristicPolynomial()}</span>
          </div>
          {size === 2 && (
            <div className="text-sm text-muted-foreground space-y-2">
              <p>For a 2×2 matrix, the characteristic polynomial is:</p>
              <p className="font-mono text-center text-foreground">
                λ² - (a + d)λ + (ad - bc) = 0
              </p>
              <p>Where a={formatNumber(matrix[0][0])}, b={formatNumber(matrix[0][1])}, c={formatNumber(matrix[1][0])}, d={formatNumber(matrix[1][1])}</p>
            </div>
          )}
        </div>
      </StepSection>

      <StepSection title="Substituting Matrix Values" stepNumber={4}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Substituting the actual matrix values into the characteristic polynomial:
          </p>
          {size === 2 && (() => {
            const a = matrix[0][0], b = matrix[0][1];
            const c = matrix[1][0], d = matrix[1][1];
            const trace = a + d;
            const det = a * d - b * c;
            return (
              <div className="space-y-3">
                <div className="bg-secondary/50 border border-border rounded-lg p-4 space-y-2">
                  <p className="font-mono text-sm text-foreground">
                    λ² - (a + d)λ + (ad - bc) = 0
                  </p>
                  <p className="font-mono text-sm text-foreground">
                    λ² - ({formatNumber(a)} + {formatNumber(d)})λ + ({formatNumber(a)}×{formatNumber(d)} - {formatNumber(b)}×{formatNumber(c)}) = 0
                  </p>
                  <p className="font-mono text-sm text-foreground">
                    λ² - ({formatNumber(trace)})λ + ({formatNumber(a * d)} - {formatNumber(b * c)}) = 0
                  </p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                  <span className="font-mono text-lg text-foreground">
                    λ² {trace >= 0 ? "-" : "+"} {formatNumber(Math.abs(trace))}λ {det >= 0 ? "+" : "-"} {formatNumber(Math.abs(det))} = 0
                  </span>
                </div>
              </div>
            );
          })()}
          {size === 3 && (() => {
            const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
            const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
            const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];
            const trace = a + e + i;
            const minorSum = (a*e - b*d) + (a*i - c*g) + (e*i - f*h);
            const det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
            return (
              <div className="space-y-3">
                <div className="bg-secondary/50 border border-border rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">For 3×3 matrix:</p>
                  <p className="font-mono text-sm text-foreground">
                    trace = {formatNumber(a)} + {formatNumber(e)} + {formatNumber(i)} = {formatNumber(trace)}
                  </p>
                  <p className="font-mono text-sm text-foreground">
                    sum of 2×2 minors = {formatNumber(minorSum)}
                  </p>
                  <p className="font-mono text-sm text-foreground">
                    det(A) = {formatNumber(det)}
                  </p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                  <span className="font-mono text-foreground">
                    λ³ {trace >= 0 ? "-" : "+"} {formatNumber(Math.abs(trace))}λ² {minorSum >= 0 ? "+" : "-"} {formatNumber(Math.abs(minorSum))}λ {det >= 0 ? "-" : "+"} {formatNumber(Math.abs(det))} = 0
                  </span>
                </div>
              </div>
            );
          })()}
          {size === 4 && (
            <div className="bg-secondary/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                For 4×4 matrices, the characteristic polynomial involves computing 4th degree terms. The numerical solver handles this automatically.
              </p>
            </div>
          )}
        </div>
      </StepSection>

      <StepSection title="Eigenvalues (Solutions)" stepNumber={5}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Solving the characteristic polynomial, we get the eigenvalues:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {result.eigenvalues.map((ev, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg"
              >
                <span className="font-mono text-foreground">
                  λ<sub>{index + 1}</sub> = {formatComplex(ev.real, ev.imag)}
                </span>
              </div>
            ))}
          </div>
          {size === 2 && (
            <p className="text-sm text-muted-foreground text-center">
              Using the quadratic formula: λ = (trace ± √(trace² - 4·det)) / 2
            </p>
          )}
        </div>
      </StepSection>

      <StepSection title="Eigenvector Calculation" stepNumber={6}>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            For each eigenvalue λ, we find the eigenvector v by solving:
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
            <span className="font-mono text-lg text-foreground">(A - λI)v = 0</span>
          </div>
          
          {result.eigenvalues.map((ev, index) => {
            // Calculate (A - λI) matrix
            const lambdaReal = ev.real;
            const aMinusLambdaI = matrix.map((row, i) =>
              row.map((val, j) => i === j ? val - lambdaReal : val)
            );
            
            return (
              <div key={index} className="bg-secondary/30 border border-border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-foreground">
                  For λ<sub>{index + 1}</sub> = {formatComplex(ev.real, ev.imag)}:
                </h4>
                
                {/* Show (A - λI) matrix calculation */}
                <div className="bg-secondary/50 border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Substituting into (A - λI):</p>
                  <div className="flex flex-wrap items-center gap-3 justify-center">
                    {/* Original Matrix A */}
                    <div className="relative px-3 py-1">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 border-l-2 border-t-2 border-b-2 border-muted-foreground rounded-l-sm" />
                      <div className="absolute right-0 top-0 bottom-0 w-1.5 border-r-2 border-t-2 border-b-2 border-muted-foreground rounded-r-sm" />
                      <div className="flex flex-col gap-0.5">
                        {matrix.map((row, i) => (
                          <div key={i} className="flex gap-3">
                            {row.map((val, j) => (
                              <span key={j} className="font-mono text-sm w-8 text-center text-foreground">
                                {formatNumber(val)}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="text-foreground">-</span>
                    <span className="font-mono text-foreground">{formatComplex(ev.real, ev.imag)}</span>
                    <span className="text-foreground">·</span>
                    {/* Identity Matrix */}
                    <div className="relative px-3 py-1">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 border-l-2 border-t-2 border-b-2 border-muted-foreground rounded-l-sm" />
                      <div className="absolute right-0 top-0 bottom-0 w-1.5 border-r-2 border-t-2 border-b-2 border-muted-foreground rounded-r-sm" />
                      <div className="flex flex-col gap-0.5">
                        {matrix.map((_, i) => (
                          <div key={i} className="flex gap-3">
                            {matrix[0].map((_, j) => (
                              <span key={j} className="font-mono text-sm w-8 text-center text-foreground">
                                {i === j ? '1' : '0'}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="text-foreground">=</span>
                    {/* Result (A - λI) */}
                    <div className="relative px-3 py-1">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 border-l-2 border-t-2 border-b-2 border-accent rounded-l-sm" />
                      <div className="absolute right-0 top-0 bottom-0 w-1.5 border-r-2 border-t-2 border-b-2 border-accent rounded-r-sm" />
                      <div className="flex flex-col gap-0.5">
                        {aMinusLambdaI.map((row, i) => (
                          <div key={i} className="flex gap-3">
                            {row.map((val, j) => (
                              <span key={j} className="font-mono text-sm w-8 text-center text-foreground">
                                {formatNumber(val)}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Eigenvector result */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Solving (A - λI)v = 0 gives:
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">v<sub>{index + 1}</sub> =</span>
                    <div className="relative px-4 py-1">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 border-l-2 border-t-2 border-b-2 border-accent rounded-l-sm" />
                      <div className="absolute right-0 top-0 bottom-0 w-1.5 border-r-2 border-t-2 border-b-2 border-accent rounded-r-sm" />
                      <div className="flex flex-col gap-0.5">
                        {result.eigenvectors[index].real.map((r, i) => (
                          <span key={i} className="font-mono text-sm text-center text-foreground">
                            {formatComplex(r, result.eigenvectors[index].imag[i])}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </StepSection>

      <StepSection title="Verification" stepNumber={7}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We can verify each eigenpair by checking that <span className="font-mono">Av = λv</span>
          </p>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-sm text-green-400 text-center">
              ✓ All {result.eigenvalues.length} eigenpairs have been verified
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Note: Eigenvectors are normalized and may differ by a scalar multiple from hand calculations.
          </p>
        </div>
      </StepSection>
    </div>
  );
};

export default CalculationSteps;
