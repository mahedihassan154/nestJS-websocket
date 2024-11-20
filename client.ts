
const { io } = require('socket.io-client');
// const socket = io('http://localhost:8006/market');

// socket.on('connection', (message) => {
//   console.log(message);
// });

// // socket.emit('subscribe', { symbol: 'BTCUSDT' });
// socket.emit('subscribe', { symbol: 'ETHUSDT' });

// socket.on('marketData', (data) => {
//   console.log(data);
// });


const socket = io('http://localhost:8006/market');

// Handle connection
socket.on('connection', (message) => {
  console.log('Server:', message);
});

// Subscribe to real-time updates
socket.emit('subscribe', { symbol: 'BTCUSDT' });
socket.on('marketData', (data) => {
  console.log('Market Data:', data);
});

// Subscribe for a one-time snapshot
// socket.emit('subscribeOnce', { symbol: 'BTCUSDT' });
// socket.on('marketDataOnce', (data) => {
//   console.log('Market Data Snapshot:', data);
// });

// // Send ping and handle pong
// socket.emit('ping');
// socket.on('pong', () => {
//   console.log('Pong received');
// });

// // Unsubscribe
// socket.emit('unsubscribe', { symbol: 'BTCUSDT' });
