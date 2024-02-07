import { memoize } from '../helpers';

namespace adventOfCode12b {
  class Row {
    constructor(public pattern: string, public springLengths: number[]) {}
  }

  function getRows(fileName: string, nbrOfPatterns: number = 1): Row[] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    return data
      .replaceAll('\r', '')
      .split('\n')
      .map((e) => {
        const patternRaw = e.split(' ')[0];
        const patternArray = new Array<string>(nbrOfPatterns).fill(patternRaw);
        const pattern = patternArray.join('?');
        const springLengthsRaw = e.split(' ')[1];
        const springLengthsArray = new Array<string>(nbrOfPatterns).fill(
          springLengthsRaw
        );
        const springLengths = springLengthsArray
          .join(',')
          .split(',')
          .map((str) => parseInt(str));
        return {
          pattern: pattern,
          springLengths: springLengths,
        };
      });
  }

  const rows = getRows('./12/12-input.txt');
  const rowsDouble = getRows('./12/12-input.txt', 5);

  const calcNbrOfWays = memoize(
    (pattern: string, springLengths: number[]): number => {
      // console.log('calcNbrOfWays');
      // console.log({
      //   pattern,
      //   springLengths,
      //   patterLength: pattern.length,
      //   waysLength: springLengths.reduce((a, b) => a + b + 1, -1),
      //   nbrOfArrangements,
      // });
      if (pattern.length === 0) {
        if (springLengths.length === 0) {
          return 1;
        }
        return 0;
      }
      if (springLengths.length === 0) {
        for (let i = 0; i < pattern.length; i++) {
          if (pattern[i] === '#') {
            return 0;
          }
        }
        return 1;
      }
      const notEnoughStepsLeft =
        pattern.length < springLengths.reduce((a, b) => a + b + 1, -1);
      if (notEnoughStepsLeft) {
        return 0;
      }
      if (pattern[0] === '.') {
        return calcNbrOfWays(pattern.substring(1), springLengths);
      }
      if (pattern[0] === '?') {
        return (
          calcNbrOfWays(`.${pattern.substring(1)}`, springLengths) +
          calcNbrOfWays(`#${pattern.substring(1)}`, springLengths)
        );
      }
      if (pattern[0] === '#') {
        for (let i = 0; i < springLengths[0]; i++) {
          if (pattern[i] === '.') {
            return 0;
          }
        }
        if (pattern[springLengths[0]] === '#') {
          return 0;
        }
        return calcNbrOfWays(
          pattern.substring(springLengths[0] + 1),
          springLengths.slice(1)
        );
      }
      return 0;
    }
  );

  function getNbrOfArrangements(row: Row) {
    const nbrOfWays = calcNbrOfWays(row.pattern, row.springLengths);
    return nbrOfWays;
  }

  const ways = rowsDouble.map((row) => getNbrOfArrangements(row));
  const sum = ways.reduce((a, b) => a + b, 0);
  console.log({ ways, sum });
}
