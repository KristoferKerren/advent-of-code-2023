namespace adventOfCode7a {
  class Hand {
    constructor(public handCards: string, public bid: number) {}
  }

  function getHands(fileName: string): Hand[] {
    const fs = require('fs');
    const data: string = fs.readFileSync(fileName, 'utf8');
    return data
      .replaceAll('\r', '')
      .split('\n')
      .map((e) => {
        const res = e.split(' ');
        return { handCards: res[0], bid: parseInt(res[1]) };
      });
  }

  function removeCardAtIndex(cards: string, index: number) {
    return (
      cards.substring(0, index) + '*' + cards.substring(index + 1, cards.length)
    );
  }

  function getCardsValue(cards: string) {
    // 6 = FiveOfKind
    // 5 = FourOfKind
    // 4 = FullHouse
    // 3 = ThreeOfKind
    // 2 = TwoPair
    // 1 = Pair
    // 0 = HighCard
    let fiveOfKinds = 0;
    let fourOfKinds = 0;
    let threeOfKinds = 0;
    let pairs = 0;
    let cardsTemp = cards;
    for (let i = 0; i < cardsTemp.length; i++) {
      let card = cardsTemp.at(i);
      if (card === '*') {
        continue;
      }
      let nbrOfCards = 1;
      for (let ii = i + 1; ii < cardsTemp.length; ii++) {
        if (cardsTemp.at(ii) === card) {
          nbrOfCards++;
          cardsTemp = removeCardAtIndex(cardsTemp, ii);
        }
      }
      if (nbrOfCards === 5) fiveOfKinds++;
      if (nbrOfCards === 4) fourOfKinds++;
      if (nbrOfCards === 3) threeOfKinds++;
      if (nbrOfCards === 2) pairs++;

      cardsTemp = removeCardAtIndex(cardsTemp, i);
    }

    if (fiveOfKinds === 1) return 6;
    if (fourOfKinds === 1) return 5;
    if (threeOfKinds === 1 && pairs === 1) return 4;
    if (threeOfKinds === 1) return 3;
    if (pairs === 2) return 2;
    if (pairs === 1) return 1;
    return 0;
  }

  function getCardValue(card1: string): number {
    switch (card1) {
      case 'A':
        return 14;
      case 'K':
        return 13;
      case 'Q':
        return 12;
      case 'J':
        return 11;
      case 'T':
        return 10;
      default:
        return parseInt(card1);
    }
  }

  function isHigherValue(cards1: string, cards2: string): boolean {
    if (getCardsValue(cards1) > getCardsValue(cards2)) {
      return true;
    } else if (getCardsValue(cards1) < getCardsValue(cards2)) {
      return false;
    }
    for (let i = 0; i < cards1.length; i++) {
      if (getCardValue(cards1[i]) === getCardValue(cards2[i])) {
        continue;
      }
      return getCardValue(cards1[i]) > getCardValue(cards2[i]);
    }
    console.log(`hand1 ${cards1} and hand2 ${cards2} is the same??`);
    return false;
  }

  const hands = getHands('7-input.txt');
  const handsSorted = hands.sort((a, b) =>
    isHigherValue(a.handCards, b.handCards) ? 1 : -1
  );
  const sum = handsSorted
    .map((h, index) => h.bid * (index + 1))
    .reduce((tally, res) => tally + res);
  console.log(sum);
}
