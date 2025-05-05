import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { ProductsService } from '../products/products.service';

// Тип для элементов заказа (если нет отдельной сущности)
interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
  ) {}

  async createOrder(
    user: User,
    products: { id: number; quantity: number }[],
    address: string,
    paymentMethod: 'telegram_pay' | 'card' | 'cash',
  ): Promise<Order> {
    const items: OrderItemInput[] = [];
    let totalPrice = 0;

    for (const item of products) {
      const product = await this.productsService.findOne(item.id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.id} not found`);
      }

      const itemPrice = product.price * item.quantity;
      items.push({
        productId: product.id,
        quantity: item.quantity,
        price: itemPrice,
      });
      totalPrice += itemPrice;
    }

    const order = this.ordersRepository.create({
      user, // если TypeORM связан с User сущностью
      items,
      totalPrice,
      status: 'pending',
      address,
      paymentMethod,
      paymentStatus: 'pending',
    });

    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['user'] });
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(
    id: number,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  ): Promise<Order> {
    const result = await this.ordersRepository.update(id, {
      status,
      updatedAt: new Date(),
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.findOne(id);
  }
}
