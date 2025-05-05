export class CreateOrderDto {
  products: {
    id: number;
    quantity: number;
  }[];
  address: string;
  paymentMethod: 'telegram_pay' | 'card' | 'cash';
}
