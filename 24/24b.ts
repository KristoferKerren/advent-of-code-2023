import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode22a {
  class HailStone {
    constructor(
      public x: number,
      public y: number,
      public z: number,
      public vX: number,
      public vY: number,
      public vZ: number,
      public index: number
    ) {}
  }

  class Equation {
    equals: number;
    x: number;
    y: number;
    z: number;
    vX: number;
    vY: number;
    vZ: number;

    constructor(data: any) {
      this.equals = data.equals || 0;
      this.x = data.x || 0;
      this.y = data.y || 0;
      this.z = data.z || 0;
      this.vX = data.vX || 0;
      this.vY = data.vY || 0;
      this.vZ = data.vZ || 0;
    }

    multiply(factor: number): Equation {
      return new Equation({
        equals: this.equals * factor,
        x: this.x * factor,
        y: this.y * factor,
        z: this.z * factor,
        vX: this.vX * factor,
        vY: this.vY * factor,
        vZ: this.vZ * factor,
      });
    }

    subtract(equation: Equation): Equation {
      return new Equation({
        equals: this.equals - equation.equals,
        x: this.x - equation.x,
        y: this.y - equation.y,
        z: this.z - equation.z,
        vX: this.vX - equation.vX,
        vY: this.vY - equation.vY,
        vZ: this.vZ - equation.vZ,
      });
    }

    eliminateEquation(
      equation: Equation,
      prop: 'x' | 'y' | 'z' | 'vX' | 'vY' | 'vZ'
    ): Equation {
      if (this[prop] === 0) return equation;
      if (equation[prop] === 0) return this;
      return this.subtract(equation.multiply(this[prop] / equation[prop]));
    }
  }

  function getHailStones(fileName: string): HailStone[] {
    const fs = require('fs');
    const hailstones: HailStone[] = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .map((b: string, index: number) => {
        let x: number = 0;
        let y: number = 0;
        let z: number = 0;
        let vX: number = 0;
        let vY: number = 0;
        let vZ: number = 0;
        b.replaceAll(/\s+/g, ' ')
          .split(' @ ')
          .forEach((c, i) => {
            if (i === 0) {
              [x, y, z] = c.split(' ').map((n) => parseInt(n));
            }
            if (i === 1) {
              [vX, vY, vZ] = c.split(' ').map((n) => parseInt(n));
            }
          });
        return new HailStone(x, y, z, vX, vY, vZ, index);
      });

    return hailstones;
  }

  const getFactors = (hailstone: HailStone): any[] => {
    const xRow = {
      const: hailstone.y * hailstone.vZ - hailstone.z * hailstone.vY,
      vZ: -hailstone.y,
      y: -hailstone.vZ,
      vY: hailstone.z,
      z: hailstone.vY,
    };
    const yRow = {
      const: hailstone.z * hailstone.vX - hailstone.x * hailstone.vZ,
      vX: -hailstone.z,
      z: -hailstone.vX,
      vZ: hailstone.x,
      x: hailstone.vZ,
    };
    const zRow = {
      const: hailstone.x * hailstone.vY - hailstone.y * hailstone.vX,
      vY: -hailstone.x,
      x: -hailstone.vY,
      vX: hailstone.y,
      y: hailstone.vX,
    };
    return [xRow, yRow, zRow];
  };

  const getFactorsDifference = (h1: HailStone, h2: HailStone): Equation[] => {
    const f1 = getFactors(h1);
    const f2 = getFactors(h2);
    const xRow: Equation = new Equation({
      vZ: f1[0].vZ - f2[0].vZ,
      y: f1[0].y - f2[0].y,
      vY: f1[0].vY - f2[0].vY,
      z: f1[0].z - f2[0].z,
      equals: f2[0].const - f1[0].const,
    });
    const yRow: Equation = new Equation({
      vX: f1[1].vX - f2[1].vX,
      z: f1[1].z - f2[1].z,
      vZ: f1[1].vZ - f2[1].vZ,
      x: f1[1].x - f2[1].x,
      equals: f2[1].const - f1[1].const,
    });
    const zRow: Equation = new Equation({
      vY: f1[2].vY - f2[2].vY,
      x: f1[2].x - f2[2].x,
      vX: f1[2].vX - f2[2].vX,
      y: f1[2].y - f2[2].y,
      equals: f2[2].const - f1[2].const,
    });
    return [xRow, yRow, zRow];
  };

  function getSixEquations(h1: HailStone, h2: HailStone, h3: HailStone) {
    return [...getFactorsDifference(h1, h2), ...getFactorsDifference(h1, h3)];
  }

  const isTest = false;
  const fileName = isTest ? './24/input-test.txt' : './24/input.txt';

  const hailstones = getHailStones(fileName);
  let equations = getSixEquations(hailstones[0], hailstones[1], hailstones[2]);

  const lastEquations: Equation[] = [];
  const props: ('x' | 'y' | 'z' | 'vX' | 'vY' | 'vZ')[] = [
    'x',
    'y',
    'z',
    'vX',
    'vY',
    'vZ',
  ];
  props.forEach((prop) => {
    equations.sort((a, b) => Math.abs(b[prop]) - Math.abs(a[prop]));
    lastEquations.push(equations.at(0)!);
    const nbrOfEquation = equations.filter((e) => e[prop]).length;
    // console.log({
    //   prop,
    //   equations,
    //   nbrOfEquations: equations.length,
    //   nbrOfEquation,
    //   lastEquations,
    // });
    const first = equations.shift()!;
    for (let i = 1; i <= nbrOfEquation - 1; i++) {
      const second = equations.shift()!;
      const equation = first.eliminateEquation(second, prop);
      equations.push(equation);
    }
  });

  let last = lastEquations.pop()!;
  const vZ = Math.round(last.equals / last.vZ);
  last = lastEquations.pop()!;
  const vY = Math.round((last.equals - last.vZ * vZ) / last.vY);
  last = lastEquations.pop()!;
  const vX = Math.round((last.equals - last.vZ * vZ - last.vY * vY) / last.vX);
  last = lastEquations.pop()!;
  const z = Math.round(
    (last.equals - last.vZ * vZ - last.vY * vY - last.vX * vX) / last.z
  );
  last = lastEquations.pop()!;
  const y = Math.round(
    (last.equals - last.vZ * vZ - last.vY * vY - last.vX * vX - last.z * z) /
      last.y
  );
  last = lastEquations.pop()!;
  const x = Math.round(
    (last.equals -
      last.vZ * vZ -
      last.vY * vY -
      last.vX * vX -
      last.z * z -
      last.y * y) /
      last.x
  );

  console.log({ x, y, z, vX, vY, vZ, sum: x + y + z });
}
