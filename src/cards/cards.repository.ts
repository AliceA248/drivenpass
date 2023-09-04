import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um novo cartão de crédito no banco de dados.
  async create(data: Prisma.CreditCardCreateInput) {
    return await this.prisma.creditCard.create({
      data,
    });
  }

  // Encontra todos os cartões de crédito com base nas condições fornecidas.
  async findAll(where: Prisma.CreditCardWhereInput) {
    return await this.prisma.creditCard.findMany({
      where,
    });
  }

  // Encontra um único cartão de crédito com base nas condições fornecidas.
  async findOne(where: Prisma.CreditCardWhereInput) {
    return await this.prisma.creditCard.findFirst({
      where,
    });
  }

  // Remove um cartão de crédito com base no ID.
  async remove(id: number) {
    return await this.prisma.creditCard.delete({
      where: {
        id,
      },
    });
  }
}
