import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Product } from './infraestructure/entities/product.entity';
import { Image } from './infraestructure/entities/image.entity';

import { ProductsController } from './application/controllers/products.controller';
import { ProductsService } from './domain/service/products.service';

import { AuthModule } from 'src/auth/auth.module';
import { ProductRepository } from './infraestructure/repositories/product.repository';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, Image, ProductRepository]),
    ConfigModule,
    AuthModule,
  ],
  exports: [
    ProductsService,
    TypeOrmModule,
  ]
})
export class ProductsModule {}
