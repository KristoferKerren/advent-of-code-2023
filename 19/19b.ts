import { memoize, sum } from '../helpers';

namespace adventOfCode19b {
  class Rating {
    constructor(
      public x: number,
      public m: number,
      public a: number,
      public s: number
    ) {}

    getValue(input: string): number {
      return input === 'x'
        ? this.x
        : input === 'm'
        ? this.m
        : input === 'a'
        ? this.a
        : this.s;
    }

    get sum(): number {
      return this.x + this.m + this.a + this.s;
    }
  }

  function getEdges(fileName: string): {
    workflows: Map<string, string[]>;
    //ratings: Rating[];
    testLimits: Map<string, number[]>;
  } {
    const fs = require('fs');
    const data: string[] = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n');
    const index = data.indexOf('');
    const workflows = new Map<string, string[]>();
    data.slice(0, index).forEach((workflow) => {
      workflows.set(
        workflow.split('{')[0],
        workflow.split('{')[1].replace('}', '').split(',')
      );
    });

    const testLimits: Map<string, number[]> = new Map<string, number[]>();
    testLimits.set('x', [max]);
    testLimits.set('m', [max]);
    testLimits.set('a', [max]);
    testLimits.set('s', [max]);
    [...workflows.values()].forEach((rules) => {
      for (let index = 0; index < rules.length; index++) {
        let rule = rules[index];
        if (rule === 'A' || rule === 'R' || rule.match(/^[a-z]+$/)) {
          continue;
        }
        const [rat, value, res] = rule.split(/<|>|:/);

        [...testLimits.keys()].forEach((v) => {
          if (rat === v) {
            testLimits
              .get(v)!
              .push(parseInt(value) + (rule.includes('>') ? 0 : -1));
          }
        });
      }
    });

    [...testLimits.values()].forEach((v) => {
      v.sort((a, b) => a - b);
    });

    return { workflows, testLimits };
  }

  const checkRule = (rules: string[], rating: Rating): string => {
    for (let index = 0; index < rules.length; index++) {
      let rule = rules[index];
      if (rule === 'A' || rule === 'R') {
        return rule;
      }
      if (rule.match(/^[a-z]+$/)) {
        return checkRule(workflows.get(rule)!, rating);
      }
      const [rat, value, res] = rule.split(/<|>|:/);

      if (
        (rule.includes('<') && rating.getValue(rat) < parseInt(value)) ||
        (rule.includes('>') && rating.getValue(rat) > parseInt(value))
      ) {
        if (res === 'A' || res === 'R') {
          return res;
        }
        return checkRule(workflows.get(res)!, rating);
      }
    }
    return '';
  };

  const isAccepted = (rating: Rating): boolean => {
    return checkRule(workflows.get('in')!, rating) === 'A';
  };

  const max: number = 4000;
  const product: number = Math.pow(max, 4);

  const { workflows, testLimits } = getEdges('./19/19-input.txt');
  let sum = 0;
  console.log(testLimits);
  let previosX = 0;
  testLimits.get('x')!.forEach((x, xInd) => {
    let previosM = 0;
    console.log(
      `Working: ${
        Math.round((xInd / testLimits.get('x')!.length) * 1000) / 10
      }%`
    );
    testLimits.get('m')!.forEach((m) => {
      let previosA = 0;
      testLimits.get('a')!.forEach((a) => {
        let previosS = 0;
        testLimits.get('s')!.forEach((s) => {
          const rating = new Rating(x, m, a, s);
          if (isAccepted(rating)) {
            sum +=
              (x - previosX) * (m - previosM) * (a - previosA) * (s - previosS);
          }
          previosS = s;
        });
        previosA = a;
      });
      previosM = m;
    });
    previosX = x;
  });

  console.log(Math.round(sum));
  console.log(Math.round(sum) / Math.pow(4000, 4));
}
