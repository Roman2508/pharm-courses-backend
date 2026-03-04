import { Controller } from '@nestjs/common';

import { CoreService } from './core.service';

@Controller()
export class CoreController {
  constructor(private readonly CoreService: CoreService) {}
}
