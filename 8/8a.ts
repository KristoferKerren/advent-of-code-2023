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
      fileName === './8/8-input-test-a1.txt'
        ? 'RL'
        : fileName === './8/8-input-test-a2.txt'
        ? 'LLR'
        : 'LRLRRRLRLLRRLRLRRRLRLRRLRRLLRLRRLRRLRRRLRRRLRLRRRLRLRRLRRLLRLRLLLLLRLRLRRLLRRRLLLRLLLRRLLLLLRLLLRLRRLRRLRRRLRRRLRRLRRLRRRLRLRLRRLRLRLRLRRLRRRLLRLLRRLRLRRRLRLRRRLRLRRRLRRRLRRLRLLLLRLRRRLRLRRLRLRRLRRLRRLLRRRLLLLLLRLRRRLRRLLRRRLRRLLLRLRLRLRRRLRRLRLRRRLRRLRRRLLRRLRRLLLRRRR';
    return { path: path, map: map };
  }

  const { path, map } = getHands('./8/8-input.txt');
  console.log({ path, map });

  let i = 0;
  let nextKey = 'AAA';
  while (nextKey != 'ZZZ' && i < 100000000) {
    const leftOrRight: string = path[i % path.length];
    nextKey = map.get(nextKey)[leftOrRight === 'L' ? 'left' : 'right'];
    i++;
  }

  console.log({ nextKey, i });
}
