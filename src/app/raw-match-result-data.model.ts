export interface IRawGameResult {
  type: string;
  gameId: number;
  t: number;
  playerA: any[];
  playerB: any[];

}

export interface IRawMatchResultData {
  cursor: string;
  data: IRawGameResult[];
}
