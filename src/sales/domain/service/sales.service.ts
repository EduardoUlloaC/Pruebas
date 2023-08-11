import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/auth/infraestructure/entities/user.entity';
import { Sale } from 'src/sales/infraestructure/entities/sale.entity';

import { ISaleRepository } from '../irepositories/isale.repository.interface';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateSaleDto } from 'src/sales/application/dto/create-sale.dto';
import { UpdateSaleDto } from 'src/sales/application/dto/update-sale.dto';

@Injectable()
export class SalesService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Sale)
    private readonly repository: ISaleRepository,
  ) { }

  // TODO: validar con los usarios, y acomodar el Repository 
  // como por ejemplo sacar el formateTicket al service
  async create(createSaleDto: CreateSaleDto) {
    return await this.repository.createSale(createSaleDto);
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.repository.findAllSale(paginationDto);
  }

  async findOne(term: string, user: User) {
    return await this.repository.findOneSale(term, user);
  }

  // TODO: acomodar para actualizar la informacion, y hacer el cambio de estatus, para efectuar los cambios en el stock 
  async update(id: string, updateSaleDto: UpdateSaleDto, user: User) {
    return await this.repository.updateSale(id, updateSaleDto, user);
  }

  async remove(id: string) {
    return await this.repository.removeSale(id);
  }

  // TODO: ajustar para cambiar el formato y revisar esto mismo para los productossu
  private formatTicket(sales: Array<Sale>) {
    return sales.map((sale) => {
      delete sale.updated;
      const newSaleProduct = sale.saleProduct.map((saleProd) => ({
        product: saleProd.product.name,
        description: saleProd.product.description,
        size: saleProd.size,
        quantity: saleProd.quantity,
        unitPrice: saleProd.product.salePrice,
        subtotal: (saleProd.product.salePrice * saleProd.quantity) - (saleProd.product.salePrice * saleProd.quantity) / 10,
        discount: saleProd.discount,
      }));
      return {
        ...sale,
        saleProduct: newSaleProduct,
      }
    });
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
