import { Injectable } from '@nestjs/common';

interface PaginationOptions {
  skip?: number;
  take?: number;
}

/**
 * Minimal shape every Prisma model delegate satisfies.
 * Adjust arg/return types if you want stricter typing per-model.
 */
export interface PrismaDelegate<T> {
  create: (args: { data: any }) => Promise<T>;
  findMany: (args?: any) => Promise<T[]>;
  findUnique: (args: { where: any }) => Promise<T | null>;
  update: (args: { where: any; data: any }) => Promise<T>;
  delete: (args: { where: any }) => Promise<T>;
  count: (args?: { where?: any }) => Promise<number>;
}

@Injectable()
export class BaseRepository<
  T,
  D extends PrismaDelegate<T> = PrismaDelegate<T>,
> {
  constructor(protected readonly repository: D) {}

  async create(data: object): Promise<T> {
    return await this.repository.create({ data });
  }

  async findAll(options: PaginationOptions = {}): Promise<T[]> {
    return await this.repository.findMany({
      skip: options.skip,
      take: options.take,
    });
  }

  async findById(id: number | string): Promise<T | null> {
    return await this.repository.findUnique({ where: { id } });
  }

  async findByField(field: string, value: T): Promise<T[]> {
    return await this.repository.findMany({ where: { [field]: value } });
  }

  async findByFields(filters: Record<string, any>): Promise<T[]> {
    return await this.repository.findMany({ where: filters });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: object;
    orderBy?: object;
  }): Promise<T[]> {
    return await this.repository.findMany(params);
  }

  async findUnique(where: object): Promise<T | null> {
    return await this.repository.findUnique({ where });
  }

  async update(where: object, data: object): Promise<T | null> {
    return await this.repository.update({ where, data });
  }

  async delete(where: object): Promise<T> {
    return await this.repository.delete({ where });
  }

  async count(where: object = {}): Promise<number> {
    return await this.repository.count({ where });
  }
}
