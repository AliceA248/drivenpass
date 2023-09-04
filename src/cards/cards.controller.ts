import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, HttpStatus, NotFoundException } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create.card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card for the user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Card created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Card already exists for this user.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data. Please check the request body.',
  })
  @ApiBody({
    description: 'Receive card data to create a new card',
    type: CreateCardDto,
  })
  create(@Body() createCardDto: CreateCardDto, @User() user: JWTPayload) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards for the user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all cards for the specified user.',
  })
  findAll(@User('id') id: number) {
    return this.cardsService.findAll(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by card id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the card with the specified id.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card not found. Please verify the card id.',
  })
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id', ParseIntPipe) paramId: number, @User('id') userId: number) {
    const card = await this.cardsService.findOne(paramId, userId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card by card id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card not found. Please verify the card id.',
  })
  @ApiParam({ name: 'id', example: 1 })
  async remove(@Param('id', ParseIntPipe) paramId: number, @User('id') userId: number) {
    const card = await this.cardsService.findOne(paramId, userId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return this.cardsService.remove(paramId, userId);
  }
}
