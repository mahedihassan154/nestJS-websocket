import { Module } from '@nestjs/common';
import { MarketDataGateway } from './market-data.gateway';
import { MarketService } from './services/market.service';

@Module({
  providers: [MarketDataGateway, MarketService]
})
export class MarketDataModule {}
