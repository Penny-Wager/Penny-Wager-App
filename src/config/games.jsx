import AviatorGame from "../game/AviatorGame";
import CardPickGame from "../game/CardPickGame";
import CoinFlipGame from "../game/CoinFlipGame";
import DiceRollGame from "../game/DiceRollGame";
import LuckyNumberGame from "../game/LuckyNumberGame";

export const GAMES = [
  {
    id: "coin-flip",
    path: "coin-flip",
    element: <CoinFlipGame />,
  },
  {
    id: "dice-roll",
    path: "dice-roll",
    element: <DiceRollGame />,
  },
  {
    id: "lucky-number",
    path: "lucky-number",
    element: <LuckyNumberGame />,
  },
  {
    id: "card-pick",
    path: "card-pick",
    element: <CardPickGame />,
  },
  {
    id: "aviator",
    path: "aviator",
    element: <AviatorGame />,
  },
];
