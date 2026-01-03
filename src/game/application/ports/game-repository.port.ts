import { Game } from '../../domain/entities/game.entity';

export interface GameRepositoryPort {
  save(game: Game): Promise<Game>;
  findById(id: string): Promise<Game | null>;
  findByPlayerId(playerId: string): Promise<Game[]>;
  findWaitingGames(): Promise<Game[]>;
  update(game: Game): Promise<Game>;
}