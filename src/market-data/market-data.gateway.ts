import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionRequestDto } from '../dto/subscription-request.dto';
import { MarketService } from './services/market.service';

@WebSocketGateway({ namespace: '/market', cors: true })
@Injectable()
export class MarketDataGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(MarketDataGateway.name);

  constructor(private readonly marketService: MarketService) {}

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connection', { message: 'Welcome to Market Data WebSocket' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: SubscriptionRequestDto) {
    const { symbol } = payload;

    this.logger.log(`Client ${client.id} subscribed to ${symbol} updates`);
    this.marketService.subscribeToMarketData(symbol, (data) => {
      client.emit('marketData', { symbol, data });
    });
  }

  @SubscribeMessage('subscribeOnce')
  handleSubscribeOnce(client: Socket, payload: SubscriptionRequestDto) {
    const { symbol } = payload;

    this.logger.log(`Client ${client.id} requested one-time data for ${symbol}`);
    this.marketService.subscribeToMarketDataOnce(symbol, (data) => {
      client.emit('marketDataOnce', { symbol, data });
    });
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: SubscriptionRequestDto) {
    const { symbol } = payload;

    this.logger.log(`Client ${client.id} unsubscribed from ${symbol} updates`);
    this.marketService.unsubscribeFromMarketData(symbol);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    client.emit('pong');
  }
}
