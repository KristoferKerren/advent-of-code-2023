function getMap(fileName) {
  const rawInput = require('fs').readFileSync(
    require('path').resolve(__dirname, fileName),
    'utf-8'
  );

  const map = rawInput.split(/\r?\n/).map((row) => row.split(''));

  return map;
}

function toString(position) {
  return `x${position.x}y${position.y}`;
}

function toPosition(text) {
  const x = parseInt(text.substring(1, text.indexOf('y')));
  const y = parseInt(text.substring(text.indexOf('y') + 1));
  return { x, y };
}

function logMap(positions) {
  console.log('Map:');
  for (let y = 0; y < map.length; y++) {
    const row = map[y]
      .map((char, x) => {
        return positions.has(toString({ x, y }))
          ? positions.get(toString({ x, y }))
          : char;
      })
      .join('');
    console.log(row);
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

const checkInd = (x, y) => {
  if (mapper.has(`${x},${y}`)) return mapper.get(`${x},${y}`);
  // console.log({
  //   x: (x + xMax) % xMax,
  //   y: (y + yMax) % yMax,
  //   xMax: xMax,
  //   yMax: yMax,
  //   val: map[(y + yMax) % yMax].at((x + xMax) % xMax),
  // });
  if (map[(y + yMax) % yMax][(x + xMax) % xMax] === '#') {
    mapper.set(`${x},${y}`, false);
  } else if (x < 0) {
    mapper.set(`${x},${y}`, { x: x + xMax, y, deltaXX: -1 });
  } else if (x >= xMax) {
    mapper.set(`${x},${y}`, { x: x - xMax, y, deltaXX: +1 });
  } else if (y < 0) {
    mapper.set(`${x},${y}`, { x, y: y + yMax, deltaYY: -1 });
  } else if (y >= yMax) {
    mapper.set(`${x},${y}`, { x, y: y - yMax, deltaYY: +1 });
  } else {
    mapper.set(`${x},${y}`, { x, y });
  }
  return mapper.get(`${x},${y}`);
};

function goStep(positions) {
  const newPositions = new Map();

  console.log(positions);
  for (let key of positions.keys()) {
    const { x, y } = toPosition(key);
    const val = positions.get(key);
    console.log(val);

    const negXRes = checkInd(x - 1, y);
    const posXRes = checkInd(x + 1, y);
    const negYRes = checkInd(x, y - 1);
    const posYRes = checkInd(x, y + 1);

    [negXRes, posXRes, negYRes, posYRes]
      .filter((res) => res !== false)
      .forEach((res) => {
        // if (res.deltaXX !== undefined) {
        //   xxMin = Math.min(xxMin, res.deltaXX);
        //   xxMax = Math.max(xxMax, res.deltaXX);
        // }
        // if (res.deltaYY !== undefined) {
        //   yyMin = Math.min(yyMin, res.deltaYY);
        //   yyMax = Math.max(yyMax, res.deltaYY);
        // }
        const oldValue = newPositions.get(key) || 0;
        console.log(oldValue);
        const newValue =
          res.deltaXX === undefined && res.deltaYY === undefined
            ? Math.max(oldValue, val)
            : oldValue + val;
        newPositions.set(
          toString({
            x: res.x,
            y: res.y,
          }),
          newValue
        );
      });
  }
  // console.log(newPositions);

  positions = newPositions;
  return positions;
}

function goSteps(nbrOfSteps) {
  console.time('Execution time');

  const { startX, startY } = getStartIndex();

  let positions = new Map();
  positions.set(toString({ x: startX, y: startY }), 1);
  // logMap(positions);

  for (let i = 1; i <= nbrOfSteps; i++) {
    if (i % 100 === 0) console.log((i / nbrOfSteps) * 100 + '%');
    positions = goStep(positions);
    //console.log(positions);
    logMap(positions);
  }
  console.log([...positions.values()].reduce((a, b) => a + b));
  console.timeEnd('Execution time');
}

const mapper = new Map();

const map = getMap('./21-input-test.txt');
const xMax = map[0].length;
const yMax = map.length;
goSteps(2);
