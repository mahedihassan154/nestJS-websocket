import { Test, TestingModule } from '@nestjs/testing';
import { MarketDataGateway } from './market-data.gateway';

describe('MarketDataGateway', () => {
  let gateway: MarketDataGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketDataGateway],
    }).compile();

    gateway = module.get<MarketDataGateway>(MarketDataGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
