const { type } = require('os');

function getMap(fileName) {
  const rawInput = require('fs').readFileSync(
    require('path').resolve(__dirname, fileName),
    'utf-8'
  );

  const allKeysSet = new Set();
  const connections = new Map();
  const inputParsed = rawInput.split(/\r?\n/).map((r) => r.split(': '));
  inputParsed.forEach((r) => {
    allKeysSet.add(r[0]);
    r[1].split(' ').forEach((rr) => allKeysSet.add(rr));
  });

  allKeysSet.forEach((key) => {
    connections.set(key, []);
  });

  inputParsed.forEach((r) => {
    connections.get(r[0]).push(...r[1].split(' '));
    r[1].split(' ').forEach((key) => {
      connections.get(key).push(r[0]);
    });
  });

  const allKeys = Array.from(allKeysSet);

  return { connections, allKeys };
}

function getFirstPathFromAtoB(a, b, brokenConnections = []) {
  const currentPaths = [];
  const visited = new Set();
  let shortestPath;
  currentPaths.push({ currentEl: a, history: [], steps: 0 });
  let minSteps = 999999999999999;
  while (currentPaths.length > 0) {
    const currentPath = currentPaths.shift();
    if (currentPath.steps >= minSteps) {
      continue;
    }
    visited.add(currentPath.currentEl);
    const newPaths = connections
      .get(currentPath.currentEl)
      .filter((key) => !visited.has(key) && key !== currentPath.cameFrom);
    newPaths.forEach((key) => {
      const his = [currentPath.currentEl, key].sort().join('/');
      const newHistory = [...currentPath.history, his];
      if (
        currentPath.history.includes(his) ||
        brokenConnections.includes(his) ||
        currentPath.steps + 1 >= minSteps
      ) {
        return;
      }
      if (key === b) {
        if (currentPath.steps + 1 < minSteps) {
          shortestPath = newHistory;
          minSteps = currentPath.steps + 1;
        }
      } else {
        currentPaths.push({
          currentEl: key,
          history: newHistory,
          cameFrom: currentPath.currentEl,
          steps: currentPath.steps + 1,
        });
      }
    });
    //visited.add(currentPath.currentEl);
  }
  return shortestPath;
}

function getConnected(a, brokenConnections = []) {
  const visited = new Set();
  const currentPaths = [];
  currentPaths.push({ currentEl: a });
  while (currentPaths.length > 0) {
    const currentPath = currentPaths.pop();
    const newPaths = connections
      .get(currentPath.currentEl)
      .filter((key) => !visited.has(key));
    newPaths.forEach((key) => {
      const his = [currentPath.currentEl, key].sort().join('/');
      if (brokenConnections.includes(his)) {
        return;
      }
      currentPaths.push({
        currentEl: key,
      });
    });
    visited.add(currentPath.currentEl);
  }
  return visited.size;
}

let { connections, allKeys } = getMap('./25-input.txt');
const node1 = allKeys[0];

for (var ii = 1; ii < allKeys.length; ii++) {
  const node2 = allKeys[ii];

  const firstPath = getFirstPathFromAtoB(node1, node2);
  firstPath.forEach((fpath, fInd) => {
    const secondPath = getFirstPathFromAtoB(node1, node2, [fpath]);
    secondPath.forEach((spath, sInd) => {
      const thirdPath = getFirstPathFromAtoB(node1, node2, [fpath, spath]);
      thirdPath.forEach((tpath, tInd) => {
        const connected1 = getConnected(node1, [fpath, spath, tpath]);
        const connected2 = getConnected(node2, [fpath, spath, tpath]);
        if (connected1 < allKeys.length) {
          console.log({ fpath, spath, tpath, connected1 });
          console.log({ fpath, spath, tpath, connected2 });
          ii = allKeys.length;
        }
      });
    });
  });
}
