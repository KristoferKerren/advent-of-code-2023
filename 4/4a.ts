namespace adventOfCode4a {
  function getRows(fileName: string): string[] {
    const fs = require('fs');
    const data = fs.readFileSync(fileName, 'utf8');
    return data.replaceAll('\r', '').split('\n');
  }

  function getRowWorth(row: string): number {
    const nbrOfWinningNumbers = getNbrOfWinningNumbers(row.split(':').at(1)!);
    return nbrOfWinningNumbers === 0 ? 0 : Math.pow(2, nbrOfWinningNumbers - 1);
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

  const rows = getRows('4-input.txt');
  console.log(rows);
  const worth: number[] = rows.map((row) => {
    const rowParsed = row
      .replace(': ', ':')
      .replace(' | ', '|')
      .replaceAll('  ', ' ');
    return getRowWorth(rowParsed);
  });

  const sum = worth.reduce((tally, w) => tally + w, 0);
  console.log(sum);
}
