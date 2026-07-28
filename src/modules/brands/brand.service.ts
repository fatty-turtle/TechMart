import { Injectable } from '@nestjs/common';
import { BrandRepository } from '@/database/repositories';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepository) {}
}
