import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { Sale } from "./sale.entity";
// import { Product } from "src/products/infraestructure/entities";
import { Product } from "src/products/infraestructure/entities/product.entity";
import { Discount } from "src/sales/domain/interfaces/discount";

@Entity({
    name: 'tblSales_Products'
})
export class SaleProduct {
    @PrimaryGeneratedColumn('uuid', {
        name: 'Sale_Product_strId'
    })
    id: string;

    @Column('int', {
        name: 'Sale_Product_intQuantity',
    })
    quantity: number;

    @Column('text', {
        name: 'Product_strSizes',
    })
    size: string;

    @Column('enum', {
        name: 'Sale_Product_enumDiscount',
        enum: Discount,
        nullable: true,
    })
    discount: Discount;

    @Column('int',{
        name: 'Sale_Product_intSubTotal'
    })
    subtotal: number;

    @CreateDateColumn({
        name: 'Sale_Product_tmtCreated',
    })
    created: Date;

    @UpdateDateColumn({
        name: 'Sale_Product_tmtUpdated'
    })
    updated: Date;

    @ManyToOne(
        () => Product,
        (product) => product.saleProduct,
    )
    @JoinColumn({
        name: 'Product_uuid_id'
    })
    product: Product;

    @ManyToOne(
        () => Sale,
        (sale) => sale.saleProduct,
    )
    @JoinColumn({
        name: "Sale_uuid_id"
    })
    sale: Sale;
}
