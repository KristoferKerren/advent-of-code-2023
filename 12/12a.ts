namespace adventOfCode12a {
  class Row {
    constructor(
      public pattern: string,
      public springLengths: number[],
      arrangements?: number
    ) {}
  }

  function getRows(fileName: string): Row[] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    return data
      .replaceAll('\r', '')
      .split('\n')
      .map((e) => {
        return {
          pattern: e.split(' ')[0],
          springLengths: e
            .split(' ')[1]
            .split(',')
            .map((str) => parseInt(str)),
        };
      });
  }

  function getQuestionMarkIndexes(pattern: string): number[] {
    const questionMarksIndexes: number[] = [];
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '?') {
        questionMarksIndexes.push(i);
      }
    }
    return questionMarksIndexes;
  }

  function getNbrOfRemainingHash(row: Row): number {
    let nbrOfHashes: number = 0;
    for (let i = 0; i < row.pattern.length; i++) {
      if (row.pattern[i] === '#') {
        nbrOfHashes++;
      }
    }
    return row.springLengths.reduce((a, b) => a + b, 0) - nbrOfHashes;
  }

  function getPatternWithReplaced(
    pattern: string,
    replaceIndex: number
  ): string {
    return `${pattern.substring(0, replaceIndex)}#${pattern.substring(
      replaceIndex + 1
    )}`;
  }

  const rows = getRows('./12/12-input.txt');

  function generateCombinations(
    combinationSize: number,
    maxElement: number
  ): number[][] {
    const result: number[][] = [];

    function combine(start: number, combination: number[]): void {
      if (combination.length === combinationSize) {
        result.push([...combination]);
        return;
      }

      for (let i = start; i <= maxElement; i++) {
        combination.push(i);
        combine(i + 1, combination);
        combination.pop();
      }
    }

    combine(0, []);
    return result;
  }

  function matches(pattern: string, springLengthsRef: number[]): boolean {
    const springLengths: number[] = [];
    let currentCount = 0;

    for (const char of pattern) {
      if (char === '#') {
        currentCount++;
      } else {
        if (currentCount > 0) {
          springLengths.push(currentCount);
          currentCount = 0;
        }
      }
    }

    // Handle the case when the string ends with '#'
    if (currentCount > 0) {
      springLengths.push(currentCount);
    }

    return (
      springLengths.length === springLengthsRef.length &&
      springLengths.every((count, index) => count === springLengthsRef[index])
    );
  }

  function getNbrOfArrangements(row: Row) {
    let pattern = row.pattern;
    const qIndexes = getQuestionMarkIndexes(row.pattern);
    const nbrOfRemainingHash = getNbrOfRemainingHash(row);

    pattern = pattern.replaceAll('?', '.');

    const combinations = generateCombinations(
      nbrOfRemainingHash,
      qIndexes.length - 1
    );

    let nbrOfArrangements = 0;
    combinations.forEach((combination) => {
      let patternTemp = pattern;
      combination.forEach((c) => {
        patternTemp = getPatternWithReplaced(patternTemp, qIndexes[c]);
      });
      if (matches(patternTemp, row.springLengths)) {
        nbrOfArrangements++;
      }
    });

    return nbrOfArrangements;
  }

  const sum = rows.map((row) => getNbrOfArrangements(row));
  // .reduce((tally, nbr) => tally + nbr, 0);
  console.log(sum);
}
