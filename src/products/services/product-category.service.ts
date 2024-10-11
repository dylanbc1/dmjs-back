import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from '../entities/product-category.entity';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';

@Injectable()
export class ProductCategoryService {

  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>
  ) {}

  async create(product_category_dto: CreateProductCategoryDto) {
    const category = await this.productCategoryRepository.create(product_category_dto);
    this.productCategoryRepository.save(category);
    return category
  }

  async find() {
    return await this.productCategoryRepository.find({
      relations: ['products']
    });
  }

  async findOne(id: string): Promise<ProductCategory> {
    const productCat = await this.productCategoryRepository.findOne({ where: { id: id },
      relations: ['products']
    });
    if (!productCat) throw new NotFoundException(`Product Category with id ${id} doesn't exist`);
    return productCat;
  }

  async remove(id: string): Promise<void> {
    const productCat = await this.findOne(id);
    await this.productCategoryRepository.remove(productCat);
  }
}
