import * as WebSocket from 'ws';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

export class BinanceWebSocket {
  private readonly logger = new Logger(BinanceWebSocket.name);
  private readonly ws: WebSocket = new WebSocket('wss://stream.binance.com:9443/ws');
  private subscriptions: Record<string, string[]> = {};

  constructor() {
    this.ws.on('open', () => this.logger.log('Connected to Binance WebSocket'));
    this.ws.on('message', (message) => this.handleMessage(message));
    this.ws.on('close', () => this.logger.warn('Binance WebSocket closed.'));
    this.ws.on('error', (error) => this.logger.error('Binance WebSocket error:', error));
  }

  subscribe(client: Socket, instrument: string, preferences: any): void {
    const topic = `${instrument.toLowerCase()}@trade`;
    if (!this.subscriptions[client.id]) {
      this.subscriptions[client.id] = [];
    }

    if (!this.subscriptions[client.id].includes(topic)) {
      this.subscriptions[client.id].push(topic);
      this.ws.send(JSON.stringify({ method: 'SUBSCRIBE', params: [topic], id: 1 }));
      this.logger.log(`Subscribed to ${topic} for client ${client.id}`);
    }

    client.emit('market_data', { message: `Subscribed to ${topic}`, preferences });
  }

  unsubscribe(clientId: string, instrument: string): void {
    const topic = `${instrument.toLowerCase()}@trade`;
    if (this.subscriptions[clientId]?.includes(topic)) {
      this.ws.send(JSON.stringify({ method: 'UNSUBSCRIBE', params: [topic], id: 1 }));
      this.subscriptions[clientId] = this.subscriptions[clientId].filter((t) => t !== topic);
      this.logger.log(`Unsubscribed from ${topic} for client ${clientId}`);
    }
  }

  private handleMessage(message: any): void {
    const data = JSON.parse(message);
    this.logger.log(`Received market data: ${JSON.stringify(data)}`);
  }
}
