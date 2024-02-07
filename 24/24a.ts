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

  class Crash {
    constructor(
      public h1: number,
      public h2: number,
      public x: number,
      public y: number,
      public time1: number,
      public time2: number
    ) {}
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

  const getCrash = (h1: HailStone, h2: HailStone): Crash | null => {
    if (h1.vY * h2.vX === h1.vX * h2.vY) {
      console.log({ isParalell: true, h1, h2 });
      return null;
    }
    // v1x*t1 + x1 = v2x*t2 + x2
    // v1y*t1 + y1 = v2y*t2 + y2
    // t1 = (v2x*t2 + x2 - x1) / v1x
    // v1y*((v2x*t2 + x2 - x1) / v1x) + y1 = v2y*t2 + y2
    // v1y*(v2x*t2 + x2 - x1) + y1 * v1x = v2y*v1x*t2 + v1x*y2
    // v1y*v2x*t2 + v1y*x2 - v1y*x1 + y1 * v1x = v2y*v1x*t2 + v1x*y2
    // t2 = (v1x*y2 - v1y*x2 +  v1y*x1 - y1 * v1x) / (v1y*v2x - v1x*v2y)

    const time2 =
      (h1.vX * h2.y - h1.vY * h2.x + h1.vY * h1.x - h1.y * h1.vX) /
      (h1.vY * h2.vX - h1.vX * h2.vY);
    const time1 = (h2.vX * time2 + h2.x - h1.x) / h1.vX;
    if (time1 > 0 && time2 > 0) {
      const crashX = h1.x + h1.vX * time1;
      const crashY = h1.y + h1.vY * time1;
      if (
        crashX >= minPos &&
        crashX <= maxPos &&
        crashY >= minPos &&
        crashY <= maxPos
      )
        return new Crash(
          h1.index,
          h2.index,
          Math.round(crashX * 1e6) / 1e6,
          Math.round(crashY * 1e6) / 1e6,
          time1,
          time2
        );
    }
    return null;
  };

  function getCrashes(hailstones: HailStone[]): Crash[] {
    const crashes: Crash[] = [];
    hailstones.forEach((h1, i) => {
      hailstones.forEach((h2, j) => {
        if (i < j) {
          const crash = getCrash(h1, h2);
          if (crash) {
            crashes.push(crash);
          }
        }
      });
    });
    return crashes;
  }

  const isTest = false;
  const fileName = isTest ? './24/input-test.txt' : './24/input.txt';
  const minPos = isTest ? 7 : 200000000000000;
  const maxPos = isTest ? 27 : 400000000000000;

  const hailstones = getHailStones(fileName);
  const crashes = getCrashes(hailstones);
  // console.log(hailstones);
  console.log(crashes.length);
}
