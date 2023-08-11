import {
  Controller, Get, Post,
  Body, Patch, Param,
  Delete, ParseUUIDPipe, Query
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { Auth } from 'src/auth/application/decorators/auth.decorator';
import { GetUser } from 'src/auth/application/decorators/get-user.decorator';
import { ValidRoles } from 'src/auth/domain/interfaces/valid-roles';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchFilters } from 'src/common/dtos/searchFilters.dto';
import { ProductsService } from 'src/products/domain/service/products.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { IUser } from 'src/auth/domain/ientities/iuser.entity.interface';
import { IProduct } from 'src/products/domain/ientities/iproduct.entity.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @Auth(ValidRoles.admin)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: IUser,
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<IProduct[]> {
    return this.productsService.findAll(paginationDto);
  }

  @Get('search')
  search(
    @Query() searchFilters: SearchFilters,
  ) {
    return this.productsService.search(searchFilters);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: IUser,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
