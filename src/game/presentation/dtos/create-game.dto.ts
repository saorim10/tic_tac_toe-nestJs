import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ description: 'ID of the player creating the game (Player X)' })
  @IsString()
  @IsNotEmpty()
  playerId: string;
}