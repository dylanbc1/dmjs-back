import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductCategory } from '../entities/product-category.entity';
import { Review } from '../../resources/entities/review.entity';
import { PageOptionsDto } from '../../pagination/page-options.dto';
import { PageDto } from '../../pagination/page.dto';
import { PageMetaDto } from '../../pagination/page-meta.dto';
import { User } from '../../users/entities/user.entity';
import { log } from 'console';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product_category = await this.productCategoryRepository.findOne({
        where: { id: createProductDto.product_category_id }
      });
      if (!product_category) throw new NotFoundException(`Product category not found`);
  
      const seller = await this.userRepository.findOne({
        where: { id: createProductDto.seller_id }
      });
      if (!seller) throw new NotFoundException(`Seller not found`);
  
      const product = this.productsRepository.create(createProductDto);
      product.product_category = product_category;
      product.seller = seller;
      await this.productsRepository.save(product);
  
      return product;
    } catch (error) {
      throw error
    }
  }
  

  async find(pageOptionsDto: PageOptionsDto):Promise<PageDto<Product>>{
    const [data, itemCount] = await this.productsRepository.findAndCount({
      relations: ['reviews', 'seller', 'product_category', 'comments'],
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      order:{
        id: pageOptionsDto.order
      }
    });
    
    const pageMetaDto = new PageMetaDto({pageOptionsDto, itemCount})
    return new PageDto(data, pageMetaDto)
  }

  async findFiltered(filters: any): Promise<Product[]> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    queryBuilder.leftJoinAndSelect('product.reviews', 'reviews');
    queryBuilder.leftJoinAndSelect('product.product_category', 'product_category');

    if (filters.category) {
      queryBuilder.andWhere('product_category.category = :category', { category: filters.category });
    }

    if (filters.priceMin !== undefined) {
      queryBuilder.andWhere('product.price >= :priceMin', { priceMin: filters.priceMin });
    }

    if (filters.priceMax !== undefined) {
      queryBuilder.andWhere('product.price <= :priceMax', { priceMax: filters.priceMax });
    }

    if (filters.search) {
      queryBuilder.andWhere('product.product_name ILIKE :search OR product.description ILIKE :search', { search: `%${filters.search}%` });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id: id }, 
      relations: ['reviews', 'product_category', 'seller', 'comments'] });
    if (!product) throw new NotFoundException(`Product with id ${id} doesn't exist`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.preload({
      id: id,
      ...updateProductDto,
    });
  
    if (!product) throw new NotFoundException(`Product with id ${id} doesn't exist`);
  
    try {
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      throw error
    }
  }

  async calculateTotalScore(id: string): Promise<number> {
    const reviews: Review[] = (await this.findOne(id)).reviews;
    
    let score: number = 0;
    reviews.forEach((review) => (score += +review.score));

    const amountReviews = reviews.length;
    const result = score / amountReviews
    //console.log(result.toFixed(1))
    return parseFloat(result.toFixed(1));
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
  
  async DecrementQuantity(product_id:string, quantity:number){
    const product = await this.productsRepository.findOne({where:{id:product_id}})

    if(product.quantity > quantity){
      product.quantity = product.quantity - quantity
     
    }else{
      throw new BadRequestException(`There are ${product.quantity} products and you want to rest ${quantity}`)
    }

    await this.productsRepository.save(product)

    return product;
  }

  private handleDBErrors(error: any): never {
    if (error instanceof BadRequestException) {
      throw error;
    }

    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }

  

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
    
}
