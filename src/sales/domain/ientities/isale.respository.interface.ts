import { StatusSale } from "../interfaces/status-sale";
import { ISaleProduct } from "./isaleProduct.repository.interface";

export interface ISale {
    id: string;
    status: StatusSale;
    saleProduct: ISaleProduct[];
    totalSales: number;
    totalUnits: number;
    created: Date;
}