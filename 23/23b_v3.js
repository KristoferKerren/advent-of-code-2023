const { type } = require('os');

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

function turnDir(dir) {
  if (dir === 'north') return 'south';
  if (dir === 'south') return 'north';
  if (dir === 'east') return 'west';
  if (dir === 'west') return 'east';
  return '';
}

function getIsCrossingMap() {
  const mapper = new Map();
  mapper.set('1,0', { type: 'start', paths: [] });
  mapper.set(`${maxX - 1},${maxY}`, { type: 'end', paths: [] });
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (x === 0 || x === maxX || y === 0 || y === maxY) {
        continue;
      }
      if (map[y][x] === '#') {
        continue;
      }
      if (
        [map[y][x - 1], map[y][x + 1], map[y - 1][x], map[y + 1][x]].filter(
          (char) => char !== '#'
        ).length >= 3
      ) {
        mapper.set(`${x},${y}`, { type: 'crossing', paths: [] });
      }
    }
  }
  [...mapper.keys()].forEach((coord) => {
    const [x, y] = coord.split(',').map((num) => parseInt(num));
    const paths = [];
    ['west', 'east', 'north', 'south'].forEach((dir) => {
      let x2 = dir === 'west' ? x - 1 : dir === 'east' ? x + 1 : x;
      let y2 = dir === 'north' ? y - 1 : dir === 'south' ? y + 1 : y;
      let dir2 = dir;
      let pathLength = 1;
      if (!checkInd(x2, y2, dir)) return;
      while (!mapper.get(`${x2},${y2}`)) {
        let res = goForward(x2, y2, dir2);
        pathLength++;
        x2 = res.x;
        y2 = res.y;
        dir2 = res.latestDir;
      }
      paths.push({
        toCrossing: `${x2},${y2}`,
        length: pathLength,
        outDir: dir,
        inDir: turnDir(dir2),
      });
    });

    mapper.get(coord).paths = paths;
  });
  return mapper;
}

function goForward(x, y, latestDir) {
  if (checkInd(x - 1, y, latestDir, 'west')) {
    return { x: x - 1, y: y, latestDir: 'west' };
  }
  if (checkInd(x + 1, y, latestDir, 'east')) {
    return { x: x + 1, y: y, latestDir: 'east' };
  }
  if (checkInd(x, y - 1, latestDir, 'north')) {
    return { x: x, y: y - 1, latestDir: 'north' };
  }
  if (checkInd(x, y + 1, latestDir, 'south')) {
    return { x: x, y: y + 1, latestDir: 'south' };
  }
}

checkIndMap = new Map();
function checkInd(x, y, latestDir, newDir) {
  const cache = checkIndMap.get(`${x},${y},${latestDir},${newDir}`);
  if (cache !== undefined) return cache;
  let res = true;
  if (x < 0 || x > maxX || y < 0 || y > maxY) {
    res = false;
  }
  if (res && map[y][x] === '#') {
    res = false;
  }
  if (newDir === 'east' && latestDir === 'west') {
    res = false;
  }
  if (newDir === 'west' && latestDir === 'east') {
    res = false;
  }
  if (newDir === 'north' && latestDir === 'south') {
    res = false;
  }
  if (newDir === 'south' && latestDir === 'north') {
    res = false;
  }

  checkIndMap.set(`${x},${y},${latestDir},${newDir}`, res);
  return res;
}

function checkCrossing(crossings, toCrossing) {
  if (!crossings) return true;
  return !crossings.includes(toCrossing);
}

const map = getMap('./23-input.txt');
const maxY = map.length - 1;
const maxX = map[0].length - 1;
const isCrossingMap = getIsCrossingMap();

console.log(isCrossingMap);

const steps = [];
steps.push({
  lastCord: '1,0',
  lastCameFromDir: 'north',
  acc: 0,
  coords: ['1,0'],
});

let longestPath = 0;
let allPaths = [];
let i = 0;
while (steps.length > 0) {
  i++;
  if (i % 1000000 == 0) {
    console.log(
      `--------------- ${i}, steps: ${steps.length} -----------------`
    );
  }
  const { lastCord, lastCameFromDir, acc, coords } = steps.pop();
  //console.log({ lastCord, lastCameFromDir, acc, coords });
  const crossing = isCrossingMap.get(lastCord);
  if (crossing.type === 'end') {
    longestPath = Math.max(longestPath, acc);
    allPaths.push(acc);
  }
  crossing.paths
    .filter((p) => p.outDir !== lastCameFromDir)
    .forEach((path) => {
      if (checkCrossing(coords, path.toCrossing)) {
        steps.push({
          lastCord: path.toCrossing,
          lastCameFromDir: path.inDir,
          acc: acc + path.length,
          coords: coords.concat(path.toCrossing),
        });
      }
    });
}
//logMap();

console.log({ longestPath, allPaths });
