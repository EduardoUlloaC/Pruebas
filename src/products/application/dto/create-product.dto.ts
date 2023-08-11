import {
    IsArray, IsIn, IsInt,
    IsNumber, IsOptional, IsPositive,
    IsString, Length, MinLength
} from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @Length(10)
    @IsOptional()
    key?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    salePrice?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    puchasePrice?: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @IsString({ each: true})
    @IsArray()
    @IsOptional()
    tags: string[];
    
    @IsString({ each: true})
    @IsArray()
    @IsOptional()
    images?: string[];
}
