# Market Data WebSocket API with NestJS

This project provides a WebSocket API to subscribe to real-time market data from Binance. The API allows clients to subscribe to persistent or one-time updates for market data.

## Features

- Real-time WebSocket communication using the `/market` namespace.
- Persistent and one-time market data subscriptions.
- Binance WebSocket API integration.
- Automatic reconnection on failures.
- Modular and scalable architecture using NestJS.

---

## Project setup

```bash
$ npm install
```
NODE version 20.9.0
```bash
$ nvm use 20.9.0
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## WebSocket API Usage

The WebSocket server runs at the `/market` namespace and supports the following events:

### Events

#### Connection
- Clients are greeted with a welcome message upon connecting.

#### Subscribe
- **Payload**: `{ "symbol": "<symbol>" }`
- Subscribes to real-time updates for a specific market symbol.

#### Subscribe Once
- **Payload**: `{ "symbol": "<symbol>" }`
- Retrieves a one-time market data update.

#### Unsubscribe
- **Payload**: `{ "symbol": "<symbol>" }`
- Stops updates for a specific market symbol.

#### Ping
- Sends a ping to the server.
- **Response**: `pong`


## Running the WebSocket Client

To test the WebSocket API, you can run the provided `client.ts` file.

### Steps to Run `client.ts`

1. Ensure the WebSocket server is running locally on `http://localhost:8006/market`.

2. Install required dependencies if not already installed:

   ```bash
   npm install socket.io-client
   node client.ts
   ```
