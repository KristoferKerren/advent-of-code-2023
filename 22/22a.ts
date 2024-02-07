import { memoize } from '../helpers';

namespace adventOfCode22a {
  class Brick {
    constructor(
      public xMin: number,
      public xMax: number,
      public yMin: number,
      public yMax: number,
      public zMin: number,
      public zMax: number,
      public index?: number
    ) {}
  }

  function getBricks(fileName: string): Brick[] {
    const fs = require('fs');
    const bricks: Brick[] = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .map((b: string, index: number) => {
        let xMin: number = 0;
        let xMax: number = 0;
        let yMin: number = 0;
        let yMax: number = 0;
        let zMin: number = 0;
        let zMax: number = 0;
        b.split('~').forEach((c, i) => {
          if (i === 0) {
            [xMin, yMin, zMin] = c.split(',').map((n) => parseInt(n));
          }
          if (i === 1) {
            [xMax, yMax, zMax] = c.split(',').map((n) => parseInt(n));
          }
        });
        return new Brick(xMin, xMax, yMin, yMax, zMin, zMax);
      });

    bricks.sort((a, b) => a.zMin - b.zMin).forEach((b, i) => (b.index = i));
    return bricks;
  }

  function log(logThis: any, doLog: boolean = false) {
    if (doLog) {
      console.log(logThis);
    }
  }

  const isSupported = (support: Brick, top: Brick): boolean => {
    if (support.index === top.index) {
      return false;
    }
    if (support.zMax !== top.zMin - 1) {
      return false;
    }
    const xCond =
      (top.xMin <= support.xMax && top.xMin >= support.xMin) ||
      (top.xMax <= support.xMax && top.xMax >= support.xMin) ||
      (top.xMin >= support.xMin && top.xMax <= support.xMax) ||
      (top.xMin <= support.xMin && top.xMax >= support.xMax);
    const yCond =
      (top.yMin <= support.yMax && top.yMin >= support.yMin) ||
      (top.yMax <= support.yMax && top.yMax >= support.yMin) ||
      (top.yMin >= support.yMin && top.yMax <= support.yMax) ||
      (top.yMin <= support.yMin && top.yMax >= support.yMax);
    return xCond && yCond;
  };

  const canFall = (brick: Brick, bricks: Brick[]): boolean => {
    log('-------------------- canFall -------------------');
    log(brick);
    if (brick.zMin <= 1) {
      return false;
    }
    const oneBrickInTheWay = bricks.some((b) => isSupported(b, brick));
    log({ checkZ: brick.zMin <= 1, oneBrickInTheWay });

    return !oneBrickInTheWay;
  };

  function letThemFall(bricks: Brick[], doLog: boolean = false): void {
    bricks.forEach((brick) => {
      while (canFall(brick, bricks)) {
        log(`let brick ${brick.index} fall`, doLog);
        brick.zMin--;
        brick.zMax--;
      }
    });
  }

  const bricks = getBricks('./22/input.txt');
  letThemFall(bricks);
  letThemFall(bricks, true);

  log(bricks);
  let count = 0;
  bricks.forEach((b, i) => {
    const bricksAbove = bricks.filter((b2) => b2.zMin === b.zMax + 1);
    const supportedBricks = bricksAbove.filter((b2) => isSupported(b, b2));
    const supportIsStillCool = supportedBricks.every((b2) => {
      const bricksBelow = bricks.filter((b3) => b3.zMax === b2.zMin - 1);
      const supportingBricks = bricksBelow.filter((b3) =>
        isSupported(b3, b2)
      ).length;
      return supportingBricks > 1;
    });
    if (supportedBricks.length === 0 || supportIsStillCool) {
      count++;
    }
  });
  console.log(count);
}
