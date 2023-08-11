export interface IProduct {
    id: string;
    name: string;
    key: string;
    description: string;
    salePrice: number;
    puchasePrice: number;
    stock: number;
    sizes: string[];
    gender: string;
    tags: string[];
    images: string[];
}