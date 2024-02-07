function getMap(fileName) {
  const rawInput = require('fs').readFileSync(
    require('path').resolve(__dirname, fileName),
    'utf-8'
  );

  const map = rawInput.split(/\r?\n/).map((row) => row.split(''));

  return map;
}

function logMap() {
  console.log('Map:');
  for (let yy = yyMin; yy <= yyMax; yy++) {
    for (let y = 0; y < map.length; y++) {
      let row = '';
      for (let xx = xxMin; xx <= xxMax; xx++) {
        row += map[y]
          .map((char, x) => {
            if (x === 5 && y === 5 && xx === 0 && yy === 0) return 'S';
            return positions.has(toString({ x, y, xx: xx, yy: yy }))
              ? 'O'
              : char === 'S'
              ? '.'
              : char;
          })
          .join('');
        row += '|';
      }
      console.log(row);
    }
    console.log('------------------------------------------');
  }
}

function getStartIndex() {
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

const map = getMap('./21-input-test-own-simple.txt');
const { startX, startY } = getStartIndex();
const xMax = map[0].length;
const yMax = map.length;

for (var j = 0; j < 2; j++) {
  const nbrOfSteps = startX + j * xMax;
  const horizontalMaps = Math.floor(nbrOfSteps / xMax);
  const stepsFromStartToBorder = xMax - startX - 1;
  const lastMapXIndex = (nbrOfSteps - stepsFromStartToBorder) % xMax;
  const startIsEven = startX % 2 === 0;
  if (
    xMax !== yMax ||
    startX !== startY ||
    lastMapXIndex !== 0 ||
    !startIsEven
  ) {
    console.log('ERROR: Not all assumptions met');
  }
  const nbrOfStepsIsEven = nbrOfSteps % 2 === 0;

  function shouldNotCount(x, y) {
    if (!nbrOfStepsIsEven && x % 2 === y % 2) return true;
    if (nbrOfStepsIsEven && x % 2 !== y % 2) return true;
    return map[y][x] === '#';
  }

  let nbrOfPlotsPerFullMap = 0;
  for (var y = 0; y < yMax; y += 1) {
    for (var x = 0; x < xMax; x += 1) {
      if (shouldNotCount(x, y)) continue;
      nbrOfPlotsPerFullMap++;
    }
    console.log({ y, nbrOfPlotsPerFullMap });
  }

  let nbrOfPlotsInCross = 0;
  for (var y = 0; y < yMax; y += 1) {
    if (!shouldNotCount(x, y)) {
      nbrOfPlotsInCross++;
    }
    if (!shouldNotCount(xMax - x, y)) {
      nbrOfPlotsInCross++;
    }
  }

  let middle = Math.floor(xMax / 2);

  let nbrOfPlotsInSouthWestCorner = 0;
  for (var y = 0; y < middle; y += 1) {
    for (let x = 0; x <= y; x += 1) {
      if (!shouldNotCount(x, y)) {
        nbrOfPlotsInSouthWestCorner++;
      }
    }
  }

  let nbrOfPlotsInSouthEastMap = 0;
  for (var y = middle; y < yMax; y += 1) {
    for (let x = 0; x < y - middle; x += 1) {
      if (!shouldNotCount(x, y)) {
        nbrOfPlotsInSouthEastMap++;
      }
    }
  }

  let nbrOfPlotsInNorthWestMap = 0;
  for (var y = 0; y < middle; y += 1) {
    for (let x = 0; x < middle - y; x += 1) {
      if (!shouldNotCount(x, y)) {
        nbrOfPlotsInNorthWestMap++;
      }
    }
  }

  let nbrOfPlotsInNorthEastMap = 0;
  for (var y = 0; y < middle; y += 1) {
    for (let x = y; x < middle; x += 1) {
      if (!shouldNotCount(x, y)) {
        nbrOfPlotsInNorthEastMap++;
      }
    }
  }

  let nbrOfTotalMaps = 0;
  let delta = 1;
  for (var i = 0; i <= horizontalMaps; i++) {
    nbrOfTotalMaps += (i == horizontalMaps ? 1 : 2) * delta;
    delta += 2;
  }

  const total =
    nbrOfTotalMaps * nbrOfPlotsPerFullMap -
    nbrOfPlotsInSouthWestCorner -
    nbrOfPlotsInSouthEastMap -
    nbrOfPlotsInNorthWestMap -
    nbrOfPlotsInNorthEastMap;

  console.log({
    j,
    nbrOfTotalMaps,
    nbrOfPlotsPerFullMap,
    nbrOfPlotsInSouthWestCorner,
    nbrOfPlotsInSouthEastMap,
    nbrOfPlotsInNorthWestMap,
    nbrOfPlotsInNorthEastMap,
    nbrOfSteps,
    total,
  });
}
