namespace adventOfCode6b {
  class Race {
    constructor(public time: number, public record: number) {}
  }

  function getRaces(test: boolean = false): Race[] {
    return test
      ? [{ time: 71530, record: 940200 }]
      : [{ time: 56977793, record: 499221010971440 }];
  }

  function getNbrOfWaysToWin(race: Race): number {
    let nbrOfWaysToWin = 0;
    for (let i = 1; i < race.time; i++) {
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

  //   const snafus = [
  //     '10===1',
  //     '1-2=1-2-===11-1',
  //     '10-0',
  //     '2==-10',
  //     '12=10=0--01-0=000',
  //     '120-==1',
  //     '1-11-===0-',
  //     '2-00=1=',
  //     '1-010=1112==1-=',
  //     '2=-=220--2=-=210',
  //     '10-0-2-=',
  //     '2=011120',
  //     '1-0-1-1=0=202',
  //     '1010=2021=0-==',
  //     '11=20212010',
  //     '1-==1',
  //     '1=1-2==21-',
  //     '1-==',
  //     '22=2=0=120=',
  //     '2-22020-2-2=-22',
  //     '2-022-2-1112212',
  //     '1==0',
  //     '1222-',
  //     '11==10',
  //     '2221120-',
  //     '1-1-2--0-2-120==2-=1',
  //     '11101-',
  //     '1-11=212-20',
  //     '22=-2=-02=-=-01212',
  //     '1=-',
  //     '11=2=1-222-=-',
  //     '1=12-22-=-21',
  //     '1-=0212--=1=01=2',
  //     '1220-12020-',
  //     '22=010201',
  //     '202-1020212220=0=0',
  //     '21-201=2021=1--0200',
  //     '2=--',
  //     '2111=',
  //     '20-02211112=0-',
  //     '21-==20-22',
  //     '2=221101-=',
  //     '11-=-1210',
  //     '10-222121=2-02',
  //     '1-202-1-01==',
  //     '101=11--0-=',
  //     '10==110101121',
  //     '2222--2-020',
  //     '1-==2==02020',
  //     '22001-20=2-2',
  //     '1-001',
  //     '202--=2=0-=12=',
  //     '2=',
  //     '1-2',
  //     '1-=-1-==02=20',
  //     '2==2=-12=110',
  //     '20210-22-',
  //     '1201---',
  //     '10=0==10===-2---0',
  //     '122',
  //     '1-2-1-',
  //     '12=2-=21',
  //     '1-200000012',
  //     '1===-=02=1-=-',
  //     '122=0=2201',
  //     '211-=112--21-==2=',
  //     '1-1',
  //     '1=0211-2',
  //     '122-1-1=021-==-0',
  //     '22=11-122-10',
  //     '22=11',
  //     '2210=2',
  //     '20=-=-=11',
  //     '1=0200-1-2=0',
  //     '10=012-',
  //     '1=-2=1-21=-021',
  //     '21221=101-=',
  //     '22=0=',
  //     '1-==201--112-1200',
  //     '2==2-==',
  //     '1-0=1-1',
  //     '201--101=021--00',
  //     '12-1-111121012',
  //     '11010-2-11--1-0-2',
  //     '1101-0==210-2',
  //     '1=0',
  //     '21-01--',
  //     '1=112=1-0-',
  //     '1201=---',
  //     '120--1---',
  //     '1=0-0---0-',
  //     '1-',
  //     '2000010-2-12=10',
  //     '1=20',
  //     '211==112',
  //     '102020=-=-1210=1-1',
  //     '21==11020-021',
  //     '2=-00====210=1',
  //     '1-0=-=-21-00=0-',
  //     '1=110---=0=2000=20=',
  //     '1-122-=11=2-22-',
  //     '120101-12=02=1',
  //     '12-2-0==-001221=',
  //     '22=1--10=',
  //     '11100=--0-10--=02=',
  //     '102-01',
  //     '1=2001=2=-',
  //   ];

  //   const snafusTest = [
  //     '1=-0-2',
  //     '12111',
  //     '2=0=',
  //     '21',
  //     '2=01',
  //     '111',
  //     '20012',
  //     '112',
  //     '1=-1=',
  //     '1-12',
  //     '12',
  //     '1=',
  //     '122',
  //   ];

  //   function getDecimal(snafu: string) {
  //     let decimal = 0;
  //     for (var i = 0; i < snafu.length; i++) {
  //       let snafuConverted = 0;
  //       switch (snafu[i]) {
  //         case '2':
  //           snafuConverted = 2;
  //           break;
  //         case '1':
  //           snafuConverted = 1;
  //           break;
  //         case '0':
  //           snafuConverted = 0;
  //           break;
  //         case '-':
  //           snafuConverted = -1;
  //           break;
  //         case '=':
  //           snafuConverted = -2;
  //           break;
  //       }
  //       decimal += snafuConverted * Math.pow(5, snafu.length - i - 1);
  //     }
  //     return decimal;
  //   }
  //   '1';

  //   console.log(Math.pow(5, 6 - 1));
  //   const nbr = 33078355623611 - 1 * Math.pow(5, 6 - 1);

  //   let nbrOfCharacters = 1;
  //   while (Math.pow(5, nbrOfCharacters - 1) < nbr) {
  //     nbrOfCharacters++;
  //   }

  //   const first = Math.floor(Math.pow(5, nbrOfCharacters - 1) / nbr);

  //   console.log({ nbr, nbrOfCharacters, first });
  //   function getSnafu(decimal: number) {
  //     let nbrOfCharacters = 1;
  //     while (Math.pow(5, nbrOfCharacters - 1) < decimal) {
  //       nbrOfCharacters++;
  //     }

  //     console.log(nbrOfCharacters);

  //     const first = Math.floor(Math.pow(5, nbrOfCharacters - 1) / decimal);

  //     let decimal2 = decimal - first * Math.pow(5, nbrOfCharacters - 1);
  //     console.log(decimal2);
  //     let nbrOfCharacters2 = 1;
  //     while (Math.pow(5, nbrOfCharacters2 - 1) < decimal2) {
  //       nbrOfCharacters2++;
  //     }

  //     const second = Math.pow(5, nbrOfCharacters2 - 1) / decimal2;
  //     if (second < 0) {
  //     }

  //     //for (let i = 0; i )
  //     console.log({ first, second });
  //   }

  //   const sum = snafus
  //     .map((s) => getDecimal(s))
  //     .reduce((tally, res) => tally + res);
  //   console.log(sum);
  //   // 1=-0-2 to 23442    1=-0-2
  //   // 2=-1=0 to 124030        2=-1=0
  //   //13313423433014423421
  //   console.log(getDecimal('2-=2-0=-0-=0200=--21'));
}
