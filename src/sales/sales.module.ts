import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SalesService } from './domain/service/sales.service';
import { SalesController } from './application/controllers/sales.controller';

import { ProductsModule } from 'src/products/products.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

import { Sale } from './infraestructure/entities/sale.entity';
import { SaleProduct } from './infraestructure/entities/sales-products.entity';
import { saleRepository } from './infraestructure/repositories/sale.repository';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [
    TypeOrmModule.forFeature([Sale, SaleProduct, saleRepository]),
    ConfigModule,
    ProductsModule,
    AuthModule,
  ],
  exports: [
    SalesService,
    TypeOrmModule,
  ]
})
export class SalesModule { }
