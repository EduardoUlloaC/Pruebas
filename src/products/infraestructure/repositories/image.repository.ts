import { EntityRepository, Repository } from "typeorm";

// import { Image, Product } from "../entities";
import { Image } from "../entities/image.entity";

import { IImageRepository } from "src/products/domain/irepositories/iimage.respostory.interface";
import { CreateImageDto } from "src/products/application/dto/create-image.dto";

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> implements IImageRepository{
    // createImage( createImageDto: CreateImageDto){
    //     const { product , ...detailsImage} = createImageDto;
    //     const image = this.create({
    //         ...createImageDto,
    //         product.id
    //     });
    // }
}