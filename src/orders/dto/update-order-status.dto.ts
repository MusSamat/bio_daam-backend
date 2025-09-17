import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsIn } from 'class-validator'

export class UpdateOrderStatusDto {
    @ApiProperty({
        example: 'COMPLETED',
        description: 'Новый статус заказа',
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    })
    @IsString()
    @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    status!: string
}