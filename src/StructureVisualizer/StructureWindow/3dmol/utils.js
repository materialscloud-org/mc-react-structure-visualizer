function norm(vec) {
  return Math.sqrt(vec.reduce((sum, x) => sum + x * x, 0));
}

function dot(v1, v2) {
  return v1.reduce((sum, x, i) => sum + x * v2[i], 0);
}

// camera values.
export const cam = {
  x: [0.0, 0.0, 0.0, 0.0, -0.5, -0.5, -0.5, 0.5],
  y: [0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 0.5],
  z: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0],
};

// general matrix NxM to params conversion.
export function getMatrixParams(matrix) {
  const n = matrix.length;
  const lengths = matrix.map((v) => norm(v));

  const angles = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        angles[i][j] = 0;
        continue;
      }

      const dotProd = dot(matrix[i], matrix[j]);
      const normI = lengths[i];
      const normJ = lengths[j];

      if (normI > 0 && normJ > 0) {
        let cosTheta = dotProd / (normI * normJ);
        // Clamp to [-1, 1] to avoid NaN due to floating point errors
        cosTheta = Math.max(-1, Math.min(1, cosTheta));
        const angleRad = Math.acos(cosTheta);
        angles[i][j] = angleRad * (180 / Math.PI);
      } else {
        angles[i][j] = null; // Angle undefined for zero-length vector
      }
    }
  }

  return { lengths, angles };
}
