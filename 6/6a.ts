namespace adventOfCode6a {
  class Race {
    constructor(public time: number, public record: number) {}
  }

  function getRaces(test: boolean = false): Race[] {
    return test
      ? [
          { time: 7, record: 9 },
          { time: 15, record: 40 },
          { time: 30, record: 200 },
        ]
      : [
          { time: 56, record: 499 },
          { time: 97, record: 2210 },
          { time: 77, record: 1097 },
          { time: 93, record: 1440 },
        ];
  }

  function getNbrOfWaysToWin(race: Race): number {
    let nbrOfWaysToWin = 0;
    for (let i = 0; i <= race.time; i++) {
      const speed = i * 1;
      const duration = race.time - i;
      const distance = speed * duration;
      if (distance > race.record) {
        nbrOfWaysToWin++;
      }
    }
    return nbrOfWaysToWin;
  }

  const races = getRaces();
  const nbrOfWaysToWinArray = races.map((r) => getNbrOfWaysToWin(r));
  const res = nbrOfWaysToWinArray.reduce((tally, r) => tally * r, 1);
  console.log({ races, nbrOfWaysToWinArray, res });
}
