function getMap(fileName) {
  const rawInput = require('fs').readFileSync(
    require('path').resolve(__dirname, fileName),
    'utf-8'
  );

  const map = rawInput.split(/\r?\n/).map((row) => row.split(''));

  return map;
}

function shiftMap(positions) {
  const firstKey = positions.keys().next().value;
  if (firstKey !== undefined) {
    positions.delete(firstKey);
    return toPosition(firstKey);
  }
  return undefined;
}

function toString(position) {
  if (position.xx !== undefined && position.yy !== undefined) {
    return `x${position.x}y${position.y}xx${position.xx}yy${position.yy}`;
  }
  return `x${position.x}y${position.y}`;
}

function toPosition(text) {
  const x = parseInt(text.substring(1, text.indexOf('y')));
  const y = parseInt(text.substring(text.indexOf('y') + 1, text.indexOf('xx')));
  const xx = parseInt(
    text.substring(text.indexOf('xx') + 2, text.indexOf('yy'))
  );
  const yy = parseInt(text.substring(text.indexOf('yy') + 2));
  return { x, y, xx, yy };
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

function logTotalPositions(i) {
  const totalPositions = new Map();
  //console.log('Map with total positions:');
  let totalTotal = 0;
  for (let y = 0; y < map.length; y++) {
    let row = map[y]
      .map((char, x) => {
        let total = 0;
        for (let yy = yyMin; yy <= yyMax; yy++) {
          for (let xx = xxMin; xx <= xxMax; xx++) {
            if (positions.has(toString({ x, y, xx: xx, yy: yy }))) {
              total++;
            }
          }
        }
        totalTotal += total;
        if (x === 5 && y === 5) {
          console.log({ i, total });
        }
        return total || (char === 'S' ? 'S' : char);
      })
      .join('');
    //console.log(row);
  }
  // console.log('------------------------------------------');
  // console.log({ totalTotal });
  // console.log('------------------------------------------');
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
    //mapper.set(`${x},${y}`, false);
    mapper.set(`${x},${y}`, { x: x + xMax, y, deltaXX: -1 });
  } else if (x >= xMax) {
    //mapper.set(`${x},${y}`, false);
    mapper.set(`${x},${y}`, { x: x - xMax, y, deltaXX: +1 });
  } else if (y < 0) {
    //mapper.set(`${x},${y}`, false);
    mapper.set(`${x},${y}`, { x, y: y + yMax, deltaYY: -1 });
  } else if (y >= yMax) {
    //mapper.set(`${x},${y}`, false);
    mapper.set(`${x},${y}`, { x, y: y - yMax, deltaYY: +1 });
  } else {
    mapper.set(`${x},${y}`, { x, y });
  }
  return mapper.get(`${x},${y}`);
};

function goStep() {
  const positionSize = positions.size;
  const newPositions = new Map();
  for (var i = 0; i < positionSize; i++) {
    const { x, y, xx, yy } = shiftMap(positions);
    const negXRes = checkInd(x - 1, y, xx, yy);
    const posXRes = checkInd(x + 1, y, xx, yy);
    const negYRes = checkInd(x, y - 1, xx, yy);
    const posYRes = checkInd(x, y + 1, xx, yy);

    [negXRes, posXRes, negYRes, posYRes]
      .filter((res) => res !== false)
      .forEach((res) => {
        if (res.deltaXX !== undefined) {
          xxMin = Math.min(xxMin, xx + (res.deltaXX ?? 0));
          xxMax = Math.max(xxMax, xx + (res.deltaXX ?? 0));
        }
        if (res.deltaYY !== undefined) {
          yyMin = Math.min(yyMin, yy + (res.deltaYY ?? 0));
          yyMax = Math.max(yyMax, yy + (res.deltaYY ?? 0));
        }
        newPositions.set(
          toString({
            x: res.x,
            y: res.y,
            xx: xx + (res.deltaXX ?? 0),
            yy: yy + (res.deltaYY ?? 0),
          })
        );
      });
  }

  newPositions.forEach((value, key) => {
    positions.set(key);
  });
  return positions;
}

function goSteps(nbrOfSteps) {
  console.time('Execution time');

  const { startX, startY } = getStartIndex();

  positions.set(toString({ x: startX, y: startY, xx: 0, yy: 0 }), 1);

  for (let i = 1; i <= nbrOfSteps; i++) {
    if (i % 10 === 0) console.log((i / nbrOfSteps) * 100 + '%');
    goStep();
    //logTotalPositions(i);
  }
  // logMap();
  console.log(positions.size);
  console.timeEnd('Execution time');
}

const mapper = new Map();

const map = getMap('./21-input.txt');
const xMax = map[0].length;
const yMax = map.length;
let positions = new Map();
let xxMin = 0;
let yyMin = 0;
let xxMax = 0;
let yyMax = 0;
//goSteps(327);
//
//let left = 0;
//let right = 0;
//let top = 0;
//let bottom = 0;
//let topleft = 0;
//let topright = 0;
//let bottomleft = 0;
//let bottomright = 0;
//for (var y = 0; y < yMax; y++) {
//  for (var x = 0; x < xMax; x++) {
//    if (positions.has(toString({ x, y, xx: -2, yy: 0 }))) left++;
//    if (positions.has(toString({ x, y, xx: 2, yy: 0 }))) right++;
//    if (positions.has(toString({ x, y, xx: 0, yy: -2 }))) top++;
//    if (positions.has(toString({ x, y, xx: 0, yy: 2 }))) bottom++;
//    if (positions.has(toString({ x, y, xx: -1, yy: -1 }))) topleft++;
//    if (positions.has(toString({ x, y, xx: 1, yy: -1 }))) topright++;
//    if (positions.has(toString({ x, y, xx: -1, yy: 1 }))) bottomleft++;
//    if (positions.has(toString({ x, y, xx: 1, yy: 1 }))) bottomright++;
//  }
//}
//
//console.log({
//  left,
//  right,
//  top,
//  bottom,
//  topleft,
//  topright,
//  bottomleft,
//  bottomright,
//});
//

const left = 5725;
const right = 5711;
const top = 5715;
const bottom = 5721;
const topleft = 6645;
const topright = 6647;
const bottomleft = 6657;
const bottomright = 6641;
const fullOdd = 40924885401;
const fullEven = 40925290000;
const rowsCols = 202300;

const tot =
  fullOdd * 7577 +
  fullEven * 7596 +
  rowsCols * (topleft + topright + bottomleft + bottomright) +
  (left + right + top + bottom);

console.log(tot);
//620962518745459
//620962490828335
console.log(620962518745459 - tot);
