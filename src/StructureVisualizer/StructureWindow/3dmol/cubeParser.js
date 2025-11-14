// parseCube.js
const Bohr = 0.52917721092; // Bohr radius in Angstrom

import { getMatrixParams } from "./utils";

/**
 * Converts a cube file string to shifted CIF-like content and extracts unit cell parameters.
 * @param {string} cubeContent - Raw cube file text
 * @returns {Object} { alpha, beta, gamma, a, b, c, shiftedCif }
 */
export function parseCube(cubeContent) {
  const lines = cubeContent.trim().split("\n");

  if (lines.length < 6) {
    throw new Error("Invalid cube file format");
  }

  // --- header info ---
  const numberAtoms = Number(lines[2].trim().split(/\s+/)[0]);
  const shiftOffset = lines[2].trim().split(/\s+/).slice(1).map(Number);

  // --- voxel/unit cell info ---
  const voxelInfo = [
    lines[3].trim().split(/\s+/).map(Number),
    lines[4].trim().split(/\s+/).map(Number),
    lines[5].trim().split(/\s+/).map(Number),
  ];

  const dims = voxelInfo.map((v) => Math.abs(v[0]));
  const unitCellVectors = voxelInfo.map((v, i) => ({
    cell: v.slice(1).map((value) => value * dims[i] * Bohr),
    stepSize: v.slice(1),
  }));

  const cell = unitCellVectors.map((v) => v.cell);

  // --- matrix parameters for unit cell ---
  const p = getMatrixParams(cell);

  const alpha = p.angles[1][2];
  const beta = p.angles[0][2];
  const gamma = p.angles[0][1];

  // --- shift atom coordinates ---
  const atomLines = [];
  for (let i = 6; i < 6 + numberAtoms; i++) {
    const tokens = lines[i].trim().split(/\s+/).map(Number);
    const shiftedCoords = tokens.slice(2).map((v, idx) => v - shiftOffset[idx]);

    atomLines.push(
      `${tokens[0].toFixed(0)} ${tokens[1].toFixed(5)} ${shiftedCoords.map((v) => v.toFixed(5)).join(" ")}`,
    );
  }

  // --- reconstruct shifted cube content ---
  const shiftedCif = [
    ...lines.slice(0, 2), // header + voxel info
    [numberAtoms, 0, 0, 0],
    ...lines.slice(3, 6),
    ...atomLines, // shifted atoms
    ...lines.slice(6 + numberAtoms), // volumetric data
  ].join("\n");

  // --- return params + shifted content ---
  const params = {
    alpha: alpha,
    beta: beta,
    gamma: gamma,
    a: p.lengths[0],
    b: p.lengths[1],
    c: p.lengths[2],
    shiftedCif: shiftedCif,
  };

  console.log("parseCube params:", params);

  return params;
}
