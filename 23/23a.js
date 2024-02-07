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

function checkInd(x, y, dir) {
  if (x < 0 || x > maxX || y < 0 || y > maxY) {
    return false;
  }
  if (map[y][x] === '#') return false;
  if (dir === 'east' && map[y][x] === '<') return false;
  if (dir === 'west' && map[y][x] === '>') return false;
  if (dir === 'north' && map[y][x] === 'v') return false;
  return true;
}

const map = getMap('./23-input-test.txt');
const maxY = map.length - 1;
const maxX = map[0].length - 1;
//logMap();

const steps = [];
steps.push({ x: 1, y: 0, accumulator: 0 });

const donePaths = [];
while (steps.length > 0) {
  //console.log(steps);
  const { x, y, dir, accumulator } = steps.shift();
  if (dir !== 'east' && checkInd(x - 1, y, 'west')) {
    steps.push({
      x: x - 1,
      y: y,
      dir: 'west',
      accumulator: accumulator + 1,
    });
  }
  if (dir !== 'west' && checkInd(x + 1, y, 'east')) {
    steps.push({
      x: x + 1,
      y: y,
      dir: 'east',
      accumulator: accumulator + 1,
    });
  }
  if (dir !== 'south' && checkInd(x, y - 1, 'north')) {
    steps.push({
      x: x,
      y: y - 1,
      dir: 'north',
      accumulator: accumulator + 1,
    });
  }
  if (dir !== 'north' && checkInd(x, y + 1, 'south')) {
    steps.push({
      x: x,
      y: y + 1,
      dir: 'south',
      accumulator: accumulator + 1,
    });
  }

  if (x == maxX - 1 && y == maxY) {
    //console.log(accumulator);
    donePaths.push(accumulator);
  }
}

console.log({ donePaths });
