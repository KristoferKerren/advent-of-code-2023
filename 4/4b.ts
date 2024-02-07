namespace adventOfCode4b {
  function getRows(fileName: string): string[] {
    const fs = require('fs');
    const data = fs.readFileSync(fileName, 'utf8');
    return data.replaceAll('\r', '').split('\n');
  }

  function getNbrOfMatchingNumbers(row: string): number {
    const nbrOfWinningNumbers = getNbrOfWinningNumbers(row.split(':').at(1)!);
    return nbrOfWinningNumbers;
  }

  function getNbrOfWinningNumbers(row: string): number {
    let nbrOfWinningNumbers = 0;
    const [winningNumbers, numbersYouHave] = row.split('|');
    winningNumbers.split(' ').forEach((winningNumber: string) => {
      const numbersYouHaveArray: string[] = numbersYouHave.split(' ');
      if (numbersYouHaveArray.includes(winningNumber)) {
        nbrOfWinningNumbers++;
      }
    });
    return nbrOfWinningNumbers;
  }

  const rows: string[] = getRows('4-input.txt');
  const copies: number[] = new Array(rows.length).fill(1);
  const matchingNumbers: number[] = rows.map((row) => {
    const rowParsed = row
      .replace(': ', ':')
      .replace(' | ', '|')
      .replaceAll('  ', ' ');
    return getNbrOfMatchingNumbers(rowParsed);
  });

  matchingNumbers.forEach((matchingNumber, i) => {
    const kris = copies[i];
    for (let j = i + 1; j < i + matchingNumber + 1; j++) {
      if (j < copies.length) {
        copies[j] += kris;
      }
    }
    return;
  }, 0);

  const sum = copies.reduce((tally, nbr) => tally + nbr);
  console.log(sum);
}
