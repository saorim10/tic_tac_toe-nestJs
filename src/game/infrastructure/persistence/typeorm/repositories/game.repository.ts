import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../../../domain/entities/game.entity';
import { GameRepositoryPort } from '../../../../application/ports/game-repository.port';
import { GameEntity } from '../entities/game.entity';
import { GameStatus } from '../../../../domain/enums/game-status.enum';
import { Position } from '../../../../domain/value-objects/position.value-object';
import { Player } from '../../../../domain/enums/player.enum';

@Injectable()
export class TypeOrmGameRepository implements GameRepositoryPort {
  constructor(
    @InjectRepository(GameEntity)
    private readonly repository: Repository<GameEntity>,
  ) {}

  async save(game: Game): Promise<Game> {
    const entity = this.toEntity(game);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Game | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByPlayerId(playerId: string): Promise<Game[]> {
    const entities = await this.repository.find({
      where: [{ playerXId: playerId }, { playerOId: playerId }],
      order: { updatedAt: 'DESC' },
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findWaitingGames(): Promise<Game[]> {
    const entities = await this.repository.find({
      where: { status: GameStatus.WAITING },
      order: { createdAt: 'ASC' },
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async update(game: Game): Promise<Game> {
    const entity = this.toEntity(game);
    const updated = await this.repository.save(entity);
    return this.toDomain(updated);
  }

  private toDomain(entity: GameEntity): Game {
    const game = new Game(
      entity.id,
      entity.playerXId,
      entity.playerOId,
      entity.status,
      entity.currentPlayer,
      entity.createdAt,
      entity.updatedAt,
    );

    // Restore board state
    const domainGame = game as any;
    domainGame.board = entity.board;
    
    // Restore moves
    entity.moves.forEach(move => {
      const position = new Position(move.row, move.col);
      domainGame.moves.push({ player: move.player as Player, position });
    });

    // Restore winner
    if (entity.winner) {
      domainGame.winner = entity.winner;
    }

    return game;
  }

  private toEntity(domain: Game): GameEntity {
    const entity = new GameEntity();
    entity.id = domain.id;
    entity.playerXId = domain.playerXId;
    entity.playerOId = domain.playerOId;
    entity.status = domain.status;
    entity.currentPlayer = domain.currentPlayer;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    
    const domainGame = domain as any;
    entity.board = domainGame.getBoard ? domainGame.getBoard() : domainGame.board;
    
    const moves = domainGame.getMoves ? domainGame.getMoves() : domainGame.moves;
    entity.moves = moves.map((move: any) => ({
      player: move.player,
      row: move.position.row,
      col: move.position.col,
    }));
    
    entity.winner = domainGame.getWinner ? domainGame.getWinner() : domainGame.winner;

    return entity;
  }
}