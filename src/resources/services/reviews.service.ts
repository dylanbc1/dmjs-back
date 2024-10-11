import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { Product } from '../../products/entities/products.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const { product_id, user_id, ...content } = createReviewDto;
    const product = await this.productRepository.findOneBy({ id: product_id });

    if (!product) {
      throw new NotFoundException(`Product with ID "${product_id}" not found`);
    }

    const user = await this.userRepository.findOneBy({ id: user_id });
    
    if (!user) {
      throw new NotFoundException(`User with ID "${user_id}" not found`);
    }
    
    const review = this.reviewRepository.create(createReviewDto);
    review.product = product;
    review.customer = user;
    
    await this.reviewRepository.save(review);

    return  review
    
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ 
      relations: ['product', 'customer'] });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id }, 
      relations: ['product', 'customer'] });
    if (!review) {
      throw new NotFoundException(`Review with ID "${id}" not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.preload({ id, ...updateReviewDto });
    if (!review) {
      throw new NotFoundException(`Review with ID "${id}" not found`);
    }
    return this.reviewRepository.save(review);
  }

  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }
}
