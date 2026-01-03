import { Injectable, Inject } from '@nestjs/common';
import { Game } from '../../domain/entities/game.entity';
import type { GameRepositoryPort } from '../ports/game-repository.port';
import type { WebSocketGatewayPort } from '../ports/websocket-gateway.port';
import { Position } from '../../domain/value-objects/position.value-object';
import { GameStatus } from '../../domain/enums/game-status.enum';

@Injectable()
export class GameService {
  constructor(
    @Inject('GameRepositoryPort')
    private readonly gameRepository: GameRepositoryPort,
    @Inject('WebSocketGatewayPort')
    private readonly websocketGateway: WebSocketGatewayPort,
  ) {}

  async createGame(playerXId: string): Promise<Game> {
    const game = Game.create(playerXId);
    await this.gameRepository.save(game);
    
    this.websocketGateway.emitToUser(
      playerXId,
      'game_created',
      game.toJSON(),
    );
    
    return game;
  }

  async joinGame(gameId: string, playerOId: string): Promise<Game> {
    const game = await this.gameRepository.findById(gameId);
    
    if (!game) {
      throw new Error('Game not found');
    }

    game.joinGame(playerOId);
    await this.gameRepository.update(game);

    this.websocketGateway.emitToRoom(
      game.id,
      'player_joined',
      {
        game: game.toJSON(),
        playerOId,
      },
    );

    return game;
  }

  async makeMove(gameId: string, playerId: string, row: number, col: number): Promise<Game> {
    const game = await this.gameRepository.findById(gameId);
    
    if (!game) {
      throw new Error('Game not found');
    }

    const position = new Position(row, col);
    game.makeMove(playerId, position);
    
    await this.gameRepository.update(game);

    const gameData = game.toJSON();
    
    this.websocketGateway.emitToRoom(
      game.id,
      'move_made',
      {
        game: gameData,
        move: { playerId, row, col },
      },
    );

    if (game.status === GameStatus.FINISHED || game.status === GameStatus.DRAW) {
      this.websocketGateway.emitToRoom(
        game.id,
        'game_finished',
        gameData,
      );
    }

    return game;
  }

  async getGame(gameId: string): Promise<Game> {
    const game = await this.gameRepository.findById(gameId);
    
    if (!game) {
      throw new Error('Game not found');
    }
    
    return game;
  }

  async listWaitingGames(): Promise<Game[]> {
    return this.gameRepository.findWaitingGames();
  }

  async getUserGames(userId: string): Promise<Game[]> {
    return this.gameRepository.findByPlayerId(userId);
  }
}
