//Intialising the calls for the pins and current state
class PinBowling {
    constructor() {
      this.rolls = [];
      this.currentRole = 0;
    }
  
    static create = () => new PinBowling();
  
    roll = pins => (this.rolls[this.currentRole++] = pins);
  
    reset = () => {
      this.rolls = [];
      this.currentRole = 0;
    };
  
    pinsUp = () => {
      const scoreData = this.score();
      let pinsUp = 10;
      scoreData.forEach(o => {
        if (o.pinsUp !== null && !isNaN(o.pinsUp)) {
          pinsUp = o.pinsUp;
        }
      });
      return pinsUp;
    };
  //Score functionality with addition for frame, score data, bonus for strike

    score = () => {
      let scoreData = [];
      let score = 0;
      let frameIndex = 0;
  
      const roll1 = () => this.rolls[frameIndex];
      const roll2 = () => this.rolls[frameIndex + 1];
      const roll3 = () => this.rolls[frameIndex + 2];
  
      const sumOfFrameRolls = () => roll1() + roll2();
  
      const spareBonus = () => roll3();
  
      const strikeBonus = () => roll2() + roll3();
  
      const isStrike = () => roll1() === 10;
  
      const isSpare = () => sumOfFrameRolls() === 10;
  
      const saveFrame = (scoreData, leftBox, rightBox, score, pinsUp) => {
        if (scoreData.length < 9) {
          scoreData.push({
            leftBox,
            rightBox,
            cumulativeScore: score,
            pinsUp
          });
        } else {
          const box1 = roll1() === 10 ? "X" : roll1();
          const box2 = roll2() === 10 ? "X" : isSpare() ? "/" : roll2();
          let box3;
          if (roll3() === 10) {
            box3 = "X";
          } else if (roll1() === 10 || roll1() + roll2() === 10) {
            box3 = roll3();
          } else {
            box3 = "";
          }
  
          scoreData.push({
            leftBox: box1,
            rightBox: box2,
            cumulativeScore: score,
            pinsUp,
            extraBox: box3
          });
        }
      };
  
      [...Array(10)].forEach((_, frame) => {
        if (isStrike()) {
          score += 10 + strikeBonus();
          saveFrame(scoreData, "", "X", score, 10);
          frameIndex++;
        } else if (isSpare()) {
          score += 10 + spareBonus();
          saveFrame(scoreData, roll1(), "/", score, 10);
          frameIndex += 2;
        } else {
          score += sumOfFrameRolls();
          const pinsUp = roll2() !== undefined ? 10 : 10 - roll1();
          saveFrame(scoreData, roll1(), roll2(), score, pinsUp);
          frameIndex += 2;
        }
      });
  
      return scoreData;
    };
  }
  
  export default PinBowling;
  