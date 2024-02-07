import { memoize } from '../helpers';

namespace adventOfCode18a {
  class Edge {
    constructor(
      public dir: 'R' | 'U' | 'L' | 'D' | '',
      public length: number,
      public color: string
    ) {}
  }

  class Coords {
    constructor(
      public x: number,
      public y: number,
      public color: string = '',
      public isEdge: boolean = false,
      public edgeDir: string = '',
      public isStart: boolean = false,
      public isMiddle: boolean = false
    ) {}
  }

  function getEdges(fileName: string): Edge[] {
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

  function getMiddleCoord(
    edgeCoord: Coords | null,
    log: boolean = false
  ): Coords | null {
    if (!edgeCoord) return null;
    let coord: Coords | null = null;
    switch (edgeCoord.edgeDir) {
      case 'R':
        if (edgeCoord.y >= map.length - 1) {
          return null;
        }
        coord = map[edgeCoord.y + 1][edgeCoord.x];
        break;
      case 'U':
        if (edgeCoord.x >= map[0].length - 1) {
          return null;
        }
        coord = map[edgeCoord.y][edgeCoord.x + 1];
        break;
      case 'L':
        if (edgeCoord.y <= 0) {
          return null;
        }
        coord = map[edgeCoord.y - 1][edgeCoord.x];
        break;
      case 'D':
        if (edgeCoord.x <= 0) {
          return null;
        }
        coord = map[edgeCoord.y][edgeCoord.x - 1];
        break;
    }
    if (coord) coord.edgeDir = edgeCoord.edgeDir;
    if ((edgeCoord?.y === 3 || edgeCoord?.y === 4) && coord?.x == 0) {
      console.log({ coord, edgeCoord });
    }
    if (coord?.isEdge || coord?.isMiddle) {
      return null;
    }
    return coord;
  }

  function getMiddleCoords(edgeCoords: (Coords | null)[]): (Coords | null)[] {
    return edgeCoords.map((el) => getMiddleCoord(el));
  }

  function getEdgeDir(previousEdgeDir: string, edgeDir: string): string {
    switch (previousEdgeDir + edgeDir) {
      case 'R':
        return 'D';
      case 'U':
        return 'R';
      case 'L':
        return 'U';
      case 'D':
        return 'L';
      case 'DR':
        return 'LD';
      case 'LD':
        return 'UL';
      case 'RU':
        return 'RD';
      case 'UL':
        return 'UR';
      case 'RD':
      case 'DL':
      default:
        return 'N';
    }
  }

  function toCoords(edges: Edge[]): Coords[] {
    const edgeElements: Coords[] = [];
    let x = 0;
    let y = 0;
    let previousEdgeDir = edges.at(-1)?.dir || '';
    edges.forEach((edge, i) => {
      if (edge.dir === 'R') {
        for (let i = 0; i < edge.length; i++) {
          edgeElements.push(
            new Coords(
              x + i,
              y,
              edge.color,
              true,
              getEdgeDir(i === 0 ? previousEdgeDir : '', edge.dir)
            )
          );
        }
        x += edge.length;
      }
      if (edge.dir === 'U') {
        for (let i = 0; i < edge.length; i++) {
          edgeElements.push(
            new Coords(
              x,
              y - i,
              edge.color,
              true,
              getEdgeDir(i === 0 ? previousEdgeDir : '', edge.dir)
            )
          );
        }
        y -= edge.length;
      }
      if (edge.dir === 'L') {
        for (let i = 0; i < edge.length; i++) {
          edgeElements.push(
            new Coords(
              x - i,
              y,
              edge.color,
              true,
              getEdgeDir(i === 0 ? previousEdgeDir : '', edge.dir)
            )
          );
        }
        x -= edge.length;
      }
      if (edge.dir === 'D') {
        for (let i = 0; i < edge.length; i++) {
          edgeElements.push(
            new Coords(
              x,
              y + i,
              edge.color,
              true,
              getEdgeDir(i === 0 ? previousEdgeDir : '', edge.dir)
            )
          );
        }
        y += edge.length;
      }
      if (i === 0) {
        edgeElements[0].isStart = true;
      }
      previousEdgeDir = edge.dir;
    });
    return edgeElements;
  }

  function toMap(edgeElements: Coords[]): Coords[][] {
    const minX = edgeElements.reduce(
      (min, edgeElement) => Math.min(min, edgeElement.x),
      0
    );
    const minY = edgeElements.reduce(
      (min, edgeElement) => Math.min(min, edgeElement.y),
      0
    );
    const maxX = edgeElements.reduce(
      (max, edgeElement) => Math.max(max, edgeElement.x),
      0
    );
    const maxY = edgeElements.reduce(
      (max, edgeElement) => Math.max(max, edgeElement.y),
      0
    );

    edgeElements.forEach((edgeElement) => {
      edgeElement.x -= minX;
      edgeElement.y -= minY;
    });

    const map: Coords[][] = [];
    for (let y = 0; y <= maxY - minY; y++) {
      map[y] = [];
      for (let x = 0; x <= maxX - minX; x++) {
        map[y].push(new Coords(x, y, '', false));
      }
    }
    edgeElements.forEach((edgeElement) => {
      map[edgeElement.y][edgeElement.x] = edgeElement;
    });

    return map;
  }

  function printMap() {
    console.log('------------ MAP: -----------');
    map.forEach((row) => {
      console.log(
        row
          .map((e) =>
            e.isEdge
              ? (e.edgeDir + ' ').substring(0, 2)
              : e.isMiddle
              ? '! '
              : '. '
          )
          .join('')
      );
    });
  }

  const edges = getEdges('./18/18-input.txt');
  const edgeElements = toCoords(edges);
  const map = toMap(edgeElements);

  map.forEach((row) => {
    let nbrOfCrossedEdges = 0;
    row.forEach((el) => {
      if (el.edgeDir.includes('R') || el.edgeDir.includes('L')) {
        nbrOfCrossedEdges++;
      }
      if (nbrOfCrossedEdges % 2 === 1 && !el.isEdge) {
        el.isMiddle = true;
      }
    });
  });

  printMap();
  const sum = map.reduce(
    (tally1, row) =>
      tally1 +
      row.reduce(
        (tally2, e) => tally2 + (e.isStart || e.isMiddle || e.isEdge ? 1 : 0),
        0
      ),
    0
  );

  console.log({ sum });
}
