import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GameStatus } from '../../../../domain/enums/game-status.enum';
import { Player } from '../../../../domain/enums/player.enum';

@Entity('games')
export class GameEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  playerXId: string;

  @Column({ nullable: true })
  playerOId: string;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING,
  })
  status: GameStatus;

  @Column({
    type: 'enum',
    enum: Player,
    default: Player.X,
  })
  currentPlayer: Player;

  @Column('jsonb', { default: [[null, null, null], [null, null, null], [null, null, null]] })
  board: (Player | null)[][];

  @Column('jsonb', { default: [] })
  moves: Array<{ player: Player; row: number; col: number }>;

  @Column({ nullable: true })
  winner: Player;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}