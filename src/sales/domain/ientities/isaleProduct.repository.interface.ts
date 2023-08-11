import { IProduct } from "src/products/domain/ientities/iproduct.entity.interface";

export interface ISaleProduct {
    product: string;
    description: string;
    size: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    subtotal: number;
}