import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './presentation/controllers/game.controller';
import { GameService } from './application/services/game.service';
import { GameGateway } from './infrastructure/websocket/game.gateway';
import { TypeOrmGameRepository } from './infrastructure/persistence/typeorm/repositories/game.repository';
import { GameEntity } from './infrastructure/persistence/typeorm/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity])],
  controllers: [GameController],
  providers: [
    GameService,
    GameGateway,
    {
      provide: 'GameRepositoryPort',
      useClass: TypeOrmGameRepository,
    },
    {
      provide: 'WebSocketGatewayPort',
      useExisting: GameGateway,
    },
  ],
  exports: [GameService],
})
export class GameModule {}