import {
    Column, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn
} from "typeorm";
import { Product } from "./product.entity";

@Entity({
    name: 'tblImages'
})
export class Image {
    @PrimaryGeneratedColumn('uuid', {
        name: 'Image_strId'
    })
    id: string;

    @Column('text', {
        name: 'Image_strUrs'
    })
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        {onDelete:'CASCADE'}
    )
    @JoinColumn({
        name: 'Product_strId'
    })
    product: Product;
}
