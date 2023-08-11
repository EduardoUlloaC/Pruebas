import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Validate } from "class-validator";
import { Discount } from "src/sales/domain/interfaces/discount";

export class CreateSaleProductDto {
    @IsString()
    @IsUUID()
    productId: string;

    @IsString()
    @IsOptional()
    key?: string;
    
    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsString()
    size: string;

    @IsEnum(Discount)
    @IsOptional()
    discount?: Discount;
}
