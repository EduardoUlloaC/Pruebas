import { EntityRepository, Repository } from "typeorm";
import { SaleProduct } from "../entities/sales-products.entity";
import { ISaleProductRepository } from "src/sales/domain/irepositories/isaleProduct.repository.interface";
// import { SaleProduct } from "../entities";

@EntityRepository(SaleProduct)
export class SaleProductRepository extends Repository<SaleProduct> implements ISaleProductRepository {

}