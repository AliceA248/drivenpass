import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCardDto } from './dto/create.card.dto';
import { CardsRepository } from './cards.repository';
import { JWTPayload } from '../users/auth/auth.service';
import { exclude } from '../utils/prisma.utils';
import { CreditCard } from '@prisma/client';
import Cryptr from 'cryptr';

@Injectable()
export class CardsService {
  private cryptr: Cryptr;

  constructor(private readonly cardsRepository: CardsRepository) {
    this.cryptr = new Cryptr(process.env.SECRET);
  }

  async create(createCardDto: CreateCardDto, user: JWTPayload) {
    try {
      const encryptedPassword = this.cryptr.encrypt(createCardDto.password);
      const expirationDate = new Date(createCardDto.expirationDate);

      const card = await this.cardsRepository.create({
        ...createCardDto,
        password: encryptedPassword,
        expirationDate,
        Author: {
          connect: {
            id: user.id,
          },
        },
      });

      return exclude(card, 'createdAt', 'updatedAt', 'password');
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Card already exists for this user.');
      }
      throw new Error('Failed to create card. Please check the provided data.');
    }
  }

  async findOne(id: number, userId: number) {
    const card = await this.cardsRepository.findOne({ id });

    this.validateCard(card, userId);

    if (!card) {
      throw new NotFoundException('Card not found.');
    }

    return {
      ...card,
      password: this.cryptr.decrypt(card.password),
    };
  }

  async findAll(userId: number) {
    const cards = await this.cardsRepository.findAll({
      authorId: userId,
    });

    const decryptedCards = cards.map((card) => ({
      ...card,
      password: this.cryptr.decrypt(card.password),
    }));

    return decryptedCards;
  }

  async remove(id: number, userId: number) {
    const card = await this.findOne(id, userId);

    if (!card) {
      throw new NotFoundException('Card not found.');
    }

    const deletedCard = await this.cardsRepository.remove(card.id);

    return exclude(deletedCard, 'password', 'secureCode', 'createdAt', 'updatedAt');
  }

  private validateCard(card: CreditCard, userId: number) {
    if (!card) {
      throw new NotFoundException('Card not found.');
    }

    if (card.authorId !== userId) {
      throw new ForbiddenException('You do not have permission to access this card.');
    }
  }
}
