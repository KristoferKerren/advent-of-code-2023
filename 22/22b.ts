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
      public index?: number,
      public isInvisible: boolean = false
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

  let doLog = false;
  function log(logThis: any) {
    if (doLog) {
      console.log(logThis);
    }
  }

  const isSupported = (support: Brick, top: Brick): boolean => {
    if (support.isInvisible) {
      return false;
    }
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

  function letThemFall(bricks: Brick[]): number {
    let nbrOfFallenBricks = 0;
    bricks.forEach((brick) => {
      let brickHasFallen = false;
      while (canFall(brick, bricks)) {
        brickHasFallen = true;
        log(`let brick ${brick.index} fall`);
        brick.zMin--;
        brick.zMax--;
      }
      nbrOfFallenBricks += brickHasFallen ? 1 : 0;
    });
    return nbrOfFallenBricks;
  }

  const bricks = getBricks('./22/input.txt');
  letThemFall(bricks);

  log(bricks);
  const fallBricksMap = new Map<number, number>();
  // for (let i = bricks.length - 1; i >= 0; i--) {
  //   const b = bricks[i];
  //   let count = 0;
  //   const bricksAbove = bricks.filter((b2) => b2.zMin === b.zMax + 1);
  //   const supportedBricks = bricksAbove.filter((b2) => isSupported(b, b2));
  //   supportedBricks.forEach((b2) => {
  //     const bricksBelow = bricks.filter((b3) => b3.zMax === b2.zMin - 1);
  //     const supportingBricks = bricksBelow.filter((b3) =>
  //       isSupported(b3, b2)
  //     ).length;
  //     if (supportingBricks === 1) {
  //       count += 1 + (fallBricksMap.get(b2.index || 0) || 0);
  //     }
  //   });
  //   if (count > 0) {
  //     fallBricksMap.set(b.index || 0, count);
  //   }
  // }

  bricks.forEach((b, i) => {
    if (i % 100 === 0) console.log(i / bricks.length);
    const copy: Brick[] = [];
    bricks.forEach((b) => {
      copy.push(
        new Brick(b.xMin, b.xMax, b.yMin, b.yMax, b.zMin, b.zMax, b.index)
      );
    });
    copy[i].isInvisible = true;
    const nbrOfFallenBricks = letThemFall(copy);
    if (nbrOfFallenBricks > 0) {
      fallBricksMap.set(b.index || 0, nbrOfFallenBricks);
    }
  });

  const total = [...fallBricksMap.values()].reduce((a, b) => a + b, 0);
  console.log({ fallBricksMap, total });
}
