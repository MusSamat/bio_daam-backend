import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productsRepository.find({ where: { category } });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }

  async update(id: number, updateData: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, updateData);
    const product: Product | null = await this.productsRepository.findOne({
      where: { id },
    });
    if (product === null) {
      throw new Error('Product not found');
    }
    return product;
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
