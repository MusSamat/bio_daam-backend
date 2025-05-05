import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @Column('jsonb')
  items: { productId: number; quantity: number; price: number }[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @Column()
  address: string;

  @Column()
  paymentMethod: 'telegram_pay' | 'card' | 'cash';

  @Column()
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
