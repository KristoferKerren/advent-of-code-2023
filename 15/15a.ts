import { sum } from '../helpers';

namespace adventOfCode15a {
  function getSteps(fileName: string): string[] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    console.log(data);
    return data.split(',');
  }

  function getASCII(char: string): number {
    return char.charCodeAt(0);
  }

  function getValueFromHash(hash: string): number {
    let res = 0;
    [...hash].forEach((char, index) => {
      res = ((res + getASCII(char)) * 17) % 256;
    });
    return res;
  }

  console.log(getValueFromHash('HASH'));
  console.log(getValueFromHash('rn=1'));
  const steps = getSteps('./15/15-input.txt');
  console.log(steps);
  //console.log(patterns.map(getPatternValue));
  console.log(sum(steps.map(getValueFromHash)));
}
