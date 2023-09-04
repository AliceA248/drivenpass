import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Faker Title', description: 'Card title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Card 1', description: 'Card name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '1111-1111-1111-1111', description: 'Card number' })
  number: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '111', description: 'Card secure code' })
  secureCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 's#nhaFoR1e', description: 'Card password' })
  password: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2023-12-02', description: "Card's expiration date" })
  expirationDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true, description: 'If the card is virtual or not' })
  isVirtual: boolean;

  @IsNotEmpty()
  @IsString()
  @IsEnum(CardType)
  @ApiProperty({ enum: CardType, description: 'Card type' })
  type: CardType;
}
