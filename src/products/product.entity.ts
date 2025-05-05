import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string; // e.g., 'fruits', 'vegetables', 'prepared-food'

  @Column()
  imageUrl: string;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}
