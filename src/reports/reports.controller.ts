import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportService } from './reports.service';
import { IncomeReportDto } from './dto/income_report.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../users/entities/roles.enum';


@Controller('reports')
@ApiBearerAuth()
@ApiTags('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('income')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get income report (Admin only)' })
  @ApiResponse({ status: 200, description: 'Income report retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getIncomeReport(): Promise<IncomeReportDto> {
    
    return this.reportService.getIncomeReport();
  }

  @Get('regis')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get income report (Admin only)' })
  @ApiResponse({ status: 200, description: 'Register report retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getRegistrationReport() {
    
    return this.reportService.getRegistrationStats();
  }

  @Get('orders')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get income report (Admin only)' })
  @ApiResponse({ status: 200, description: 'Orders report retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getOrderStats() {
   
    return this.reportService.getOrderStats();
  }
}
