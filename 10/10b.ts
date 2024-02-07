namespace adventOfCode9a {
  class Coord {
    constructor(public x: number, public y: number) {}
  }

  class Point {
    constructor(
      public value: string,
      public isInMainPath?: boolean,
      public isInOrigArray?: boolean
    ) {}
  }

  function getInput(fileName: string): Point[][] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    return data
      .replaceAll('\r', '')
      .split('\n')
      .map((e) => e.split('').map((ee) => new Point(ee, false, true)));
  }
  const sketch = getInput('./10/10-input.txt');

  function getPoint(coord: Coord): Point {
    if (!sketch[coord.y]) {
      return new Point('?');
    }
    return sketch[coord.y][coord.x] || new Point('?');
  }

  function getStartingPoint(): Coord {
    const startingY = sketch.findIndex(
      (row) => row.findIndex((p) => p.value === 'S') !== -1
    );
    return {
      x: sketch.at(startingY)?.findIndex((col) => col.value === 'S') || 0,
      y: startingY,
    };
  }

  const atSouth = ['|', '7', 'F'];
  const atWest = ['-', 'J', '7'];
  const atNorth = ['|', 'L', 'J'];
  const atEast = ['-', 'L', 'F'];
  const isSouth = (coord: Coord) => atSouth.includes(getPoint(coord).value);
  const isWest = (coord: Coord) => atWest.includes(getPoint(coord).value);
  const isNorth = (coord: Coord) => atNorth.includes(getPoint(coord).value);
  const isEast = (coord: Coord) => atEast.includes(getPoint(coord).value);
  const startingPoint = getStartingPoint();

  function Sketch(title: string) {
    console.log(`-------------- ${title} --------------`);
    sketch.forEach((row) => {
      console.log(row?.map((xx) => xx.value).join(' ') + '\n');
    });
  }

  function getStartingPointReplacement(startingPoint: Coord): {
    repl: string;
    endDir: 'north' | 'east' | 'south' | 'west';
  } {
    const _isNorth = isSouth({ x: startingPoint.x, y: startingPoint.y - 1 });
    const _isEast = isWest({ x: startingPoint.x + 1, y: startingPoint.y });
    const _isSouth = isNorth({ x: startingPoint.x, y: startingPoint.y + 1 });
    const _isWest = isEast({ x: startingPoint.x - 1, y: startingPoint.y });
    console.log({ _isNorth, _isEast, _isSouth, _isWest });
    if (_isNorth && !_isEast && _isSouth && !_isWest)
      return { repl: '|', endDir: 'south' };
    if (!_isNorth && _isEast && !_isSouth && _isWest)
      return { repl: '-', endDir: 'west' };
    if (_isNorth && _isEast && !_isSouth && !_isWest)
      return { repl: 'L', endDir: 'east' };
    if (_isNorth && !_isEast && !_isSouth && _isWest)
      return { repl: 'J', endDir: 'west' };
    if (!_isNorth && !_isEast && _isSouth && _isWest)
      return { repl: '7', endDir: 'west' };
    if (!_isNorth && _isEast && _isSouth && !_isWest)
      return { repl: 'F', endDir: 'south' };
    console.log('NO STARTING POSITION FOUND');
    return { repl: '.', endDir: 'north' };
  }

  function getNextPoint(
    prevPoint: Coord,
    cameFrom: 'north' | 'east' | 'south' | 'west'
  ): { _nextPoint: Coord; _cameFrom: 'north' | 'east' | 'south' | 'west' } {
    const _isNorth = isNorth(prevPoint);
    const _isEast = isEast(prevPoint);
    const _isSouth = isSouth(prevPoint);
    const _isWest = isWest(prevPoint);
    if (['north', 'east', 'south'].includes(cameFrom) && _isWest) {
      return {
        _nextPoint: { x: prevPoint.x - 1, y: prevPoint.y },
        _cameFrom: 'east',
      };
    }
    if (['north', 'east', 'west'].includes(cameFrom) && _isSouth) {
      return {
        _nextPoint: { x: prevPoint.x, y: prevPoint.y + 1 },
        _cameFrom: 'north',
      };
    }
    if (['north', 'west', 'south'].includes(cameFrom) && _isEast) {
      return {
        _nextPoint: { x: prevPoint.x + 1, y: prevPoint.y },
        _cameFrom: 'west',
      };
    }
    if (['west', 'east', 'south'].includes(cameFrom) && _isNorth) {
      return {
        _nextPoint: { x: prevPoint.x, y: prevPoint.y - 1 },
        _cameFrom: 'south',
      };
    }
    console.log('NO Next POSITION FOUND');
    return { _nextPoint: { x: 0, y: 0 }, _cameFrom: 'north' };
  }

  function markAs0Recursive(
    coord: Coord,
    skip: ('north' | 'east' | 'south' | 'west')[] = [],
    level: number = 0
  ) {
    if (getPoint(coord).value !== '.') {
      return;
    }

    const yMax = sketch.length - 1;
    const xMax = sketch[0].length - 1;
    if (coord.x === 0) {
      skip.push('north', 'west', 'south');
    }
    if (coord.y === 0) {
      skip.push('north', 'west', 'east');
    }
    if (coord.x === xMax) {
      skip.push('north', 'east', 'south');
    }
    if (coord.y === yMax) {
      skip.push('west', 'east', 'south');
    }

    // if (level === 0 && (coord.x !== 0 || coord.y !== 72)) {
    //   return;
    // }
    getPoint(coord).value = ' ';
    // console.log({ level, coord, skip });
    // if (level > 3) {
    //   return;
    // }
    if (!skip?.includes('north')) {
      //console.log('GO NORTH');
      markAs0Recursive({ x: coord.x, y: coord.y - 1 }, ['south'], level + 1);
    }
    if (!skip?.includes('south')) {
      //console.log('GO SOUTH');
      markAs0Recursive({ x: coord.x, y: coord.y + 1 }, ['north'], level + 1);
    }
    if (!skip?.includes('east')) {
      //console.log('GO EAST!');
      markAs0Recursive({ x: coord.x + 1, y: coord.y }, ['west'], level + 1);
    }
    if (!skip?.includes('west')) {
      //console.log('GO WEST');
      markAs0Recursive({ x: coord.x - 1, y: coord.y }, ['east'], level + 1);
    }
  }

  const { repl, endDir } = getStartingPointReplacement(startingPoint);
  sketch[startingPoint.y][startingPoint.x] = new Point(repl, true);

  let nextPoint: Coord = { x: startingPoint.x, y: startingPoint.y };
  let cameFrom = endDir;
  let i = 0;
  while (
    (nextPoint.x !== startingPoint.x ||
      nextPoint.y !== startingPoint.y ||
      i === 0) &&
    i < 10000000
  ) {
    const { _nextPoint, _cameFrom } = getNextPoint(nextPoint, cameFrom);
    sketch[_nextPoint.y][_nextPoint.x].isInMainPath = true;

    nextPoint = _nextPoint;
    cameFrom = _cameFrom;
    i++;
  }

  sketch.forEach((row) => {
    row?.forEach((p, x, arr) => {
      if (!p.isInMainPath) {
        arr[x].value = '.';
      }
    });
  });

  // printSketch('After removing all nonMainPath');

  let _count = 0;
  sketch.forEach((row, yy) => {
    let shouldCount = false;
    let prevIsInMainPath: boolean | undefined;
    row.forEach((p, xx) => {
      if (prevIsInMainPath && !p.isInMainPath) {
        console.log({ yy, xx });
        // look up
        let countUpWards = 0;
        let prevYIsMainPath = false;
        for (let qw = 0; qw < yy - 1; qw++) {
          if (prevYIsMainPath && !sketch[qw][xx].isInMainPath) {
            countUpWards++;
          }
          prevIsInMainPath = sketch[qw][xx].isInMainPath;
        }
        if (countUpWards % 2 === 1) {
          shouldCount = true;
        }
        console.log({ shouldCount });
      }
      if (p.isInMainPath) {
        shouldCount = false;
      }
      if (shouldCount) {
        _count += 1;
      }
      prevIsInMainPath = p.isInMainPath;
    });
    console.log({ yy, _count });
  });

  console.log({ _count });

  for (let yInd = sketch.length - 1; yInd >= 0; yInd--) {
    sketch.splice(
      yInd + 1,
      0,
      sketch[yInd].map((_) => new Point('.'))
    );
  }

  sketch.forEach((row) => {
    for (let xInd = row.length - 1; xInd >= 0; xInd--) {
      row.splice(xInd + 1, 0, new Point('.'));
    }
  });

  //printSketch('After adding extra col/rows');

  sketch.forEach((yy, yInd, yArr) => {
    yy.forEach((xx, xInd, xArr) => {
      const northCoord: Coord = { x: xInd, y: yInd - 1 };
      const eastCoord: Coord = { x: xInd + 1, y: yInd };
      const southCoord: Coord = { x: xInd, y: yInd + 1 };
      const westCoord: Coord = { x: xInd - 1, y: yInd };
      const northPoint = getPoint(northCoord);
      const eastPoint = getPoint(eastCoord);
      const southPoint = getPoint(southCoord);
      const westPoint = getPoint(westCoord);
      if (
        northPoint.isInMainPath &&
        southPoint.isInMainPath &&
        isSouth(northCoord) &&
        isNorth(southCoord)
      ) {
        xArr[xInd].value = '|';
      }
      if (
        eastPoint.isInMainPath &&
        westPoint.isInMainPath &&
        isWest(eastCoord) &&
        isEast(westCoord)
      ) {
        xArr[xInd].value = '-';
      }
    });
  });

  //printSketch('After replacing with - and |');

  let y = 0;
  let onlyZeros = true;
  console.log(sketch.length);
  while (onlyZeros) {
    onlyZeros = sketch[y].every((p) => p.value === '.');
    if (onlyZeros) {
      sketch.splice(y, 1);
    }
  }

  y = sketch.length - 1;
  onlyZeros = true;
  while (onlyZeros) {
    onlyZeros = sketch[y].every((p) => p.value === '.');
    if (onlyZeros) {
      sketch.splice(y, 1);
    }
    y--;
  }

  //printSketch('Before replacing with 0');
  const yMax = sketch.length - 1;
  const xMax = sketch[0].length - 1;
  console.log({ xMax, yMax });
  sketch.forEach((row, yy) => {
    row.forEach((_, xx) => {
      if (yy === 0 || xx === 0 || yy === yMax || xx === xMax) {
        markAs0Recursive({ x: xx, y: yy });
      }
    });
  });

  let count = 0;
  sketch.forEach((row, yy, yArr) => {
    row.forEach((col, xx, xArr) => {
      const point = getPoint({ x: xx, y: yy });
      if (point.isInOrigArray && point.value === '.') {
        count++;
      }
    });
  });
  console.log({ count });
  //printSketch('After replacing with 0');
}
