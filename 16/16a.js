function getMap(fileName) {
  const fs = require('fs');
  const data = fs.readFileSync(fileName, 'utf8');
  return data
    .replaceAll('\r', '')
    .split('\n')
    .map((s) =>
      s.split('').map((s) => {
        return { value: s, hasGoneHorizontal: false, hasGoneVertical: false };
      })
    );
}

function logMap() {
  console.log('Map where has been:');
  let hasBeenCount = 0;
  for (let i = 0; i < map.length; i++) {
    console.log(
      map[i]
        .map((o) => {
          if (o.hasGoneHorizontal || o.hasGoneVertical) {
            hasBeenCount++;
          }
          return o.hasGoneHorizontal && o.hasGoneVertical
            ? '2'
            : !o.hasGoneHorizontal && !o.hasGoneVertical
            ? '.'
            : '#';
        })
        .join('')
    );
  }

  console.log('hasBeenCount ', hasBeenCount);
}

function getEnergized() {
  let hasBeenCount = 0;
  for (let i = 0; i < map.length; i++) {
    map[i].forEach((o) => {
      if (o.hasGoneHorizontal || o.hasGoneVertical) {
        hasBeenCount++;
      }
    });
  }

  return hasBeenCount;
}

function goToNextStep(x = 0, y = 0, dir = 'right') {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return;
  }
  const step = map[y][x];
  if (step.value === '.') {
    if ((dir === 'left' || dir === 'right') && step.hasGoneHorizontal) {
      return;
    }
    if ((dir === 'up' || dir === 'down') && step.hasGoneVertical) {
      return;
    }
  }

  if (dir === 'left' || dir === 'right') {
    step.hasGoneHorizontal = true;
  } else {
    step.hasGoneVertical = true;
  }
  // console.log({ x, y, dir, step });
  // logMap();

  if (dir === 'right') {
    switch (step.value) {
      case '.':
      case '-':
        goToNextStep(x + 1, y, 'right');
        break;
      case '/':
        goToNextStep(x, y - 1, 'up');
        break;
      case '\\':
        goToNextStep(x, y + 1, 'down');
        break;
      case '|':
        goToNextStep(x, y + 1, 'down');
        goToNextStep(x, y - 1, 'up');
        break;
    }
  } else if (dir === 'left') {
    switch (step.value) {
      case '.':
      case '-':
        goToNextStep(x - 1, y, 'left');
        break;
      case '/':
        goToNextStep(x, y + 1, 'down');
        break;
      case '\\':
        goToNextStep(x, y - 1, 'up');
        break;
      case '|':
        goToNextStep(x, y + 1, 'down');
        goToNextStep(x, y - 1, 'up');
        break;
    }
  } else if (dir === 'up') {
    switch (step.value) {
      case '.':
      case '|':
        goToNextStep(x, y - 1, 'up');
        break;
      case '/':
        goToNextStep(x + 1, y, 'right');
        break;
      case '\\':
        goToNextStep(x - 1, y, 'left');
        break;
      case '-':
        goToNextStep(x - 1, y, 'left');
        goToNextStep(x + 1, y, 'right');
        break;
    }
  } else if (dir === 'down') {
    switch (step.value) {
      case '.':
      case '|':
        goToNextStep(x, y + 1, 'down');
        break;
      case '/':
        goToNextStep(x - 1, y, 'left');
        break;
      case '\\':
        goToNextStep(x + 1, y, 'right');
        break;
      case '-':
        goToNextStep(x - 1, y, 'left');
        goToNextStep(x + 1, y, 'right');
        break;
    }
  }
}

function refresh() {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      map[i][j].hasGoneHorizontal = false;
      map[i][j].hasGoneVertical = false;
    }
  }
}

const map = getMap('./16/16-input.txt');
let maxEnergized = -1;
for (let yStart = 0; yStart < map.length; yStart++) {
  goToNextStep(0, yStart, 'right');
  maxEnergized = Math.max(maxEnergized, getEnergized());
  refresh();
  goToNextStep(map[0].length - 1, yStart, 'left');
  maxEnergized = Math.max(maxEnergized, getEnergized());
  refresh();
}

for (let xStart = 0; xStart < map[0].length; xStart++) {
  goToNextStep(xStart, 0, 'down');
  maxEnergized = Math.max(maxEnergized, getEnergized());
  refresh();
  goToNextStep(xStart, map.length - 1, 'up');
  maxEnergized = Math.max(maxEnergized, getEnergized());
  refresh();
}
console.log(maxEnergized);
