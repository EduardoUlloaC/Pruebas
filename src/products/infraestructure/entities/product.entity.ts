import {
    BeforeInsert, Column, Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { randomInt } from "crypto";

import { Image } from "./image.entity";
import { SaleProduct } from "src/sales/infraestructure/entities/sales-products.entity";
import { IUser } from "src/auth/domain/ientities/iuser.entity.interface";
import { User } from "src/auth/infraestructure/entities/user.entity";
// import { SaleProduct } from "src/sales/infraestructure/entities";

@Entity({
    name: 'tblProducts'
})
export class Product {
    @PrimaryGeneratedColumn('uuid', {
        name: 'Product_strId'
    })
    id: string;

    @Column('text', {
        name: 'Product_strName',
        unique: true,
    })
    name: string;

    @Column('text', {
        name: 'Product_strKey',
        unique: true,
    })
    key: string;

    @Column('text', {
        name: 'Product_strDescription',
        nullable: true
    })
    description: string;

    @Column('float', {
        name: 'Product_floSalePrice',
        default: 0
    })
    salePrice: number;

    @Column('float', {
        name: 'Product_floPuchasePrice',
        default: 0
    })
    puchasePrice: number;

    @Column('int', {
        name: 'Product_intStock',
        default: 0
    })
    stock: number;

    @Column('text', {
        name: 'Product_arrStrSizes',
        array: true
    })
    sizes: string[];

    @Column('text', {
        name: 'Product_strGender'
    })
    gender: string;

    @Column('text', {
        name: 'Product_arrStrTags',
        array: true,
        default: []
    })
    tags: string[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager: true}
    )
    @JoinColumn({
        name: 'User_strId'
    })
    user: IUser;

    @OneToMany(
        () => Image,
        (image) => image.product,
        { cascade: true, eager: true }
    )
    images?: Image[];

    @OneToMany(
        () => SaleProduct,
        (saleProduct) => saleProduct.product,
    )
    saleProduct?: SaleProduct[];

    @BeforeInsert()
    checkKeyInsert() {
        if (!this.key) {
            this.key = randomInt(1000000000, 9999999999).toString();
        }
    }
}
