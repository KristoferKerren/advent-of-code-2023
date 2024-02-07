namespace adventOfCode9a {
  class Coord {
    constructor(public x: number, public y: number) {}
  }

  function getInput(fileName: string): string[][] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    return data
      .replaceAll('\r', '')
      .split('\n')
      .map((e) => e.split('').map((ee) => ee));
  }
  const sketch = getInput('./10/10-input.txt');

  function getPoint(coord: Coord): string {
    return sketch.at(coord.y)?.at(coord.x) || '';
  }

  function getStartingPoint(): Coord {
    const startingY = sketch.findIndex((row) => row.includes('S'));
    return {
      x: sketch.at(startingY)?.findIndex((col) => col === 'S') || 0,
      y: startingY,
    };
  }

  const atSouth = ['|', '7', 'F'];
  const atWest = ['-', 'J', '7'];
  const atNorth = ['|', 'L', 'J'];
  const atEast = ['-', 'L', 'F'];
  const startingPoint = getStartingPoint();

  function getStartingPointReplacement(startingPoint: Coord): {
    repl: string;
    endDir: 'north' | 'east' | 'south' | 'west';
  } {
    const northPoint = getPoint({ x: startingPoint.x, y: startingPoint.y - 1 });
    const isNorth = atSouth.includes(northPoint);
    const eastPoint = getPoint({ x: startingPoint.x + 1, y: startingPoint.y });
    const isEast = atWest.includes(eastPoint);
    const southPoint = getPoint({ x: startingPoint.x, y: startingPoint.y + 1 });
    const isSouth = atNorth.includes(southPoint);
    const westPoint = getPoint({ x: startingPoint.x - 1, y: startingPoint.y });
    const isWest = atEast.includes(westPoint);
    if (isNorth && !isEast && isSouth && !isWest)
      return { repl: '|', endDir: 'south' };
    if (!isNorth && isEast && !isSouth && isWest)
      return { repl: '-', endDir: 'west' };
    if (isNorth && isEast && !isSouth && !isWest)
      return { repl: 'L', endDir: 'east' };
    if (isNorth && !isEast && !isSouth && isWest)
      return { repl: 'J', endDir: 'west' };
    if (!isNorth && !isEast && isSouth && isWest)
      return { repl: '7', endDir: 'west' };
    if (!isNorth && isEast && isSouth && !isWest)
      return { repl: 'F', endDir: 'south' };
    console.log('NO STARTING POSITION FOUND');
    return { repl: '.', endDir: 'north' };
  }

  function getNextPoint(
    prevPoint: Coord,
    cameFrom: 'north' | 'east' | 'south' | 'west'
  ): { _nextPoint: Coord; _cameFrom: 'north' | 'east' | 'south' | 'west' } {
    //console.log(`NEXT POINT from cameFrom ${cameFrom}`);
    //console.log(nextPoint);
    //console.log(getPoint(prevPoint));
    const isNorth = atNorth.includes(getPoint(prevPoint));
    const isEast = atEast.includes(getPoint(prevPoint));
    const isSouth = atSouth.includes(getPoint(prevPoint));
    const isWest = atWest.includes(getPoint(prevPoint));
    //console.log({ isNorth, isEast, isSouth, isWest });
    if (['north', 'east', 'south'].includes(cameFrom) && isWest) {
      return {
        _nextPoint: { x: prevPoint.x - 1, y: prevPoint.y },
        _cameFrom: 'east',
      };
    }
    if (['north', 'east', 'west'].includes(cameFrom) && isSouth) {
      return {
        _nextPoint: { x: prevPoint.x, y: prevPoint.y + 1 },
        _cameFrom: 'north',
      };
    }
    if (['north', 'west', 'south'].includes(cameFrom) && isEast) {
      return {
        _nextPoint: { x: prevPoint.x + 1, y: prevPoint.y },
        _cameFrom: 'west',
      };
    }
    if (['west', 'east', 'south'].includes(cameFrom) && isNorth) {
      return {
        _nextPoint: { x: prevPoint.x, y: prevPoint.y - 1 },
        _cameFrom: 'south',
      };
    }
    console.log('NO Next POSITION FOUND');
    return { _nextPoint: { x: 0, y: 0 }, _cameFrom: 'north' };
  }

  const { repl, endDir } = getStartingPointReplacement(startingPoint);
  sketch[startingPoint.y][startingPoint.x] = repl;

  // console.log({ sketch, startingPoint });
  let nextPoint: Coord = { x: startingPoint.x, y: startingPoint.y };
  let cameFrom = endDir;
  let i = 0;
  console.log(
    nextPoint.x !== startingPoint.x || nextPoint.y !== startingPoint.y
  );
  while (
    (nextPoint.x !== startingPoint.x ||
      nextPoint.y !== startingPoint.y ||
      i === 0) &&
    i < 10000000
  ) {
    const { _nextPoint, _cameFrom } = getNextPoint(nextPoint, cameFrom);
    nextPoint = _nextPoint;
    cameFrom = _cameFrom;
    i++;
    //    console.log({ i, _nextPoint });
  }

  console.log(Math.floor(i / 2));
}
