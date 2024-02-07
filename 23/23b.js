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
  for (let y = 0; y < map.length; y++) {
    console.log(
      map[y]
        .map((char, x) => {
          return char;
        })
        .join('')
    );
  }
}

function getStartIndex(map) {
  return { x: 1, y: 0 };
}

isCrossingMap = new Map();
function isCrossing(x, y) {
  const cache = isCrossingMap.get(`${x},${y}`);
  if (cache !== undefined) return cache;
  let res = true;
  if (x === 0 || x === maxX || y === 0 || y === maxY) {
    res = false;
  }
  if (map[y][x] === '#') {
    res = false;
  }
  if (res) {
    res =
      [map[y][x - 1], map[y][x + 1], map[y - 1][x], map[y + 1][x]].filter(
        (char) => char !== '#'
      ).length >= 3;
  }
  isCrossingMap.set(`${x},${y}`, res);
  return res;
}

checkIndMap = new Map();
function checkInd(x, y, dir, oldDir) {
  const cache = checkIndMap.get(`${x},${y},${dir}, ${oldDir}`);
  if (cache !== undefined) return cache;
  let res = true;
  if (x < 0 || x > maxX || y < 0 || y > maxY) {
    res = false;
  }
  if (res && map[y][x] === '#') {
    res = false;
  }
  if (oldDir === 'east' && dir === 'west') {
    res = false;
  }
  if (oldDir === 'west' && dir === 'east') {
    res = false;
  }
  if (oldDir === 'north' && dir === 'south') {
    res = false;
  }
  if (oldDir === 'south' && dir === 'north') {
    res = false;
  }

  checkIndMap.set(`${x},${y},${dir},${oldDir}`, res);
  return res;
}

function checkCrossing(crossings, x, y) {
  if (!crossings) return true;
  return !crossings.includes(`${x},${y}`);
}

const map = getMap('./23-input.txt');
const maxY = map.length - 1;
const maxX = map[0].length - 1;
//logMap();
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (isCrossing(x, y)) {
      //console.log('Crosseing at', x, y);
    }
  }
}

const steps = [];
let copy;
steps.push({ x: 1, y: 0, accumulator: 0, crossings: [], coords: [] });

let longestPath = 0;
let allPaths = [];
let i = 0;
while (steps.length > 0) {
  i++;
  // console.log(`--------------- ${i} -----------------`);
  // console.log(steps);
  // console.log(steps.map((s) => s.crossings));
  const { x, y, dir, accumulator, crossings } = steps.shift();
  if (isCrossing(x, y)) {
    crossings.push(`${x},${y}`);
  }
  if (checkInd(x - 1, y, dir, 'west') && checkCrossing(crossings, x - 1, y)) {
    steps.push({
      x: x - 1,
      y: y,
      dir: 'west',
      accumulator: accumulator + 1,
      crossings: [...crossings],
    });
  }
  if (checkInd(x + 1, y, dir, 'east') && checkCrossing(crossings, x + 1, y)) {
    steps.push({
      x: x + 1,
      y: y,
      dir: 'east',
      accumulator: accumulator + 1,
      crossings: [...crossings],
    });
  }
  if (checkInd(x, y - 1, 'north', dir) && checkCrossing(crossings, x, y - 1)) {
    steps.push({
      x: x,
      y: y - 1,
      dir: 'north',
      accumulator: accumulator + 1,
      crossings: [...crossings],
    });
  }
  if (checkInd(x, y + 1, 'south', dir) && checkCrossing(crossings, x, y + 1)) {
    steps.push({
      x: x,
      y: y + 1,
      dir: 'south',
      accumulator: accumulator + 1,
      crossings: [...crossings],
    });
  }

  if (x == maxX - 1 && y == maxY) {
    longestPath = Math.max(longestPath, accumulator);
    // allPaths.push(accumulator);
  }
}

// function logMapWithPaths(coords) {
//   console.log('Map with coords:');
//   for (let y = 0; y < map.length; y++) {
//     console.log(
//       map[y]
//         .map((char, x) => {
//           return coords.includes(`${x},${y}`) ? 'O' : char;
//         })
//         .join('')
//     );
//   }
//   console.log('End Map with coords:');
// }

console.log({ longestPath });
