import { IsEnum } from 'class-validator';
import { PaymentStatus } from 'prisma/generated/enums';

export class UpdateRegistrationPaymentDto {
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
