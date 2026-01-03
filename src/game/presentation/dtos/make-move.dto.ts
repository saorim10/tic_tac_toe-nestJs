import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class MakeMoveDto {
  @ApiProperty({ description: 'ID of the player making the move' })
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({ description: 'Row position (0-2)', minimum: 0, maximum: 2 })
  @IsInt()
  @Min(0)
  @Max(2)
  row: number;

  @ApiProperty({ description: 'Column position (0-2)', minimum: 0, maximum: 2 })
  @IsInt()
  @Min(0)
  @Max(2)
  col: number;
}