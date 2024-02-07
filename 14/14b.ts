import { sum } from '../helpers';

namespace adventOfCode14a {
  function getPatterns(fileName: string): string[][] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    const dataArr = data.replaceAll('\r', '').split('\n');
    return dataArr.map((str) => str.split(''));
  }

  function getPatternsValue(): number {
    let res = 0;
    for (let x = 0; x <= maxX; x++) {
      for (let y = 0; y <= maxY; y++) {
        if (patterns[y][x] === 'O') {
          res += maxY + 1 - y;
        }
      }
    }
    return res;
  }

  const patterns = getPatterns('./14/14-input.txt');
  const maxY = patterns.length - 1;
  const maxX = patterns[0].length - 1;

  function moveStone(oldX: number, oldY: number, newX: number, newY: number) {
    patterns[oldY][oldX] = '.';
    patterns[newY][newX] = 'O';
  }

  function leanNorth() {
    for (let x = 0; x <= maxX; x++) {
      let firstAvailableRingY = 0;
      for (let y = 0; y <= maxY; y++) {
        if (patterns[y][x] === 'O') {
          moveStone(x, y, x, firstAvailableRingY);
          firstAvailableRingY++;
        }
        if (patterns[y][x] === '#') {
          firstAvailableRingY = y + 1;
        }
      }
    }
  }

  function leanEast() {
    for (let y = 0; y <= maxY; y++) {
      let firstAvailableRingX = maxX;
      for (let x = maxX; x >= 0; x--) {
        if (patterns[y][x] === 'O') {
          moveStone(x, y, firstAvailableRingX, y);
          firstAvailableRingX--;
        }
        if (patterns[y][x] === '#') {
          firstAvailableRingX = x - 1;
        }
      }
    }
  }

  function leanSouth() {
    for (let x = 0; x <= maxX; x++) {
      let firstAvailableRingY = maxY;
      for (let y = maxY; y >= 0; y--) {
        if (patterns[y][x] === 'O') {
          moveStone(x, y, x, firstAvailableRingY);
          firstAvailableRingY--;
        }
        if (patterns[y][x] === '#') {
          firstAvailableRingY = y - 1;
        }
      }
    }
  }

  function leanWest() {
    for (let y = 0; y <= maxY; y++) {
      let firstAvailableRingX = 0;
      for (let x = 0; x <= maxX; x++) {
        if (patterns[y][x] === 'O') {
          moveStone(x, y, firstAvailableRingX, y);
          firstAvailableRingX++;
        }
        if (patterns[y][x] === '#') {
          firstAvailableRingX = x + 1;
        }
      }
    }
  }

  function logPattern() {
    console.log('---------------------------------');
    console.log(patterns.map((arr) => arr.join('')).join('\n'));
    console.log('---------------------------------');
  }

  function oneCycle() {
    leanNorth();
    leanWest();
    leanSouth();
    leanEast();
  }

  let sums: number[] = [];
  for (let i = 1; i <= 500; i++) {
    oneCycle();
    sums.push(getPatternsValue());
  }

  const nbrOfCycles = 1000000000;
  for (let diffIndex = 1; diffIndex < 400; diffIndex++) {
    let diffIndexIsRight = true;
    for (let i = 150; i < sums.length - 1; i++) {
      if (sums[i] !== sums[i - diffIndex]) {
        diffIndexIsRight = false;
        break;
      }
    }
    if (diffIndexIsRight) {
      console.log(diffIndex);
      console.log({
        a: nbrOfCycles,
        b: Math.floor(nbrOfCycles / diffIndex),
        c: diffIndex * 1,
        d: nbrOfCycles - Math.floor(nbrOfCycles / diffIndex),
        e: (nbrOfCycles % diffIndex) + diffIndex * 5,
      });
      const hej = (nbrOfCycles % diffIndex) + diffIndex * 11;
      console.log(sums[hej - 1]);
      break;
    }
  }
}
