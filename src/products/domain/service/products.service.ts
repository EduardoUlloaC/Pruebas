import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from 'src/products/infraestructure/entities/product.entity';
import { ProductRepository } from 'src/products/infraestructure/repositories/product.repository';
import { IProductRepository } from '../irepositories/iproduct.repository.interface';

import { IUser } from 'src/auth/domain/ientities/iuser.entity.interface';

import { CreateProductDto } from 'src/products/application/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/application/dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchFilters } from 'src/common/dtos/searchFilters.dto';
import { IProduct } from '../ientities/iproduct.entity.interface';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(ProductRepository)
    private readonly repository: ProductRepository,
  ) { }

  async create(createProductDto: CreateProductDto, user: IUser) {
    return await this.repository.createProduct(createProductDto, user);
  }

  async findAll(paginationDto: PaginationDto): Promise<IProduct[]> {
    return await this.repository.findAllProduct(paginationDto);
  }

  async search(searchFilters: SearchFilters) {
    return await this.repository.searchProduct(searchFilters);
  }

  async findOnePlain(term: string) {
    return await this.repository.findOnePlainProduct(term);
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    return await this.repository.updateProduct(id, updateProductDto, user);
  }

  async saleStock(id: string, product: Product) {
    await this.repository.saleStockProduct(id, product)
  }

  async remove(id: string) {
    await this.repository.removeProduct(id);
  }

  async deleteAll(): Promise<any> {
    try{
      return await this.repository.deleteAllProduct();
    }catch(error){
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
        throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
}
}
