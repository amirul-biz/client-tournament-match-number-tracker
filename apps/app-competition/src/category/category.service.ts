import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../tournament/infrastructure/database';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from '@app-competition/prisma';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    await this.findOne(id); // Check if exists
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.prisma.category.delete({ where: { id } });
  }
}
