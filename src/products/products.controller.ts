import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.productsService.findByCategory(category);
  }

  @Post()
  create(@Body() productData: Partial<Product>) {
    return this.productsService.create(productData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Product>) {
    return this.productsService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
