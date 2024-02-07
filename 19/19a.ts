import { memoize } from '../helpers';

namespace adventOfCode19a {
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

  function getEdges(fileName: string) {
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
    const ratings = data.slice(index + 1).map((rating) => {
      const arr = rating.replace('{', '').replace('}', '').split(',');
      const x = parseInt(
        arr.find((a) => a.includes('x='))?.replace('x=', '') || ''
      );
      const m = parseInt(
        arr.find((a) => a.includes('m='))?.replace('m=', '') || ''
      );
      const a = parseInt(
        arr.find((a) => a.includes('a='))?.replace('a=', '') || ''
      );
      const s = parseInt(
        arr.find((a) => a.includes('s='))?.replace('s=', '') || ''
      );
      return new Rating(x, m, a, s);
    });
    return { workflows, ratings };
  }

  const checkRule = memoize((rules: string[], rating: Rating): string => {
    for (let index = 0; index < rules.length; index++) {
      let rule = rules[index];
      if (rule === 'A' || rule === 'R' || rule.match(/^[a-z]+$/)) {
        return rule;
      }
      const [rat, value, res] = rule.split(/<|>|:/);

      if (rule.includes('<') && rating.getValue(rat) < parseInt(value)) {
        return res;
      } else if (rule.includes('>') && rating.getValue(rat) > parseInt(value)) {
        return res;
      }
    }
    return '';
  });

  const isAccepted = memoize((part: string, rating: Rating): boolean => {
    while (part !== 'A' && part !== 'R') {
      part = checkRule(workflows.get(part)!, rating);
    }
    return part === 'A';
  });

  const { workflows, ratings } = getEdges('./19/19-input-test.txt');
  let sum = 0;
  [...workflows.keys()].forEach((key) => {
    if (key !== 'in') return;
    console.log(key);
    ratings.forEach((rating) => {
      if (isAccepted(key, rating)) {
        console.log('Accepted!', rating);
        sum += rating.sum;
      }
    });
  });

  console.log({ sum });
}
