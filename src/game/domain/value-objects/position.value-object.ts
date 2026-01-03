export class Position {
  constructor(
    public readonly row: number,
    public readonly col: number,
  ) {
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      throw new Error('Invalid position. Row and column must be between 0 and 2.');
    }
  }

  equals(other: Position): boolean {
    return this.row === other.row && this.col === other.col;
  }
}