namespace adventOfCode8a {
  function getHands(fileName: string): { path: string; map: Map<string, any> } {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    const map = new Map();
    data
      .replaceAll('\r', '')
      .split('\n')
      .forEach((e) => {
        const key = e.split(' = (')[0];
        const left = e.split(' = (')[1].split(', ')[0];
        const right = e.split(' = (')[1].split(', ')[1].split(')')[0];
        map.set(key, { left: left, right: right });
      });
    const path =
      fileName === './8/8-input-test-b1.txt'
        ? 'LR'
        : 'LRLRRRLRLLRRLRLRRRLRLRRLRRLLRLRRLRRLRRRLRRRLRLRRRLRLRRLRRLLRLRLLLLLRLRLRRLLRRRLLLRLLLRRLLLLLRLLLRLRRLRRLRRRLRRRLRRLRRLRRRLRLRLRRLRLRLRLRRLRRRLLRLLRRLRLRRRLRLRRRLRLRRRLRRRLRRLRLLLLRLRRRLRLRRLRLRRLRRLRRLLRRRLLLLLLRLRRRLRRLLRRRLRRLLLRLRLRLRRRLRRLRLRRRLRRLRRRLLRRLRRLLLRRRR';
    return { path: path, map: map };
  }

  const { path, map } = getHands('./8/8-input.txt');

  function getGeatestCommonDivisor(nbrs: number[]): number {
    nbrs.sort((a, b) => a - b);
    const highestPossible = Math.ceil(nbrs.at(-1)! / 2);
    for (let i = highestPossible; i > 1; i--) {
      if (nbrs.every((nbr) => nbr % i === 0)) {
        return i;
      }
    }
    console.log('no GCD found');
    return 1;
  }

  let firstKeys = [...map.keys()].filter((e) => e.at(-1) === 'A');
  console.log(firstKeys);
  const lengths = firstKeys.map((nextKey) => {
    let i = 0;
    while (nextKey.at(-1) !== 'Z') {
      const leftOrRight: 'left' | 'right' =
        path[i % path.length] === 'L' ? 'left' : 'right';
      nextKey = map.get(nextKey)[leftOrRight];
      if (nextKey.at(-1) === 'Z') {
        console.log(nextKey);
      }
      i++;
    }
    return i;
  });

  const gcd = getGeatestCommonDivisor(lengths);
  const factor = lengths.reduce((tally, nbr) => tally * nbr, 1);
  let lcd = factor / Math.pow(gcd, 5);
  console.log({ lengths, gcd, factor, result: lcd });
}
