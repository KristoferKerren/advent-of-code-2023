const numberMapper = [
  { key: 'one', value: 1 },
  { key: 'two', value: 2 },
  { key: 'three', value: 3 },
  { key: 'four', value: 4 },
  { key: 'five', value: 5 },
  { key: 'six', value: 6 },
  { key: 'seven', value: 7 },
  { key: 'eight', value: 8 },
  { key: 'nine', value: 9 },
];

function replaceStringWithNumbers(code) {
  var codeFormatted = code;
  var i = 0;
  while (i < codeFormatted.length) {
    numberMapper.forEach((m) => {
      const codeSubstring = codeFormatted.substring(i, i + m.key.length);
      if (codeSubstring === m.key) {
        codeFormatted = codeFormatted.replace(m.key, m.value.toString());
      }
    });
    i++;
  }
  return codeFormatted;
}

function getNumbersFromString(code) {
  var codeFormatted = code;
  var i = 0;
  var numberss = '';
  while (i < codeFormatted.length) {
    numberMapper.forEach((m) => {
      const codeSubstring = codeFormatted.substring(i, i + m.key.length);
      if (
        codeSubstring === m.key ||
        codeFormatted.substring(i, i + 1) === m.value.toString()
      ) {
        numberss += m.value.toString();
      }
    });
    i++;
  }
  console.log({ code, numberss });
  return numberss;
}

function getCalibrationValue(code) {
  const numbers = getNumbersFromString(code);
  const calibrationValue = numbers.at(0) + numbers.at(-1);
  return parseInt(calibrationValue);
}

const fs = require('fs');

// Read the file synchronously
const data = fs.readFileSync('1a-input.txt', 'utf8');

// Split the data into an array based on newlines
const inputs = data.replaceAll('\n', '').split('\r');

const inputsTest = [
  'two1nine',
  'eightwothree',
  'abcone2threexyz',
  'xtwone3four',
  '4nineeightseven2',
  'zoneight234',
  '7pqrstsixteen',
];
const calibrationValues = inputs.map((e) => getCalibrationValue(e));
const sum = calibrationValues.reduce(
  (tally, calibrationValue) => tally + calibrationValue,
  0
);
console.log(sum);
