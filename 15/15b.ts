import { sum } from '../helpers';

namespace adventOfCode15b {
  function getSteps(fileName: string): string[] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    return data.split(',');
  }

  function getASCII(char: string): number {
    return char.charCodeAt(0);
  }

  function getValueFromHash(hash: string): number {
    let res = 0;
    [...hash].forEach((char, index) => {
      res = ((res + getASCII(char)) * 17) % 256;
    });
    return res;
  }

  function getStepString(step: string): string {
    if (step.includes('=')) return step.split('=')[0];
    if (step.includes('-')) return step.split('-')[0];
    if (step.includes(' ')) return step.split(' ')[0];
    return step;
  }

  function isEqualStepString(step1: string, step2: string): boolean {
    return getStepString(step1) === getStepString(step2);
  }

  function getBoxes(): Map<number, string[]> {
    let boxes: Map<number, string[]> = new Map();
    steps.forEach((step) => {
      const value = getValueFromHash(getStepString(step));
      if (step.includes('=')) {
        if (!boxes.has(value)) {
          boxes.set(value, []);
        }
        const array = boxes.get(value) || [];
        const index = array?.findIndex((a) => isEqualStepString(a, step)) ?? -1;
        if (index !== -1) {
          // Replace:
          array[index] = step.replace('=', ' ');
        } else if (array) {
          // Add at last:
          array?.push(step.replace('=', ' '));
        }
      } else if (step.includes('-')) {
        if (boxes.has(value)) {
          const array = boxes.get(value);
          const index =
            array?.findIndex((a) => isEqualStepString(a, step)) ?? -1;
          if (index !== undefined && index !== -1) {
            // Remove:
            array?.splice(index, 1);
            if (array?.length === 0) {
              boxes.delete(value);
            }
          }
        }
      }
    });
    return boxes;
  }

  const steps = getSteps('./15/15-input-test.txt');
  const boxes = getBoxes();
  console.log(boxes);
  const values = [...boxes.keys()].map((key) => {
    return boxes
      .get(key)
      ?.reduce(
        (tally, b, index) =>
          tally + (key + 1) * (index + 1) * (parseInt(b.split(' ')[1]) || 0),
        0
      );
  });
  console.log(values);
  console.log(sum(values));
}
