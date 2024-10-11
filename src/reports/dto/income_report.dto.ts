import { ApiProperty } from '@nestjs/swagger';

export class IncomeReportDto {
  @ApiProperty()
  currentPeriod: {
    income: number;
  };

  @ApiProperty()
  lastPeriod: {
    income: number;
  };

  @ApiProperty()
  incomeChange: number;

  @ApiProperty({ type: () => [OrderDayDto] })
  ordersDays: OrderDayDto[];
}

export class OrderDayDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  income: number;
}
