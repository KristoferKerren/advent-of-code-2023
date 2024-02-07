function getCalibrationValue(code) {
  const numbers = code.replace(/\D/g, '');
  const calibrationValue = numbers.at(0) + numbers.at(-1);
  return parseInt(calibrationValue);
}

const fs = require('fs');

// Read the file synchronously
const data = fs.readFileSync('1a-input.txt', 'utf8');

// Split the data into an array based on newlines
const inputs = data.split('\n');
const calibrationValues = inputs.map((e) => getCalibrationValue(e));
const sum = calibrationValues.reduce(
  (tally, calibrationValue) => tally + calibrationValue,
  0
);
console.log(calibrationValues);
console.log(sum);
