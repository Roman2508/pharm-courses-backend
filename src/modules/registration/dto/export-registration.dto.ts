import { PartialType } from '@nestjs/swagger';

import { ManyRegistrationsDto } from './many-registrations.dto';

export class ExportRegistrationsDto extends PartialType(ManyRegistrationsDto) {}
