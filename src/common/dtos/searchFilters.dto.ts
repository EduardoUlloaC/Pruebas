import { PartialType } from "@nestjs/mapped-types";

import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsOptional, IsPositive, IsString } from "class-validator";

import { PaginationDto } from "./pagination.dto";

export class SearchFilters extends PartialType(PaginationDto) {
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    key?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsBoolean()
    range?: boolean;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    min?: number;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    max?: number;

    @IsOptional()
    @IsString()
    @IsIn(['name', 'price'])
    orderBy?: string;

    @IsOptional()
    @IsString()
    @IsIn(["asc", "desc"])
    order?: string;
}