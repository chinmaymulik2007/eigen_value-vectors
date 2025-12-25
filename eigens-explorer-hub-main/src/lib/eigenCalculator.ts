import { eigs, matrix as createMatrix, Matrix, Complex } from 'mathjs';

export interface EigenResult {
  eigenvalues: { real: number; imag: number }[];
  eigenvectors: { real: number[]; imag: number[] }[];
}

function isComplex(val: unknown): val is Complex {
  return typeof val === 'object' && val !== null && 're' in val && 'im' in val;
}

export function calculateEigen(inputMatrix: number[][]): EigenResult {
  const m = createMatrix(inputMatrix);
  const result = eigs(m);
  
  const eigenvalues: { real: number; imag: number }[] = [];
  const eigenvectors: { real: number[]; imag: number[] }[] = [];
  
  // Process eigenvalues - handle both array and matrix types
  let values: (number | Complex)[];
  if (Array.isArray(result.values)) {
    values = result.values as (number | Complex)[];
  } else if (typeof (result.values as Matrix).toArray === 'function') {
    values = (result.values as Matrix).toArray() as (number | Complex)[];
  } else {
    values = result.values as unknown as (number | Complex)[];
  }
  
  values.forEach((val) => {
    if (typeof val === 'number') {
      eigenvalues.push({ real: val, imag: 0 });
    } else if (isComplex(val)) {
      eigenvalues.push({ real: val.re, imag: val.im });
    }
  });
  
  // Process eigenvectors
  const vectors = result.eigenvectors as { value: number | Complex; vector: (number | Complex)[] }[];
  
  vectors.forEach((ev) => {
    const realParts: number[] = [];
    const imagParts: number[] = [];
    
    ev.vector.forEach((component) => {
      if (typeof component === 'number') {
        realParts.push(component);
        imagParts.push(0);
      } else if (isComplex(component)) {
        realParts.push(component.re);
        imagParts.push(component.im);
      }
    });
    
    eigenvectors.push({ real: realParts, imag: imagParts });
  });
  
  return { eigenvalues, eigenvectors };
}