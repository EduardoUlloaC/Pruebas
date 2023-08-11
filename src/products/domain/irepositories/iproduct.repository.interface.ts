import { Product } from "src/products/infraestructure/entities/product.entity";
import { IProduct } from "../ientities/iproduct.entity.interface";

import { IUser } from "src/auth/domain/ientities/iuser.entity.interface";

import { CreateProductDto } from "src/products/application/dto/create-product.dto";
import { UpdateProductDto } from "src/products/application/dto/update-product.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SearchFilters } from "src/common/dtos/searchFilters.dto";

export interface IProductRepository {
    createProduct(createProductDto: CreateProductDto, user: IUser): Promise<IProduct>;
    findAllProduct(paginationDto: PaginationDto): Promise<IProduct[]>;
    searchProduct(searchFilters: SearchFilters): Promise<IProduct[]>;
    findOnePlainProduct(term: string): Promise<IProduct>;
    updateProduct(id: string, updateProductDto: UpdateProductDto, user: IUser): Promise<IProduct>;
    saleStockProduct(id: string, product: Product);
    removeProduct(id: string);
    deleteAllProduct(): Promise<any>;
}