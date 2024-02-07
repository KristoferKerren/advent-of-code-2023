import { sum } from '../helpers';

namespace adventOfCode14a {
  function getPatterns(fileName: string): string[][] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    const dataArr = data.replaceAll('\r', '').split('\n');
    const res: string[][] = [];
    console.log(dataArr);
    for (var i = 0; i < dataArr.length; i++) {
      const tempArr: string[] = [];
      for (var j = 0; j < dataArr[i].length; j++) {
        tempArr.push(dataArr[j][i]);
      }
      res.push(tempArr);
    }
    return res;
  }

  function getPatternValue(pattern: string[]): number {
    let res = 0;
    let points = pattern.length;
    pattern.forEach((element, i) => {
      if (element === 'O') {
        res += points;
        points--;
      } else if (element === '#') {
        points = pattern.length - i - 1;
      }
      //  console.log({ element, i, points, res });
    });
    return res;
  }
  const patterns = getPatterns('./14/14-input.txt');
  console.log(patterns.map(getPatternValue));
  console.log(sum(patterns.map(getPatternValue)));
}
