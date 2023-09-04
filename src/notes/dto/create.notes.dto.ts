import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Important Meeting',
    description: 'A concise title for the note.',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Discuss project milestones and deadlines.',
    description: 'A detailed description of the note content.',
  })
  description: string;
}

