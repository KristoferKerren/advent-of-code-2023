const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;
const colors = ['red', 'green', 'blue'];

function sortData(rows) {
  const data = [];
  rows.forEach((input) => {
    const gameId = parseInt(input.substring(5, input.indexOf(':')));
    const gameInfo = input.replaceAll(' ', '').split(':')[1];
    const gameSets = gameInfo.split(';');
    dataSingle = { gameId: gameId };
    var sets = [];

    gameSets.map((gameSet) => {
      let gameSetInfo = { blue: 0, green: 0, red: 0 };
      gameSet.split(',').forEach((g) => {
        colors.forEach((color) => {
          if (g.includes(color)) {
            gameSetInfo[color] = Math.max(
              gameSetInfo[color],
              g.substring(0, g.indexOf(color))
            );
          }
        });
      });
      sets.push(gameSetInfo);
    });
    dataSingle.sets = sets;
    data.push(dataSingle);
  });

  return data;
}

function isImpossible(game) {
  for (var i = 0; i < game.sets.length; i++) {
    const set = game.sets[i];
    if (set.red > maxRed || set.green > maxGreen || set.blue > maxBlue) {
      console.log(set);
      return true;
    }
  }
  return false;
}

const fs = require('fs');

// Read the file synchronously
const data = fs.readFileSync('2-input.txt', 'utf8');

// Split the data into an array based on newlines
const inputs = data.replaceAll('\r', '').split('\n');
const gameData = sortData(inputs);
const sum = gameData.reduce((tally, game) => {
  if (!isImpossible(game)) {
    console.log(game.gameId);
    return game.gameId + tally;
  }
  return tally;
}, 0);
console.log(sum);
