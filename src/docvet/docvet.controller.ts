import { Controller, UseGuards } from '@nestjs/common';
import { DocvetService } from './docvet.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';



@UseGuards(JwtGuard, RolesGuard)
@Controller('docvet')
export class DocvetController {
    constructor(private readonly docvetService: DocvetService) {}


}
