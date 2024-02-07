function getCharacter(x, y) {
  return inputs.at(y)?.at(x);
}

function isNumber(x, y) {
  var char = getCharacter(x, y);
  var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return numbers.includes(char);
}

function isSign(x, y) {
  var char = getCharacter(x, y);
  var signs = ['*', '#', '+', '$', '&', '=', '@', '%', '-', '/'];
  return signs.includes(char);
}

function isUnknown(x, y) {
  return !isNumber(x, y) && !isSign(x, y) && getCharacter(x, y) !== '.';
}

function getNumberLength(x, y) {
  let nbrLength = 1;
  while (isNumber(x + nbrLength, y)) {
    nbrLength++;
  }
  return nbrLength;
}

function isAdjacentToSymbol(startX, startY, numberLength) {
  const endX = startX + numberLength - 1;
  if (isSign(startX - 1, startY)) return true;
  if (isSign(endX + 1, startY)) return true;
  for (let xi = startX - 1; xi <= endX + 1; xi++) {
    if (isSign(xi, startY + 1)) return true;
    if (isSign(xi, startY - 1)) return true;
  }
  return false;
}

const fs = require('fs');
const data = fs.readFileSync('3-input.txt', 'utf8');
const inputs = data.replaceAll('\r', '').split('\n');

const maxX = inputs[0].length;
const maxY = inputs.length;

console.log(inputs);
let numbers = [];

for (let y = 0; y < maxY; y++) {
  for (let x = 0; x < maxX; x++) {
    if (isUnknown(x, y)) {
      console.log(`Unknown symbol: ${getCharacter(x, y)}`);
    }
    if (isNumber(x, y)) {
      const nbrLength = getNumberLength(x, y);
      if (isAdjacentToSymbol(x, y, nbrLength)) {
        numbers.push(parseInt(inputs.at(y).substring(x, x + nbrLength + 1)));
      }
      x += nbrLength;
    }
  }
}

console.log(numbers);
const sum = numbers.reduce((tally, number) => tally + number, 0);
console.log(sum);
