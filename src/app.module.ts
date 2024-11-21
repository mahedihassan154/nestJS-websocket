import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketDataModule } from './market-data/market-data.module';

@Module({
  imports: [MarketDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
