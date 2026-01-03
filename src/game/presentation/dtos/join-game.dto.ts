import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinGameDto {
  @ApiProperty({ description: 'ID of the player joining the game (Player O)' })
  @IsString()
  @IsNotEmpty()
  playerId: string;
}