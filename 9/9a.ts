namespace adventOfCode9a {
  function getInput(fileName: string): number[][] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    return data
      .replaceAll('\r', '')
      .split('\n')
      .map((e) => e.split(' ').map((ee) => parseInt(ee)));
  }

  function getValueInMap(mapper: Map<number, number[]>, i: number, j: number) {
    return mapper.get(i)!.at(j) ?? -9999999999;
  }

  const nbrsArray = getInput('./9/9-input.txt');
  const sum = nbrsArray
    .map((nbrs) => {
      let isAMatch = false;
      let k = 0;
      let mapper = new Map<number, number[]>();
      let i = 0;
      mapper.set(i, nbrs);
      while (!isAMatch && k < 10000) {
        k++;
        let nextNbrs: number[] = [];
        for (let j = 1; j < (mapper.get(i)?.length || 0); j++) {
          nextNbrs.push(
            getValueInMap(mapper, i, j) - getValueInMap(mapper, i, j - 1)
          );
        }
        i++;
        mapper.set(i, nextNbrs);
        if (nextNbrs.every((nbr) => nbr === 0)) {
          isAMatch = true;
        }
      }
      console.log(mapper);
      console.log('--------------------------');

      mapper.get(i)?.push(0);
      while (i > 0) {
        i--;
        mapper
          .get(i)
          ?.push(
            getValueInMap(mapper, i, -1) + getValueInMap(mapper, i + 1, -1)
          );
      }

      console.log(mapper);

      return mapper.get(0)?.at(-1);
    })
    .reduce((tally, nbr) => (tally || 0) + (nbr || 0));

  console.log(sum);
}
