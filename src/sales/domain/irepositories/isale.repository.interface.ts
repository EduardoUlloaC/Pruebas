import { User } from "src/auth/infraestructure/entities/user.entity";
import { ISale } from "../ientities/isale.respository.interface";

import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreateSaleDto } from "src/sales/application/dto/create-sale.dto";
import { UpdateSaleDto } from "src/sales/application/dto/update-sale.dto";

export interface ISaleRepository {
    createSale(createSaleDto: CreateSaleDto): Promise<ISale>;
    findAllSale(paginationDto: PaginationDto): Promise<ISale[]>;
    findOneSale(term: string, user: User):  Promise<ISale>;
    updateSale(id: string, updateSaleDto: UpdateSaleDto, user: User): Promise<ISale>;
    removeSale(id: string);
    
}