import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Comment } from './entities/comment.entity';
import { Product } from '../products/entities/products.entity';
import { User } from '../users/entities/user.entity';
import { ReviewsService } from './services/reviews.service';
import { CommentsService } from './services/comments.service';
import { ReviewsController } from './controllers/reviews.controller';
import { CommentsController } from './controllers/comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Comment, Product, User])],
  providers: [ReviewsService, CommentsService],
  controllers: [ReviewsController, CommentsController],
  exports: [ResourcesModule, TypeOrmModule],
})
export class ResourcesModule {}
