import { Product } from "src/products/infraestructure/entities/product.entity";
import { Sale } from "src/sales/infraestructure/entities/sale.entity";
// import { Sale } from "src/sales/infraestructure/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'tblUsers'
})
export class User {
    @PrimaryGeneratedColumn('uuid',{
        name: 'User_strId'
    })
    id:string;

    @Column('text',{
        name: 'User_strEmail',
        unique: true,
    })
    email: string;

    @Column('text',{
        name: 'User_strPassword',
        select: false
    })
    password: string;

    @Column('text',{
        name: 'User_strFullname'
    })
    fullName: string;

    @Column('bool',{
        name: 'User_isActive',
        default: true
    })
    isActive: boolean;

    @Column('text',{
        name: 'User_strRoles',
        array: true,
        default: ['client'],
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user,
    )
    @JoinColumn({
        name: 'Product_strId'
    })
    product: Product;
    
    @OneToMany(
        () => Sale,
        (sale) => sale.user,
    )
    @JoinColumn({
        name: 'Product_strId'
    })
    sale: Sale;

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }
}
