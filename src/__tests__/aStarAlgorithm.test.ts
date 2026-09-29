import { describe, it, expect } from 'vitest';

describe('A* Heuristic Spatial Pathfinding Break Testing', () => {
  const solveAStar = (
    grid: number[][],
    start: { r: number; c: number },
    target: { r: number; c: number }
  ) => {
    const rows = grid.length;
    const cols = grid[0].length;

    interface Node {
      r: number;
      c: number;
      g: number;
      h: number;
      f: number;
      parent: Node | null;
    }

    const openSet: Node[] = [];
    const closedSet = new Set<string>();

    const hCost = (r: number, c: number) =>
      Math.abs(r - target.r) + Math.abs(c - target.c);

    const startNode: Node = {
      r: start.r,
      c: start.c,
      g: 0,
      h: hCost(start.r, start.c),
      f: hCost(start.r, start.c),
      parent: null,
    };
    openSet.push(startNode);

    let foundTarget: Node | null = null;
    let iterations = 0;
    const maxIterations = 5000;

    while (openSet.length > 0 && iterations < maxIterations) {
      iterations++;
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      if (current.r === target.r && current.c === target.c) {
        foundTarget = current;
        break;
      }

      closedSet.add(`${current.r},${current.c}`);

      const neighbors = [
        { r: current.r - 1, c: current.c },
        { r: current.r + 1, c: current.c },
        { r: current.r, c: current.c - 1 },
        { r: current.r, c: current.c + 1 },
      ];

      for (const n of neighbors) {
        if (n.r < 0 || n.r >= rows || n.c < 0 || n.c >= cols) continue;
        if (grid[n.r][n.c] === 1) continue;
        if (closedSet.has(`${n.r},${n.c}`)) continue;

        const g = current.g + 1;
        const h = hCost(n.r, n.c);
        const f = g + h;

        const existing = openSet.find((item) => item.r === n.r && item.c === n.c);
        if (!existing) {
          openSet.push({ r: n.r, c: n.c, g, h, f, parent: current });
        } else if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = current;
        }
      }
    }

    const path: { r: number; c: number }[] = [];
    let curr = foundTarget;
    while (curr) {
      path.unshift({ r: curr.r, c: curr.c });
      curr = curr.parent;
    }
    return { path, iterations };
  };

  it('should find optimal path across open grid', () => {
    const grid = Array(8).fill(0).map(() => Array(12).fill(0));
    const start = { r: 0, c: 0 };
    const target = { r: 0, c: 5 };

    const { path } = solveAStar(grid, start, target);
    expect(path.length).toBe(6); // 0 to 5 inclusive
    expect(path[0]).toEqual(start);
    expect(path[path.length - 1]).toEqual(target);
  });

  it('should navigate around a vertical obstacle barrier', () => {
    const grid = Array(8).fill(0).map(() => Array(12).fill(0));
    // Wall blocking direct horizontal line
    grid[0][3] = 1;
    grid[1][3] = 1;
    grid[2][3] = 1;

    const start = { r: 1, c: 1 };
    const target = { r: 1, c: 5 };

    const { path } = solveAStar(grid, start, target);
    expect(path.length).toBeGreaterThan(0);
    // Ensure no step traverses wall
    path.forEach((step) => {
      expect(grid[step.r][step.c]).toBe(0);
    });
  });

  it('should safely terminate and return empty path when completely walled off (break test)', () => {
    const grid = Array(8).fill(0).map(() => Array(12).fill(0));
    const start = { r: 3, c: 1 };
    const target = { r: 3, c: 10 };

    // Enclose target completely in a box of 1s
    for (let r = 0; r < 8; r++) {
      grid[r][8] = 1; // Solid vertical wall with no gap
    }

    const { path, iterations } = solveAStar(grid, start, target);
    expect(path.length).toBe(0);
    expect(iterations).toBeLessThan(100); // Terminates promptly without infinite loop
  });
});
