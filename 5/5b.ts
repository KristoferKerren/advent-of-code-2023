namespace adventOfCode5b {
  enum MapperType {
    seedtosoil,
    soiltofertilizer,
    fertilizertowater,
    watertolight,
    lighttotemperature,
    temperaturetohumidity,
    humiditytolocation,
  }

  class MapperRange {
    constructor(
      public destinationRangeStart: number,
      public sourceRangeStart: number,
      public rangeLength: number
    ) {}
  }

  function mapperTypes() {
    return Object.keys(MapperType).filter((v) => isNaN(Number(v)));
  }

  function getIndex(searchString: string, minIndex: number): number {
    for (let i = minIndex; i < rawInput.length; i++) {
      if (rawInput[i] === searchString) {
        return i;
      }
    }
    return rawInput.length;
  }

  function getRawInput(fileName: string): string[] {
    const fs = require('fs');
    const data = fs.readFileSync(fileName, 'utf8');
    return data
      .replaceAll('\r', '')
      .replaceAll('-', '')
      .replaceAll(' map:', '')
      .split('\n');
  }

  function parseInput() {
    const seedsIndex = rawInput.findIndex((i) => i.startsWith('seeds'));
    const seeds: number[] =
      rawInput
        .at(seedsIndex)
        ?.split(': ')
        .at(1)
        ?.split(' ')
        .map((str) => parseInt(str)) ?? [];

    const mapperMap = new Map();

    let currentIndex = 1;
    mapperTypes().forEach((key) => {
      let startIndex = getIndex(key, currentIndex) + 1;
      let endIndex = getIndex('', startIndex);
      const seedToSoilArray = rawInput
        .slice(startIndex, endIndex)
        .map((arr) => {
          const [drs, srs, rl] = arr.split(' ').map((str) => parseInt(str));
          return new MapperRange(drs, srs, rl);
        })
        .sort((a, b) => a.sourceRangeStart - b.sourceRangeStart);
      mapperMap.set(key, seedToSoilArray);
    });

    return { seeds, mapperMap };
  }

  function getDestination(source: number, mapperRanges: MapperRange[]): number {
    let minLimit = 0;
    let maxLimit = mapperRanges.length - 1;
    let currentIndex = Math.trunc((minLimit + maxLimit) / 2);

    while (minLimit <= maxLimit) {
      const mapperRange = mapperRanges[currentIndex];
      if (
        source >= mapperRange.sourceRangeStart &&
        source < mapperRange.sourceRangeStart + mapperRange.rangeLength
      ) {
        return (
          mapperRange.destinationRangeStart -
          mapperRange.sourceRangeStart +
          source
        );
      }
      if (source < mapperRange.sourceRangeStart) {
        maxLimit = currentIndex - 1;
        currentIndex = Math.floor((minLimit + maxLimit) / 2);
      }
      if (source >= mapperRange.sourceRangeStart + mapperRange.rangeLength) {
        minLimit = currentIndex + 1;
        currentIndex = Math.floor((minLimit + maxLimit) / 2);
      }
    }
    return source;
  }

  const rawInput = getRawInput('5-input.txt');

  const { seeds, mapperMap } = parseInput();

  let minLocation: number = 999999999999999999999999;

  for (let j = 0; j < seeds.length; j += 2) {
    const start = seeds[j];
    const end = start + seeds[j + 1];
    for (let jj = start; jj < end; jj++) {
      let currentPos = jj;
      mapperTypes().forEach((key) => {
        currentPos = getDestination(currentPos, mapperMap.get(key));
      });
      minLocation = Math.min(currentPos, minLocation);
    }
  }

  console.log({ minLocation });
  //47909639
}
