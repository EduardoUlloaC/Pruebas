import {
    IsString, MinLength
} from "class-validator";
import { CreateProductDto } from "./create-product.dto";
import { Type } from "class-transformer";

export class CreateImageDto {
    @IsString()
    @MinLength(1)
    url: string;

    @IsString()
    @Type(()=> CreateProductDto)
    product: CreateProductDto;
}
