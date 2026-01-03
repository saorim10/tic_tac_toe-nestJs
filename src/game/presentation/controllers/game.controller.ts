import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GameService } from '../../application/services/game.service';
import { CreateGameDto } from '../dtos/create-game.dto';
import { JoinGameDto } from '../dtos/join-game.dto';
import { MakeMoveDto } from '../dtos/make-move.dto';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: 201, description: 'Game created successfully' })
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto.playerId);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join an existing game' })
  @ApiResponse({ status: 200, description: 'Joined game successfully' })
  async joinGame(
    @Param('id') gameId: string,
    @Body() joinGameDto: JoinGameDto,
  ) {
    return this.gameService.joinGame(gameId, joinGameDto.playerId);
  }

  @Post(':id/move')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Make a move in a game' })
  @ApiResponse({ status: 200, description: 'Move made successfully' })
  async makeMove(
    @Param('id') gameId: string,
    @Body() makeMoveDto: MakeMoveDto,
  ) {
    return this.gameService.makeMove(
      gameId,
      makeMoveDto.playerId,
      makeMoveDto.row,
      makeMoveDto.col,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get game details' })
  @ApiResponse({ status: 200, description: 'Game details retrieved' })
  async getGame(@Param('id') gameId: string) {
    return this.gameService.getGame(gameId);
  }

  @Get()
  @ApiOperation({ summary: 'List waiting games' })
  @ApiResponse({ status: 200, description: 'List of waiting games' })
  async listWaitingGames() {
    return this.gameService.listWaitingGames();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user games' })
  @ApiResponse({ status: 200, description: 'User games retrieved' })
  async getUserGames(@Param('userId') userId: string) {
    return this.gameService.getUserGames(userId);
  }
}