const WebSocket = require('ws'); // Import the WebSocket library
const http = require('http'); // Import HTTP library to create server

const API_KEY = '6828d0121293b7ed19bbcb7bb22dadf3';
// Create an HTTP server (you need an HTTP server for WebSockets)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, WebSocket Server!\n');
});

const UNITS = 'metric';

let subscribedClients = new Map();

// Set up WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection event
wss.on('connection', (ws) => {
  console.log('A new client connected!');

  // Send a welcome message to the client
  const newClientId = `Client-${Date.now()}`;
  ws.send(JSON.stringify({ type: 'REGISTERED', clientId: newClientId }));
  subscribedClients.set(newClientId, { ws: ws, places: [] });

  // Handle incoming messages from clients
  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'CLEAR_CURRENT_SUBSCRIPTIONS') {
      subscribedClients.set(parsedMessage.clientId, {
        ...subscribedClients.get(parsedMessage.clientId),
        places: [],
      });
    } else if (parsedMessage.type === 'SET_CURRENT_SUBSCRIPTIONS') {
      const places = [];
      for (
        let clientSubscription = 0;
        clientSubscription < parsedMessage.places.length;
        clientSubscription++
      ) {
        const place = parsedMessage.places[clientSubscription];
        const [latitude, longitude] = place.split(':');
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${UNITS}`
        );
        const data = await response.json();
        places.push(data);
      }
      subscribedClients.set(parsedMessage.clientId, {
        ...subscribedClients.get(parsedMessage.clientId),
        places: parsedMessage.places,
      });
      ws.send(JSON.stringify({ type: 'PLACES_DATA', placesData: places }));
    } else if (parsedMessage.type === 'CLEAR_CURRENT_SUBSCRIPTION') {
      subscribedClients.set(parsedMessage.clientId, {
        ...subscribedClients.get(parsedMessage.clientId),
        place: undefined,
      });
    } else if (parsedMessage.type === 'SET_CURRENT_SUBSCRIPTION') {
      subscribedClients.set(parsedMessage.clientId, {
        ...subscribedClients.get(parsedMessage.clientId),
        place: parsedMessage.place,
      });
      const [latitude, longitude] = parsedMessage.place.split(':');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${UNITS}`
      );
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      const placeData = await response.json();
      const forecastData = await forecastResponse.json();
      ws.send(JSON.stringify({ type: 'PLACE_DATA', placeData, forecastData }));
    } else if (parsedMessage.type === 'DISCONNECT') {
      ws.close();
      subscribedClients.delete(parsedMessage.clientId);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('A client disconnected');
  });
});

// Start the server on a specific port
server.listen(8080, () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});

setInterval(async () => {
  console.log('Checking subscribed clients...');
  const subscriberKeys = Array.from(subscribedClients.keys());

  console.log(subscriberKeys);

  for (
    let subscriberIndex = 0;
    subscriberIndex < subscriberKeys.length;
    subscriberIndex++
  ) {
    const places = [];
    const clientObject = subscribedClients.get(subscriberKeys[subscriberIndex]);

    if (clientObject.places) {
      for (
        let clientSubscription = 0;
        clientSubscription < clientObject.places.length;
        clientSubscription++
      ) {
        const place = clientObject.places[clientSubscription];
        const [latitude, longitude] = place.split(':');
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${UNITS}`
        );
        const data = await response.json();
        places.push(data);
      }
      clientObject.ws.send(
        JSON.stringify({ type: 'PLACES_DATA', placesData: places })
      );
    }
  }

  for (
    let subscriberIndex = 0;
    subscriberIndex < subscriberKeys.length;
    subscriberIndex++
  ) {
    const clientObject = subscribedClients.get(subscriberKeys[subscriberIndex]);
    if (clientObject.place) {
      const [latitude, longitude] = clientObject.place.split(':');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${UNITS}`
      );
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      const placeData = await response.json();
      const forecastData = await forecastResponse.json();
      clientObject.ws.send(
        JSON.stringify({ type: 'PLACE_DATA', placeData, forecastData })
      );
    }
  }
}, 10 * 60 * 1000); // 10 minutes
