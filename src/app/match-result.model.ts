import { IPlayer} from "./player.model";

export interface IMatchResult {
  type: string,
  matchId: number;
  time: number;
  playerA: IPlayer;
  playerB: IPlayer;
  // playedA: string;
  // playedB: string;

}
