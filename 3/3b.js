function getCharacter(x, y) {
  return inputs.at(y)?.at(x);
}

function isNumber(x, y) {
  var char = getCharacter(x, y);
  var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return numbers.includes(char);
}

function getFullNumber(x, y) {
  let startX = getStartPositionOfNumber(x, y);
  let nbrLength = getNumberLength(startX, y);
  return parseInt(inputs.at(y).substring(startX, startX + nbrLength + 1));
}

function isStar(x, y) {
  var char = getCharacter(x, y);
  return char === '*';
}

function getNumberLength(x, y) {
  let nbrLength = 1;
  while (isNumber(x + nbrLength, y)) {
    nbrLength++;
  }
  return nbrLength;
}

function getStartPositionOfNumber(x, y) {
  if (!isNumber(x, y)) {
    console.log(`Position ${x}, ${y} is not a number!`);
    return null;
  }
  while (x > 0) {
    if (!isNumber(x - 1, y)) {
      return x;
    }
    x--;
  }
  return 0;
}

function getTwoAdjacentNumbers(x, y) {
  if (x === 35 && y === 9) console.log(`get adjacent of ${x} ${y}`);
  if (!isStar(x, y)) {
    console.log(`Position ${x}, ${y} is not a star!`);
    return null;
  }
  let numbers = [];
  if (isNumber(x, y - 1)) {
    console.log('hej1');
    numbers.push(getFullNumber(x, y - 1));
  } else {
    if (isNumber(x - 1, y - 1)) {
      console.log('hej2');
      numbers.push(getFullNumber(x - 1, y - 1));
    }
    if (isNumber(x + 1, y - 1)) {
      console.log('hej3');
      numbers.push(getFullNumber(x + 1, y - 1));
    }
  }

  if (isNumber(x - 1, y)) {
    console.log('hej4');
    numbers.push(getFullNumber(x - 1, y));
  }
  if (isNumber(x + 1, y)) {
    console.log('hej5');
    numbers.push(getFullNumber(x + 1, y));
  }
  if (isNumber(x, y + 1)) {
    console.log('hej6');
    numbers.push(getFullNumber(x, y + 1));
  } else {
    if (isNumber(x - 1, y + 1)) {
      console.log('hej7');
      numbers.push(getFullNumber(x - 1, y + 1));
    }
    if (isNumber(x + 1, y + 1)) {
      console.log('hej8');
      console.log(getFullNumber(x + 1, y + 1));
      numbers.push(getFullNumber(x + 1, y + 1));
    }
  }
  if (numbers.length === 2) {
    return numbers;
  }
  return null;
}

const fs = require('fs');
const data = fs.readFileSync('3-input.txt', 'utf8');
const inputs = data.replaceAll('\r', '').split('\n');

const maxX = inputs[0].length;
const maxY = inputs.length;

console.log(inputs);
let gearRatios = [];

for (let y = 0; y < maxY; y++) {
  for (let x = 0; x < maxX; x++) {
    if (isStar(x, y)) {
      let adjacentNumbers = getTwoAdjacentNumbers(x, y);
      if (adjacentNumbers) {
        gearRatios.push(adjacentNumbers.at(0) * adjacentNumbers.at(1));
      }
    }
  }
}

console.log(gearRatios);
const sum = gearRatios.reduce((tally, gearRatio) => tally + gearRatio, 0);
console.log(sum);
