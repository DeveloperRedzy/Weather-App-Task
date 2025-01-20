import { store } from '../store/store';
import {
  setWeatherData,
  setForecastData,
  setConnectionStatus,
  setClientId,
  WebSocketConnectionStatus,
  setAirQualityData,
} from '../store/features/weatherSlice';

class WebSocketService {
  private ws: WebSocket | null = null;
  private clientId: string | null = null;
  private readonly url = 'ws://localhost:8080';

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    store.dispatch(setConnectionStatus(WebSocketConnectionStatus.CONNECTING));
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      store.dispatch(setConnectionStatus(WebSocketConnectionStatus.CONNECTED));
      console.info('WebSocket connected');
    };

    this.ws.onclose = () => {
      store.dispatch(
        setConnectionStatus(WebSocketConnectionStatus.DISCONNECTED)
      );
      console.info('WebSocket disconnected');
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      store.dispatch(setConnectionStatus(WebSocketConnectionStatus.ERROR));
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
  }

  private handleMessage(message: any) {
    switch (message.type) {
      case 'REGISTERED':
        this.clientId = message.clientId;
        store.dispatch(setClientId(message.clientId));
        break;
      case 'PLACES_DATA':
        store.dispatch(setWeatherData(message.placesData));
        break;
      case 'PLACE_DATA':
        store.dispatch(setWeatherData([message.placeData]));
        store.dispatch(setForecastData(message.forecastData));
        if (message.airQualityData) {
          store.dispatch(setAirQualityData(message.airQualityData));
        }
        break;
      default:
        console.info('Unhandled message type:', message.type);
    }
  }

  private isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN && this.clientId !== null;
  }

  subscribeToLocations(locations: string[]) {
    if (!this.isConnected()) {
      console.info('WebSocket not connected, retrying in 1 second...');
      setTimeout(() => this.subscribeToLocations(locations), 1000);
      return;
    }

    this.ws!.send(
      JSON.stringify({
        type: 'SET_CURRENT_SUBSCRIPTIONS',
        clientId: this.clientId,
        places: locations,
      })
    );
  }

  subscribeToLocation(location: string) {
    if (!this.isConnected()) {
      console.info('WebSocket not connected, retrying in 1 second...');
      setTimeout(() => this.subscribeToLocation(location), 1000);
      return;
    }

    this.ws!.send(
      JSON.stringify({
        type: 'SET_CURRENT_SUBSCRIPTION',
        clientId: this.clientId,
        place: location,
      })
    );
  }

  clearSubscriptions() {
    if (!this.isConnected()) {
      console.info('WebSocket not connected, retrying in 1 second...');
      setTimeout(() => this.clearSubscriptions(), 1000);
      return;
    }

    this.ws!.send(
      JSON.stringify({
        type: 'CLEAR_CURRENT_SUBSCRIPTIONS',
        clientId: this.clientId,
      })
    );
  }

  disconnect() {
    if (!this.isConnected()) return;

    this.ws!.send(
      JSON.stringify({
        type: 'DISCONNECT',
        clientId: this.clientId,
      })
    );

    this.ws!.close();
  }
}

export const webSocketService = new WebSocketService();
