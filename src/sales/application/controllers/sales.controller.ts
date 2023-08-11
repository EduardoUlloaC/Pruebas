import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { SalesService } from '../../domain/service/sales.service';
import { User } from 'src/auth/infraestructure/entities/user.entity';
import { Auth } from 'src/auth/application/decorators/auth.decorator';
import { GetUser } from 'src/auth/application/decorators/get-user.decorator';
import { ValidRoles } from 'src/auth/domain/interfaces/valid-roles';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post()
  @Auth(ValidRoles.client, ValidRoles.admin)
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAllSales(@Query() paginationDto: PaginationDto) {
    return this.salesService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(ValidRoles.client, ValidRoles.admin)
  findOne(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.salesService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(ValidRoles.client, ValidRoles.admin)
  update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
    @GetUser() user: User,
  ) {
    return this.salesService.update(id, updateSaleDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
