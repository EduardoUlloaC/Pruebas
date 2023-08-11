import {
    BadRequestException,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";

import { validate as isUUID } from 'uuid';

import { User } from "src/auth/infraestructure/entities/user.entity";
import { Product } from "../entities/product.entity";

import { IProduct } from "src/products/domain/ientities/iproduct.entity.interface";

import { IProductRepository } from "src/products/domain/irepositories/iproduct.repository.interface";
import { ImageRepository } from "./image.repository";

import { CreateProductDto } from "src/products/application/dto/create-product.dto";
import { UpdateProductDto } from "src/products/application/dto/update-product.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SearchFilters } from "src/common/dtos/searchFilters.dto";
import { IUser } from "src/auth/domain/ientities/iuser.entity.interface";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product>  {
    private readonly logger = new Logger('ProductRepository');

    async createProduct(createProductDto: CreateProductDto, user: IUser): Promise<IProduct> {
        try {
            const { images = [], ...productDetails } = createProductDto;
            const imageRepository = this.connectImageProductRepository();
            const product = this.create({
                ...productDetails,
                images: images.map(image => imageRepository.create({ url: image })),
                user,
            });
            await this.save(product);
            return { ...product, images };
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findAllProduct(paginationDto: PaginationDto): Promise<IProduct[]> {
        const { limit = 10, offset = 0 } = paginationDto;

        const products = await this.find({
            take: limit,
            skip: offset,
            relations: {
                images: true
            }
        });
        return products.map((product) => ({
            ...product,
            images: product.images.map(img => img.url),
        }));
    }

    async searchProduct(searchFilters: SearchFilters): Promise<IProduct[]> {
        const {
            key, name,
            min, max,
            orderBy, order,
            limit = 10,
            offset = 0
        } = searchFilters;

        try {

            let queryBuilder = this.createQueryBuilder('products');
            if (key || name) {
                queryBuilder = queryBuilder
                    .where(`products.Product_strKey LIKE :key OR UPPER(products.Product_strName) LIKE :name`, {
                        key: +key,
                        name: '%' + name.toUpperCase() + '%'
                    });
            }
            if (min) {
                queryBuilder = queryBuilder.andWhere(`products.Product_floSalePrice >= :min`, {
                    min: +min
                })
            }
            if (max) {
                queryBuilder = queryBuilder.andWhere(`products.Product_floSalePrice <= :max`, {
                    max: +max
                })
            }
            if (orderBy) {
                let orderColumn: string;
                if (orderBy === 'name') {
                    orderColumn = 'products.Product_strName';

                } else if (orderBy === 'price') {
                    orderColumn = 'products.Product_floSalePrice';
                }
                if (order === 'asc') {
                    queryBuilder = queryBuilder.orderBy(orderColumn, 'ASC')
                } else {
                    queryBuilder = queryBuilder.orderBy(orderColumn, 'DESC')
                }
            }
            if (limit) {
                queryBuilder = queryBuilder.take(limit);
            }
            if (offset) {
                queryBuilder = queryBuilder.skip(offset);
            }
            const products = await queryBuilder
                .leftJoinAndSelect('products.images', 'image')
                .getMany();
            return products.map((product) => ({
                ...product,
                images: product.images.map(img => img.url),
            }));
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findOneProduct(term: string) {
        let product: Product;
        if (isUUID(term)) {
            product = await this.findOneBy({ id: term });
        } else {
            const queryBuilder = this.createQueryBuilder('prod');
            product = await queryBuilder
                .where(`UPPER(prod.Product_strName) =:name OR prod.key =:key`, {
                    name: term.toLocaleUpperCase(),
                    key: +term,
                })
                .leftJoinAndSelect('prod.images', 'prodImages')
                .getOne();
        }
        if (!product)
            throw new NotFoundException(`Product with ${term} not found`);
        return product;
    }

    async findOnePlainProduct(term: string): Promise<IProduct> {
        const { images = [], ...rest } = await this.findOneProduct(term);
        return {
            ...rest,
            images: images.map(image => image.url),
        };
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto, user: IUser): Promise<IProduct> {
        const { images, ...toUpdate } = updateProductDto;

        const product = await this.preload({
            id,
            ...toUpdate,
        });
        if (!product)
            throw new NotFoundException(`Product with id: ${id} not found`);

        try {
            if (images) {
                const imageRepository = this.connectImageProductRepository();
                const queryImage = await imageRepository.createQueryBuilder('image');
                await queryImage.delete().where({}).execute();
                product.images = images.map(
                    image => imageRepository.create({ url: image })
                );
            }
            product.user = user;
            await this.save(product);
            return this.findOnePlainProduct(id);
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async saleStockProduct(id: string, product: Product) {
        const update = await this.preload({ id, ...product });
        await this.save(update);
    }

    async removeProduct(id: string) {
        const product = await this.findOneProduct(id);
        await this.remove(product);
    }

    async deleteAllProduct(): Promise<any> {
        const query = this.createQueryBuilder('product');
        try {
            return await query
                .delete()
                .where({})
                .execute();
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    private connectImageProductRepository(): ImageRepository {
        return this.manager.getCustomRepository(ImageRepository);
    }

    private handleDBExceptions(error: any) {
        if (error.code === '23505')
            throw new BadRequestException(error.detail);

        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }
}