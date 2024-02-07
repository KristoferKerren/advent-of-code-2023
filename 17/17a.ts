import { memoize } from '../helpers';

namespace adventOfCode17a {
  class Coord {
    constructor(public x: number, public y: number) {}
  }

  function getInput(fileName: string) {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    const map = data
      .replaceAll('\r', '')
      .split('\n')
      .map((e) => e.split('').map((ee) => parseInt(ee)));
    return { map, maxY: map.length - 1, maxX: map[0].length - 1 };
  }
  const { map, maxX, maxY } = getInput('./17/17-input.txt');

  const startCoord = { x: 0, y: 0 };
  const endCoord = { x: maxX, y: maxY };

  const is4 = (dir: string, coords: Coord[]): boolean => {
    if (coords.length < 4) return false;
    const last = coords.at(-1) ?? { x: 0, y: 0 };
    const secondLast = coords.at(-2) ?? { x: 0, y: 0 };
    const thirdLast = coords.at(-3) ?? { x: 0, y: 0 };
    const fourthLast = coords.at(-4) ?? { x: 0, y: 0 };
    const deltaX1 = last.x - secondLast.x;
    const deltaX2 = secondLast.x - thirdLast.x;
    const deltaX3 = thirdLast.x - fourthLast.x;
    const deltaY1 = last.y - secondLast.y;
    const deltaY2 = secondLast.y - thirdLast.y;
    const deltaY3 = thirdLast.y - fourthLast.y;
    if (dir === 'Right') {
      return (
        deltaX1 === 1 &&
        deltaX2 === 1 &&
        deltaX3 === 1 &&
        deltaY1 === 0 &&
        deltaY2 === 0 &&
        deltaY3 === 0
      );
    }
    if (dir === 'Left') {
      return (
        deltaX1 === -1 &&
        deltaX2 === -1 &&
        deltaX3 === -1 &&
        deltaY1 === 0 &&
        deltaY2 === 0 &&
        deltaY3 === 0
      );
    }
    if (dir === 'Up') {
      return (
        deltaX1 === 0 &&
        deltaX2 === 0 &&
        deltaX3 === 0 &&
        deltaY1 === -1 &&
        deltaY2 === -1 &&
        deltaY3 === -1
      );
    }
    if (dir === 'Down') {
      return (
        deltaX1 === 0 &&
        deltaX2 === 0 &&
        deltaX3 === 0 &&
        deltaY1 === 1 &&
        deltaY2 === 1 &&
        deltaY3 === 1
      );
    }
    return false;
  };

  const goToStep = (
    x: number = startCoord.x,
    y: number = startCoord.y,
    heatLoss: number = -map[startCoord.y][startCoord.x],
    excludeDir: string[] = [],
    path: Coord[] = []
  ): boolean => {
    // console.log({ i: 1, x, y, heatLoss, excludeDir, path });

    if (path.some((coord) => coord.x === x && coord.y === y)) {
      return false;
    }

    heatLoss += map[y][x];
    path = path.concat(new Coord(x, y));
    if (x === 0) excludeDir.push('L');
    if (x === maxX) excludeDir.push('R');
    if (y === 0) excludeDir.push('U');
    if (y === maxY) excludeDir.push('D');
    if (is4('Right', path.slice(-4))) excludeDir.push('R');
    if (is4('Left', path.slice(-4))) excludeDir.push('L');
    if (is4('Up', path.slice(-4))) excludeDir.push('U');
    if (is4('Down', path.slice(-4))) excludeDir.push('D');

    // console.log({ i: 2, x, y, heatLoss, excludeDir, path });

    if (
      heatLoss + Math.abs(endCoord.x - x) + Math.abs(endCoord.y - y) >=
      currentMaxHeatLoss
    ) {
      return false;
    }

    if (x === endCoord.x && y === endCoord.y) {
      console.log({ path: path, heatLoss });
      currentMaxHeatLoss = Math.min(currentMaxHeatLoss, heatLoss);
      return true;
    }

    if (!excludeDir?.includes('D')) {
      if (goToStep(x, y + 1, heatLoss, ['U'], path)) {
        return true;
      }
    }
    if (!excludeDir?.includes('R')) {
      if (goToStep(x + 1, y, heatLoss, ['L'], path)) {
        return true;
      }
    }
    if (!excludeDir?.includes('U')) {
      if (goToStep(x, y - 1, heatLoss, ['D'], path)) {
        return true;
      }
    }
    if (!excludeDir?.includes('L')) {
      if (goToStep(x - 1, y, heatLoss, ['R'], path)) {
        return true;
      }
    }
    return false;
  };

  let currentMaxHeatLoss = 1221;
  let lowestFound = false;
  while (!lowestFound) {
    if (goToStep()) {
      console.log('Found a path');
    } else {
      console.log('No path found');
      lowestFound = true;
    }
  }
}
