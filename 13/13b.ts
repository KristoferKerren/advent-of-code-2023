import { sum } from '../helpers';

namespace adventOfCode13a {
  function getPatterns(fileName: string) {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    const dataArr = data.replaceAll('\r', '').split('\n');

    const res: string[][] = [];
    let arr: string[] = [];
    dataArr.forEach((element, i) => {
      //console.log({ element, i, isLadt: i === dataArr.length - 1 });
      const isLast = i === dataArr.length - 1;
      if (!element) {
        res.push(arr);
        arr = [];
      } else {
        arr.push(element);
      }
      if (isLast) {
        res.push(arr);
      }
    });
    return res;
  }

  function nbrOfErrors(string1: string, string2: string): number {
    let diff = 0;
    for (let i = 0; i < string1.length; i++) {
      if (string1[i] !== string2[i]) {
        diff++;
      }
    }
    return diff;
  }

  function isHorizontalLineMirror(
    pattern: string[],
    lineIndex: number,
    deltaY: number = 0.5,
    errors: number = 0
  ): boolean {
    if (lineIndex < 0 || lineIndex > pattern.length - 1) {
      return false;
    }
    const topY = lineIndex - deltaY;
    const bottomY = lineIndex + deltaY;
    if ((topY < 0 || bottomY > pattern.length - 1) && errors === 1) {
      return true;
    }
    const patternTop = pattern.at(topY) || '';
    const patternBottom = pattern.at(bottomY) || '';
    let newErrors = errors + nbrOfErrors(patternTop, patternBottom);
    // console.log({
    //   lineIndex,
    //   deltaY,
    //   topY,
    //   bottomY,
    //   patternTop,
    //   patternBottom,
    //   patternLength: pattern.length,
    // });
    if (newErrors > 1) {
      return false;
    }
    return isHorizontalLineMirror(pattern, lineIndex, deltaY + 1, newErrors);
  }

  function isVerticalLineMirror(
    pattern: string[],
    lineIndex: number,
    deltaX: number = 0.5,
    errors: number = 0
  ): boolean {
    const maxX = (pattern.at(0)?.length || 0) - 1;
    if (lineIndex < 0 || lineIndex > maxX) {
      return false;
    }
    const leftX = lineIndex - deltaX;
    const rightX = lineIndex + deltaX;
    if ((leftX < 0 || rightX > maxX) && errors === 1) {
      return true;
    }
    const patternLeft = pattern.map((row) => row.at(leftX)).join('');
    const patternRight = pattern.map((row) => row.at(rightX)).join('');
    let newErrors = errors + nbrOfErrors(patternLeft, patternRight);
    // console.log({
    //   lineIndex,
    //   deltaX,
    //   leftX,
    //   rightX,
    //   patternLeft,
    //   patternRight,
    //   patternLength: pattern.at(0)?.length,
    // });
    if (newErrors > 1) {
      return false;
    }
    return isVerticalLineMirror(pattern, lineIndex, deltaX + 1, newErrors);
  }

  function getPatternValue(pattern: string[]): number {
    for (let i = 0.5; i < pattern.length; i++) {
      if (isHorizontalLineMirror(pattern, i)) {
        return 100 * (i + 0.5);
      }
    }
    for (let i = 0.5; i < pattern[0].length; i++) {
      if (isVerticalLineMirror(pattern, i)) {
        return 1 * (i + 0.5);
      }
    }

    return 0;
  }

  console.log(getPatterns('./13/13-input-test.txt').map(getPatternValue));
}
