import { memoize } from '../helpers';

namespace adventOfCode18a {
  class Edge {
    constructor(
      public dir: 'R' | 'U' | 'L' | 'D' | '',
      public length: number,
      public color?: string
    ) {}
  }

  class Corner {
    constructor(
      public x: number,
      public y: number,
      public cornerDir: string = '',
      public isStart: boolean = false
    ) {}
  }

  function toDec(hex: string): number {
    return parseInt(hex, 16);
  }

  function getEdgesSimple(fileName: string): Edge[] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    return data
      .replaceAll('\r', '')
      .split('\n')
      .map((e) => {
        const el = e.split(' ');
        return new Edge(
          el[0] as 'R' | 'U' | 'L' | 'D',
          parseInt(el[1]),
          el[2].replace('(', '').replace(')', '')
        );
      });
  }

  function getEdges(fileName: string): Edge[] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    return data
      .replaceAll('\r', '')
      .split('\n')
      .map((e) => {
        const hex =
          e.split(' ')[2].replace('(', '').replace(')', '').replace('#', '') ||
          '0';
        const color =
          hex.slice(-1) === '0'
            ? 'R'
            : hex.slice(-1) === '1'
            ? 'D'
            : hex.slice(-1) === '2'
            ? 'L'
            : hex.slice(-1) === '3'
            ? 'U'
            : '???';
        return new Edge(
          color as 'R' | 'U' | 'L' | 'D',
          toDec(hex.slice(0, -1))
        );
      });
  }

  function getCornerDir(previousEdgeDir: string, edgeDir: string): string {
    switch (previousEdgeDir + edgeDir) {
      case 'UR':
        return 'LU';
      case 'RD':
        return 'UR';
      case 'DL':
        return 'RD';
      case 'LU':
        return 'LD';
      case 'LD':
        return 'R';
      case 'RU':
        return 'L';
      case 'DR':
        return 'R';
      case 'UL':
        return 'L';
      default:
        return ' ';
    }
  }

  function toCorners(edges: Edge[]): Corner[] {
    const corners: Corner[] = [];
    let x = 0;
    let y = 0;
    let previousEdgeDir = edges.at(-1)?.dir || '';
    edges.forEach((edge, i) => {
      corners.push(new Corner(x, y, getCornerDir(previousEdgeDir, edge.dir)));
      if (edge.dir === 'R') {
        x += edge.length;
      }
      if (edge.dir === 'U') {
        y -= edge.length;
      }
      if (edge.dir === 'L') {
        x -= edge.length;
      }
      if (edge.dir === 'D') {
        y += edge.length;
      }
      if (i === 0) {
        corners[0].isStart = true;
      }
      if (i === edges.length - 1 && (x !== 0 || y !== 0)) {
        console.log('Hmmm should be back at 0,0?');
      }
      previousEdgeDir = edge.dir;
    });
    return corners;
  }

  function moveCoords(corners: Corner[]) {
    const minX = corners.reduce((min, corner) => Math.min(min, corner.x), 0);
    const minY = corners.reduce((min, corner) => Math.min(min, corner.y), 0);

    corners.forEach((corner) => {
      corner.x -= minX;
      corner.y -= minY;
    });

    const maxX = corners.reduce((max, corner) => Math.max(max, corner.x), 0);
    const maxY = corners.reduce((max, corner) => Math.max(max, corner.y), 0);

    console.log({ minX, minY, maxX, maxY });
    return { maxX, maxY };
  }

  function getValue(corner: Corner): number {
    if (corner.cornerDir.includes('L')) {
      return corner.x - 1;
    }
    if (corner.cornerDir.includes('R')) {
      return corner.x;
    }
    return 0;
  }

  const verticalEdgesX = (yInd: number): number[] => {
    const verticalEdgesX: number[] = [];
    corners.forEach((corner, i) => {
      const lastCorner = corners.at(i - 1);
      if (!lastCorner) return;
      if (corner.y !== lastCorner.y) {
        if (
          yInd >= Math.min(corner.y, lastCorner.y) &&
          yInd <= Math.max(corner.y, lastCorner.y)
        ) {
          //console.log({ corner, lastCorner, i });
          if (corner.y === yInd && corner.cornerDir.length === 2) {
            verticalEdgesX.push(getValue(corner));
          } else if (
            lastCorner.y === yInd &&
            lastCorner.cornerDir.length === 2
          ) {
            verticalEdgesX.push(getValue(lastCorner));
          } else if (corner.y !== yInd && lastCorner.y !== yInd) {
            verticalEdgesX.push(getValue(corner));
          }
        }
      }
    });
    //console.log(verticalEdgesX.sort((a, b) => a - b));
    return verticalEdgesX.sort((a, b) => a - b);
  };

  const edges = getEdges('./18/18-input.txt');
  const corners = toCorners(edges);
  const { maxX, maxY } = moveCoords(corners);

  //verticalEdgesX(1);

  let sum = 0;
  for (var yInd = 0; yInd <= maxY; yInd++) {
    const verticalEdges = verticalEdgesX(yInd);
    if (yInd % 400000 === 0) console.log((100 * yInd) / maxY, sum);
    for (let edgeInd = 1; edgeInd < verticalEdges.length; edgeInd += 2) {
      sum += verticalEdges[edgeInd] - verticalEdges[edgeInd - 1];
    }
    // console.log(
    //   `yInd: ${yInd} : ${verticalEdgesX(yInd).join(', ')}}, sum: ${sum}`
    // );
  }
  //console.log({ edges, corners, maxX, maxY });

  console.log({ sum });
}
