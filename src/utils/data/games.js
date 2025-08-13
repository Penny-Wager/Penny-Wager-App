import CoinFlipImage from "../../assets/game-images/flip-coin.png";
import AviatorImage from '../../assets/game-images/aviator-plane.webp'
import CardImage from "../../assets/game-images/cards-lite.webp"
import DiceImage from "../../assets/game-images/dice-vect.webp"
import LuckyNumber from '../../assets/game-images/lucky-ball.png'

export const GAMES_DATA = [
  {
    id: "coin-flip",
    name: "Coin Flip",
    description: "50/50 chance to double your bet",
    category: "casino-games",
    image: CoinFlipImage,
    releaseDate: "2025-04-01",
    featured: true,
    popular: true,
    minBet: 0.01,
    maxBet: 2,
  },
  {
    id: "dice-roll",
    name: "Dice Roll",
    description: "Roll the dice and win big",
    category: "casino-games",
    image: DiceImage,
    releaseDate: "2025-03-15",
    featured: false,
    popular: true,
    minBet: 0.01,
    maxBet: 5,
  },
  {
    id: "card-pick",
    name: "Card Pick",
    description: "Pick a card and test your luck",
    category: "card-games",
    image: CardImage,
    releaseDate: "2025-09-20",
    featured: true,
    popular: false,
    minBet: 0.01,
    maxBet: 5,
  },
  {
    id: "lucky-number",
    name: "Lucky Number",
    description: "Pick your lucky number and win",
    category: "casino-games",
    image: LuckyNumber,
    releaseDate: "2025-05-10",
    featured: false,
    popular: true,
    minBet: 0.01,
    maxBet: 10,
  },
  {
    id: "aviator",
    name: "Aviator",
    description: "Cash out before the plane flies away",
    category: "casino-games",
    image: AviatorImage,
    releaseDate: "2025-06-01",
    featured: true,
    popular: true,
    minBet: 0.01,
    maxBet: 10,
  },
];
