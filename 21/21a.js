function getMap(fileName) {
  const rawInput = require('fs').readFileSync(
    require('path').resolve(__dirname, fileName),
    'utf-8'
  );

  const map = rawInput.split(/\r?\n/).map((row) => row.split(''));

  return map;
}

function logMap(map, positions) {
  console.log('Map:');
  console.log(positions);
  for (let y = 0; y < map.length; y++) {
    console.log(
      map[y]
        .map((char, x) => {
          return positions.some((coord) => coord.x === x && coord.y === y)
            ? 'O'
            : char;
        })
        .join('')
    );
  }
}

function getStartIndex(map) {
  let start = { x: -1, y: -1 };
  map.forEach((row, y) => {
    row.forEach((step, x) => {
      if (step === 'S') {
        start = { startX: x, startY: y };
      }
    });
  });
  return start;
}

function checkInd(map, x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return false;
  }
  return map[y][x] !== '#';
}

function addIfNotExists(positions, x, y) {
  if (!positions.some((coord) => coord.x === x && coord.y === y)) {
    positions.push({ x, y });
  }
}

function goStep(map, positions) {
  const nbrOfPositions = positions.length;
  for (var i = 0; i < nbrOfPositions; i++) {
    const { x, y } = positions.shift();
    if (checkInd(map, x - 1, y)) addIfNotExists(positions, x - 1, y);
    if (checkInd(map, x + 1, y)) addIfNotExists(positions, x + 1, y);
    if (checkInd(map, x, y - 1)) addIfNotExists(positions, x, y - 1);
    if (checkInd(map, x, y + 1)) addIfNotExists(positions, x, y + 1);
  }
  return positions;
}

function goSteps(nbrOfSteps) {
  console.time('Execution time');

  const map = getMap('./21-input.txt');
  const { startX, startY } = getStartIndex(map);

  let positions = [{ x: startX, y: startY }];
  for (let i = 0; i < nbrOfSteps; i++) {
    goStep(map, positions.length);
  }

  console.log(positions.length);
  console.timeEnd('Execution time');
}

goSteps(64);
