import { Injectable, Logger } from '@nestjs/common';
import { GlobalService } from 'src/common/global.service';
import * as WebSocket from 'ws';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private streams: Map<string, WebSocket> = new Map();

  /**
   * Subscribe to a Binance WebSocket stream for a given symbol (persistent connection).
   */
  subscribeToMarketData(symbol: string, callback: (data: any) => void) {
    const url = `${GlobalService.environmentVariable['BINANCE_WS_ADDRESS']}/${symbol.toLowerCase()}@trade`;

    if (this.streams.has(symbol)) {
      this.logger.log(`Already subscribed to market data for ${symbol}`);
      return;
    }

    const ws = new WebSocket(url);

    ws.on('open', () => {
      this.logger.log(`Connected to Binance WebSocket for ${symbol}`);
    });

    ws.on('message', (message: string) => {
      const data = JSON.parse(message);
      callback(data);
    });

    ws.on('close', () => {
      this.logger.warn(`Connection closed for ${symbol}, attempting to reconnect...`);
      this.streams.delete(symbol);
      this.reconnect(symbol, callback);
    });

    ws.on('error', (error) => {
      this.logger.error(`Error on ${symbol} stream: ${error.message}`);
    });

    this.streams.set(symbol, ws);
  }

  /**
   * Subscribe to market data for a single-use connection (ephemeral connection).
   */
  subscribeToMarketDataOnce(symbol: string, callback: (data: any) => void) {
    const url = `${GlobalService.environmentVariable['BINANCE_WS_ADDRESS']}/${symbol.toLowerCase()}@trade`;

    const ws = new WebSocket(url);

    ws.on('message', (message: string) => {
      const data = JSON.parse(message);
      callback(data);
      ws.close(); // Close the connection after receiving the first message
    });

    ws.on('error', (error) => {
      this.logger.error(`Error on ephemeral ${symbol} stream: ${error.message}`);
    });
  }

  /**
   * Unsubscribe from a Binance WebSocket stream for a given symbol.
   */
  unsubscribeFromMarketData(symbol: string) {
    const ws = this.streams.get(symbol);
    if (ws) {
      ws.close();
      this.streams.delete(symbol);
      this.logger.log(`Unsubscribed from market data for ${symbol}`);
    }
  }

  /**
   * Reconnect to a market data stream.
   */
  private reconnect(symbol: string, callback: (data: any) => void) {
    setTimeout(() => {
      this.logger.log(`Reconnecting to ${symbol}`);
      this.subscribeToMarketData(symbol, callback);
    }, 5000); // Retry after 5 seconds
  }
}
