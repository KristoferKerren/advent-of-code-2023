namespace adventOfCode21b {
  class Position {
    constructor(
      public x: number,
      public y: number,
      public value: number = 0,
      public neighbours: {
        isThroughBorder: boolean;
        position: Position;
      }[] = []
    ) {}
  }
  function getMap(fileName: string): {
    map: string[][];
    positions: Map<string, Position>;
    startX: number;
    startY: number;
  } {
    const rawInput = require('fs').readFileSync(
      require('path').resolve(__dirname, fileName),
      'utf-8'
    );

    let startX = -1;
    let startY = -1;
    const map: string[][] = rawInput
      .split(/\r?\n/)
      .map((row: string) => row.split(''));
    const xMax = map[0].length - 1;
    const yMax = map.length - 1;
    const positions: Map<string, Position> = new Map();
    for (let y = 0; y <= yMax; y++) {
      for (let x = 0; x <= xMax; x++) {
        if (map[y][x] !== '#') {
          positions.set(`${x},${y}`, new Position(x, y));
        }
        if (map[y][x] === 'S') {
          startX = x;
          startY = y;
        }
      }
    }

    function addNeighbourIfValid(
      position: Position,
      nx: number,
      ny: number,
      maxX: number,
      maxY: number
    ) {
      if (!position) return;
      const isThroughBorder = nx < 0 || nx > maxX || ny < 0 || ny > maxY;
      const myX = (nx + maxX) % maxX;
      const myY = (ny + maxY) % maxY;
      if (positions.get(`${myX},${myY}`)) {
        position.neighbours?.push({
          isThroughBorder: isThroughBorder,
          position: positions.get(`${myX},${myY}`)!,
        });
      }
    }

    map.forEach((row, y) => {
      row.forEach((char, x) => {
        const position = positions.get(`${x},${y}`)!;
        addNeighbourIfValid(position, x - 1, y, xMax, yMax);
        addNeighbourIfValid(position, x + 1, y, xMax, yMax);
        addNeighbourIfValid(position, x, y - 1, xMax, yMax);
        addNeighbourIfValid(position, x, y + 1, xMax, yMax);
      });
    });

    return { map, positions, startX, startY };
  }

  function logMap() {
    console.log('Map:');
    map.forEach((row, y) => {
      const logRow = row
        .map((char, x) => {
          const pos = positions.get(`${x},${y}`)!;
          return pos?.value ? pos.value : char;
        })
        .join('');
      console.log(logRow);
    });
  }

  function shiftMap(positions: Map<string, Position>) {
    const firstKey = positions.keys().next().value;
    if (firstKey !== undefined) {
      positions.delete(firstKey);
      return { key: firstKey, value: positions.get(firstKey) };
    }
    return undefined;
  }

  // const checkInd = (x, y) => {
  //   if (mapper.has(`${x},${y}`)) return mapper.get(`${x},${y}`);
  //   // console.log({
  //   //   x: (x + xMax) % xMax,
  //   //   y: (y + yMax) % yMax,
  //   //   xMax: xMax,
  //   //   yMax: yMax,
  //   //   val: map[(y + yMax) % yMax].at((x + xMax) % xMax),
  //   // });
  //   if (map[(y + yMax) % yMax][(x + xMax) % xMax] === '#') {
  //     mapper.set(`${x},${y}`, false);
  //   } else if (x < 0) {
  //     mapper.set(`${x},${y}`, { x: x + xMax, y, deltaXX: -1 });
  //   } else if (x >= xMax) {
  //     mapper.set(`${x},${y}`, { x: x - xMax, y, deltaXX: +1 });
  //   } else if (y < 0) {
  //     mapper.set(`${x},${y}`, { x, y: y + yMax, deltaYY: -1 });
  //   } else if (y >= yMax) {
  //     mapper.set(`${x},${y}`, { x, y: y - yMax, deltaYY: +1 });
  //   } else {
  //     mapper.set(`${x},${y}`, { x, y });
  //   }
  //   return mapper.get(`${x},${y}`);
  // };
  function goStep(isEven: boolean) {
    for (let entries of positions.entries()) {
      const key = entries[0];
      const position = entries[1];
      if (position.value === 0) continue;
      if (!isEven && (position.x + position.y) % 2 === 1) continue;
      if (isEven && (position.x + position.y) % 2 === 0) continue;
      position.neighbours.forEach((pos) => {
        pos.position.value = position.value;
      });
      position.value = 0;
    }
  }

  function goSteps(nbrOfSteps: number) {
    console.time('Execution time');

    positions.get(`${startX},${startY}`)!.value = 1;

    for (let i = 1; i <= nbrOfSteps; i++) {
      if (i % 100 === 0) console.log((i / nbrOfSteps) * 100 + '%');
      goStep(i % 2 === 0);
      logMap();
    }
    console.timeEnd('Execution time');
  }

  let { map, positions, startX, startY } = getMap('./21-input-test.txt');
  goSteps(6);
  console.log(
    [...positions.values()]
      .map((v) => v.value)
      .filter((v) => v > 0)
      .reduce((a, b) => a + b)
  );
}
