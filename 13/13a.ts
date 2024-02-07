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

  function isHorizontalLineMirror(
    pattern: string[],
    lineIndex: number = 0.5,
    deltaY: number = 0.5
  ): boolean {
    if (lineIndex < 0 || lineIndex > pattern.length - 1) {
      return false;
    }
    const topY = lineIndex - deltaY;
    const bottomY = lineIndex + deltaY;
    if (topY < 0 || bottomY > pattern.length - 1) {
      return true;
    }
    const patternTop = pattern.at(topY) || '';
    const patternBottom = pattern.at(bottomY) || '';
    // console.log({
    //   lineIndex,
    //   deltaY,
    //   topY,
    //   bottomY,
    //   patternTop,
    //   patternBottom,
    //   patternLength: pattern.length,
    // });
    if (patternTop !== patternBottom) {
      return false;
    }
    return isHorizontalLineMirror(pattern, lineIndex, deltaY + 1);
  }

  function isVerticalLineMirror(
    pattern: string[],
    lineIndex: number = 0.5,
    deltaX: number = 0.5
  ): boolean {
    const maxX = (pattern.at(0)?.length || 0) - 1;
    if (lineIndex < 0 || lineIndex > maxX) {
      return false;
    }
    const topX = lineIndex - deltaX;
    const bottomX = lineIndex + deltaX;
    if (topX < 0 || bottomX > maxX) {
      return true;
    }
    const patternLeft = pattern.map((row) => row.at(topX)).join('');
    const patternRight = pattern.map((row) => row.at(bottomX)).join('');
    // console.log({
    //   lineIndex,
    //   deltaX,
    //   topX,
    //   bottomX,
    //   patternLeft,
    //   patternRight,
    //   patternLength: pattern.at(0)?.length,
    // });
    if (patternLeft !== patternRight) {
      return false;
    }
    return isVerticalLineMirror(pattern, lineIndex, deltaX + 1);
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

  const patterns = getPatterns('./13/13-input.txt');
  const values = patterns.map(getPatternValue);
  console.log(sum(values));
}
