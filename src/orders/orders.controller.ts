import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() orderData: CreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.createOrder(
      user,
      orderData.products,
      orderData.address,
      orderData.paymentMethod,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyOrders(@CurrentUser() user: User) {
    return this.ordersService.findByUser(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(+id, status);
  }
}
