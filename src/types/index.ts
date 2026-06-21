export type Theme = 'dark' | 'blue' | 'orange';
export type Player = 'Blue' | 'Orange';
export type BoardSize = 16 | 24 | 36;

export interface GameSettings {
  theme: Theme;
  player: Player;
  boardSize: BoardSize;
}