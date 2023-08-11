import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";

import { User } from "src/auth/infraestructure/entities/user.entity";
import { Sale } from "../entities/sale.entity";
// import { Sale } from "../entities";

import { ISaleRepository } from "src/sales/domain/irepositories/isale.repository.interface";
import { ISale } from "src/sales/domain/ientities/isale.respository.interface";

import { ProductRepository } from "src/products/infraestructure/repositories/product.repository";
import { SaleProductRepository } from "./saleProduct.repository";

// import { PaginationDto } from "src/common/dtos";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreateSaleDto } from "src/sales/application/dto/create-sale.dto";
import { UpdateSaleDto } from "src/sales/application/dto/update-sale.dto";

@EntityRepository(Sale)
export class saleRepository extends Repository<Sale> implements ISaleRepository {
    private readonly logger = new Logger('SaleRepository');

    async createSale(createSaleDto: CreateSaleDto): Promise<ISale> {
        const { statusSale, salesProducts } = createSaleDto;
        try {
            let total = 0;
            let puchase = 0;
            let totalunit = 0;
            const sale = this.create({ status: statusSale });
            const productRepository = this.connectProductSaleRepository();
            const saleProductRepository = this.connectSaleProductSaleRepository();
            sale.saleProduct = await Promise.all(salesProducts.map(
                async saleProduct => {
                    let prod;
                    if (saleProduct.productId) {
                        prod = await productRepository.findOnePlainProduct(saleProduct.productId);
                    } else {
                        prod = await productRepository.findOnePlainProduct(saleProduct.key);
                    }
                    delete prod.user;
                    const saleProd = saleProductRepository.create({
                        size: saleProduct.size,
                        product: prod
                    });
                    if (prod.stock >= saleProduct.quantity) {
                        saleProd.quantity = saleProduct.quantity;
                        puchase = prod.puchasePrice * saleProduct.quantity;
                        total = prod.salePrice * saleProduct.quantity;
                        if (statusSale === 'buy') {
                            prod.stock = prod.stock - saleProduct.quantity;
                            productRepository.saleStockProduct(prod.id, prod);
                        }
                    } else {
                        saleProd.quantity = prod.stock;
                        puchase = prod.puchasePrice * prod.stock;
                        total = prod.salePrice * prod.stock;
                        if (statusSale === 'buy') {
                            prod.stock = 0;
                            await productRepository.saleStockProduct(prod.id, prod);
                        }
                    }
                    if (saleProduct.discount) {
                        saleProd.discount = saleProduct.discount;
                        total = total - total / saleProduct.discount;
                    }
                    totalunit += saleProd.quantity;
                    return saleProd;
                }
            ));
            sale.totalUnits = totalunit;
            sale.totalPuchase = puchase;
            sale.totalSales = total;

            await this.save(sale);
            delete sale.totalPuchase;
            // TODO: cambiar al findOnePlane
            return this.formatTicket([sale]).pop();
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }
    async findAllSale(paginationDto: PaginationDto): Promise<ISale[]> {
        const { limit = 10, offset = 0 } = paginationDto;
        const sales = await this.find({
            take: limit,
            skip: offset,
            relations: ['saleProduct', 'saleProduct.product'],
        });
        return this.formatTicket(sales);
    }

    async findOneSale(term: string, user: User): Promise<ISale> {
        const sale = await this.find({
            relations: ['saleProduct', 'saleProduct.product'],
            where: { id: term }
        });
        const data = this.formatTicket(sale).pop();
        // TODO: revisar si existe el campo totalPuchase
        // if (!user.roles.includes('admin'))
        //     delete data.totalPuchase;
        return data;
    }

    async updateSale(id: string, updateSaleDto: UpdateSaleDto, user: User): Promise<ISale> {
        const { statusSale, salesProducts } = updateSaleDto;

        try {
            let total = 0;
            let puchase = 0;
            let totalunit = 0;
            const sale = await this.preload({ id, status: statusSale });
            if (salesProducts) {
                const productRepository = await this.connectProductSaleRepository();

                const saleProductRepository = this.connectSaleProductSaleRepository();
                const querySalesProduct = await saleProductRepository.createQueryBuilder('saleProduct');
                await querySalesProduct.delete().where({ id }).execute();

                sale.saleProduct = await Promise.all(salesProducts.map(
                    async saleProduct => {
                        let prod;
                        if (saleProduct.productId) {
                            prod = await productRepository.findOnePlainProduct(saleProduct.productId);
                        } else {
                            prod = await productRepository.findOnePlainProduct(saleProduct.key);
                        }
                        delete prod.user;
                        const saleProd = saleProductRepository.create({ product: prod });
                        if (prod.stock >= saleProduct.quantity) {
                            // TODO: Descontar la cantidad de productos del stock si cambio el status
                            saleProd.quantity = saleProduct.quantity;
                            puchase = prod.puchasePrice * saleProduct.quantity;
                            total = prod.salePrice * saleProduct.quantity;
                            if (statusSale === 'buy') {
                                prod.stock = prod.stock - saleProduct.quantity;
                                await productRepository.saleStockProduct(prod.id, prod);
                            }
                        } else {
                            saleProd.quantity = prod.stock;
                            puchase = prod.puchasePrice * prod.stock;
                            total = prod.salePrice * prod.stock;
                            if (statusSale === 'buy') {
                                prod.stock = 0;
                                await productRepository.saleStockProduct(prod.id, prod);
                            }
                        }
                        if (saleProduct.discount) {
                            saleProd.discount = saleProduct.discount;
                            total = total - total / saleProduct.discount;
                        }
                        totalunit += saleProd.quantity;
                        return saleProd;
                    }
                ));
            }
            sale.totalUnits = totalunit;
            sale.totalPuchase = puchase;
            sale.totalSales = total;

            await this.save(sale);
            return this.formatTicket([sale]).pop();
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    // TODO: modificar el codigo para obtener un findOnePlane
    async removeSale(id: string) {
        const sale = await this.findOneBy({ id });
        return this.remove(sale);
    }

    private formatTicket(sales: Array<Sale>): ISale[] {
        return sales.map((sale) => {
            const newSaleProduct = sale.saleProduct.map((saleProd) => ({
                product: saleProd.product.name,
                description: saleProd.product.description,
                size: saleProd.size,
                unitPrice: saleProd.product.salePrice,
                quantity: saleProd.quantity,
                discount: saleProd.discount,
                subtotal: (saleProd.product.salePrice * saleProd.quantity) - (saleProd.product.salePrice * saleProd.quantity) / 10,
            }));
            delete sale.updated;
            return {
                ...sale,
                saleProduct: newSaleProduct,
            }
        });
    }

    private connectSaleProductSaleRepository(): SaleProductRepository {
        return this.manager.getCustomRepository(SaleProductRepository);
    }

    private connectProductSaleRepository(): ProductRepository {
        return this.manager.getCustomRepository(ProductRepository);
    }

    private handleDBExceptions(error: any) {
        if (error.code === '23505')
            throw new BadRequestException(error.detail);

        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }
}