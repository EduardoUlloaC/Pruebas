import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, ValidateNested } from "class-validator";

import { CreateSaleProductDto } from "./create-sale-product.dto";
import { StatusSale } from "src/sales/domain/interfaces/status-sale";

export class CreateSaleDto {
    @IsEnum(StatusSale)
    statusSale: StatusSale;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({each:true})
    @Type(()=> CreateSaleProductDto)
    salesProducts: CreateSaleProductDto[];
}
