import { memoize } from '../helpers';

namespace adventOfCode20a {
  class Module {
    constructor(
      public name: string,
      public type: 'broadcaster' | 'flipflop' | 'conjunction' | 'output',
      public destinations: Module[] = [],
      public inputs: Module[] = [],
      public inputsPulses: ('high' | 'low')[] = [],
      public isOpen: boolean = false,
      public nextPulse: 'high' | 'low' = 'low'
    ) {}
  }

  function getModules(fileName: string) {
    const fs = require('fs');
    const modulesDatas: string[] = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n');
    const modules = modulesDatas.map((moduleData: string) => {
      const type =
        moduleData.split(' -> ')[0] === 'broadcaster'
          ? 'broadcaster'
          : moduleData.split(' -> ')[0][0] === '%'
          ? 'flipflop'
          : moduleData.split(' -> ')[0][0] === '&'
          ? 'conjunction'
          : 'output';
      let name = '';
      if (type === 'flipflop' || type === 'conjunction') {
        name = moduleData.split(' -> ')[0].slice(1);
      } else {
        name = moduleData.split(' -> ')[0];
      }
      return new Module(name, type);
    });
    modules.push(new Module('rx', 'output'));
    //console.log({ modulesDatas, modules });
    modulesDatas.forEach((moduleData) => {
      const moduleName = moduleData
        .split(' -> ')[0]
        .replace('%', '')
        .replace('&', '');
      const destinationNames = moduleData.split(' -> ')[1]!.split(', ');
      const module = modules.find((m) => m.name === moduleName);
      if (module) {
        module.destinations = destinationNames.map(
          (destinationName) => modules.find((m) => m.name === destinationName)!
        );
      }
    });

    modules.forEach((module) => {
      module.destinations.forEach((destination) => {
        destination?.inputs.push(module);
        destination?.inputsPulses.push('low');
      });
    });

    return modules;
  }

  function logModules() {
    console.log(
      modules.map((module) => {
        return {
          name: module.name,
          type: module.type,
          nbrOfDestinations: module.destinations.length,
          destinations: module.destinations.map(
            (destination) => destination.name
          ),
          nbrOfInputs: module.inputs.length,
          inputs: module.inputs.map((input) => input.name),
        };
      })
    );
  }

  const modules = getModules('./20/20-input.txt');
  const buttonsPushs = 1000;

  let highs = 0;
  let lows = 0;
  function sendPulse(fromModule: Module): boolean[] {
    if (!fromModule) return [];
    let shouldContinuePulse: boolean[] = [];
    const pulseType = fromModule.nextPulse;
    fromModule.destinations.forEach((toModule) => {
      if (pulseType === 'high') highs++;
      if (pulseType === 'low') lows++;
      if (!toModule) {
        shouldContinuePulse.push(false);
      } else {
        shouldContinuePulse.push(true);
        toModule.inputsPulses[toModule.inputs.indexOf(fromModule)] = pulseType;
        if (toModule.type === 'flipflop') {
          if (pulseType === 'low') {
            toModule.isOpen = !toModule.isOpen;
            toModule.nextPulse = toModule.isOpen ? 'high' : 'low';
          } else {
            shouldContinuePulse[shouldContinuePulse.length - 1] = false;
          }
        }
        if (toModule.type === 'conjunction') {
          if (toModule.inputsPulses.every((pulse) => pulse === 'high')) {
            toModule.nextPulse = 'low';
          } else {
            toModule.nextPulse = 'high';
          }
        }

        if (toModule.name === 'sq') {
          console.log(
            `Sen to ${toModule.name} from ${fromModule.name} after ${iii} clicks, type: ${pulseType}`
          );
          if (iii > 100000) {
            neverStop = false;
          }
        }
        if (pulseType === 'low' && toModule.name === 'rx') {
          console.log(`IT IS DONE!!!!!! After ${iii} clicks`);
          neverStop = false;
        }
      }

      // console.log(
      //   `${fromModule.name} sends ${pulseType} to ${toModule?.name}, ${
      //     shouldContinuePulse[shouldContinuePulse.length - 1]
      //       ? 'continue'
      //       : 'stop'
      //   }`
      // );
    });

    return shouldContinuePulse;
  }

  function pushButton(currenModules?: Module[]) {
    if (!currenModules) {
      currenModules = [modules.find((m) => m.type === 'broadcaster')!];
    }

    while (currenModules.length > 0) {
      const shouldContinuePulse = currenModules.map((m, i) => [
        ...sendPulse(m),
      ]);
      const nextModules: Module[] = [];
      currenModules.forEach((m, i) => {
        m?.destinations.forEach((d, j) => {
          if (shouldContinuePulse[i][j]) {
            nextModules?.push(d);
          }
        });
      });
      //    console.log({ currenModules, nextModules, shouldContinuePulse });
      currenModules = nextModules;
      //console.log('------');
    }
  }

  let iii = 1;
  let neverStop = true;
  while (neverStop) {
    lows++;
    pushButton();
    iii++;
    // if (iii % 10000000 === 0) {
    //   console.log({ iii, highs, lows });
    // }
  }

  //Calculate LCM:
  //  108716150681190
  //  217317393039529
  //  217374627011886
  //  217375052204570
}
