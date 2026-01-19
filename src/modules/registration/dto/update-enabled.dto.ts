import { IsBoolean } from "class-validator";

export class ChangeEnableCertificateDto {
  @IsBoolean()
  certificateEnabled: boolean;
}
