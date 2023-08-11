import {
    Entity,
    PrimaryGeneratedColumn, 
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany, 
} from "typeorm";
import { SaleProduct } from "./sales-products.entity";
import { User } from "src/auth/infraestructure/entities/user.entity";
import { StatusSale } from "src/sales/domain/interfaces/status-sale";


@Entity({
    name: 'tblSales'
})
export class Sale {
    @PrimaryGeneratedColumn('uuid', {
        name: 'Sale_strId'
    })
    id: string;

    @CreateDateColumn({
        name: 'Sale_tmtCreated',
    })
    created: Date;

    @UpdateDateColumn({
        name: 'Sale_tmtUpdated'
    })
    updated: Date;

    @Column('int', {
        name: 'Sale_intTotalUnits'
    })
    totalUnits: number;

    @Column('float', {
        name: 'Sale_floTotalSales',
        default: 0
    })
    totalSales: number;

    @Column('float', {
        name: 'Sale_floTotalPuchase',
        default: 0
    })
    totalPuchase: number;

    @Column('enum', {
        name: 'Sale_enumStatus',
        enum: StatusSale,
    })
    status: StatusSale;

    @OneToMany(
        () => SaleProduct,
        (saleProduct) => saleProduct.sale,
        { cascade: true, eager: true }
    )
    saleProduct: SaleProduct[];

    @ManyToOne(
        () => User,
        (user) => user.sale,
    )
    @JoinColumn({
        name: "User_strId"
    })
    user: User;
}
