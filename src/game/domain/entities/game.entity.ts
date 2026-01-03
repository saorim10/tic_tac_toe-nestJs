import { GameStatus } from '../enums/game-status.enum';
import { Player } from '../enums/player.enum';
import { Position } from '../value-objects/position.value-object';

export class Game {
  private board: (Player | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  private moves: { player: Player; position: Position }[] = [];
  private winner: Player | null = null;

  constructor(
    public readonly id: string,
    public playerXId: string,
    public playerOId: string | null,
    public status: GameStatus = GameStatus.WAITING,
    public currentPlayer: Player = Player.X,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  static create(playerXId: string): Game {
    return new Game(
      this.generateId(),
      playerXId,
      null,
      GameStatus.WAITING,
      Player.X,
    );
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  joinGame(playerOId: string): void {
    if (this.playerOId) {
      throw new Error('Game already has two players');
    }
    this.playerOId = playerOId;
    this.status = GameStatus.IN_PROGRESS;
    this.updatedAt = new Date();
  }

  makeMove(playerId: string, position: Position): void {
    this.validateMove(playerId, position);

    this.board[position.row][position.col] = this.currentPlayer;
    this.moves.push({ player: this.currentPlayer, position });

    this.checkWinner();
    this.switchPlayer();
    this.updatedAt = new Date();
  }

  private validateMove(playerId: string, position: Position): void {
    if (this.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Game is not in progress');
    }

    const expectedPlayerId = this.currentPlayer === Player.X ? this.playerXId : this.playerOId;
    if (playerId !== expectedPlayerId) {
      throw new Error('Not your turn');
    }

    if (this.board[position.row][position.col] !== null) {
      throw new Error('Position already taken');
    }
  }

  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
  }

  private checkWinner(): void {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
        this.winner = this.board[i][0];
        this.status = GameStatus.FINISHED;
        return;
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (this.board[0][i] && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
        this.winner = this.board[0][i];
        this.status = GameStatus.FINISHED;
        return;
      }
    }

    // Check diagonals
    if (this.board[0][0] && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
      this.winner = this.board[0][0];
      this.status = GameStatus.FINISHED;
      return;
    }

    if (this.board[0][2] && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
      this.winner = this.board[0][2];
      this.status = GameStatus.FINISHED;
      return;
    }

    // Check for draw
    if (this.moves.length === 9) {
      this.status = GameStatus.DRAW;
    }
  }

  getBoard(): (Player | null)[][] {
    return this.board.map(row => [...row]);
  }

  getWinner(): Player | null {
    return this.winner;
  }

  getMoves(): { player: Player; position: Position }[] {
    return [...this.moves];
  }

  toJSON() {
    return {
      id: this.id,
      playerXId: this.playerXId,
      playerOId: this.playerOId,
      status: this.status,
      currentPlayer: this.currentPlayer,
      board: this.getBoard(),
      winner: this.winner,
      moves: this.getMoves(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}