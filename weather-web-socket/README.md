## Running server

Run server
```bash
node server.js
```

Server is hosted on localhost at port 8080.

## Server -> Client
Client recieves following format from backend. clientId is recieved on REGISTERED type. placesData is present on PLACES_DATA type. placeData and forecastData are present on PLACE_DATA type. Note that any types are not any, but same types as WeatherAPI returns.
```ts
interface IMessage {
    type: "REGISTERED" | "PLACES_DATA" | "PLACE_DATA",
    clientId?: string,
    placesData?: any[],
    placeData?: any,
    forecastData?: any,
}
```
Client id is generated on backend and should be presented at every message sent to webSocket except for disconnecting.

## Client -> Server
All possible events sent to server
```ts
enum Events {
    SET_CURRENT_SUBSCRIPTIONS = "SET_CURRENT_SUBSCRIPTIONS"
    CLEAR_CURRENT_SUBSCRIPTION = "CLEAR_CURRENT_SUBSCRIPTION"
    SET_CURRENT_SUBSCRIPTION = "SET_CURRENT_SUBSCRIPTION"
    CLEAR_CURRENT_SUBSCRIPTIONS = "CLEAR_CURRENT_SUBSCRIPTIONS"
    DISCONNECT = "DISCONNECT"
}
```
We define places array as `latitude:longitude`. Example:
```ts
const places = [12.232:23.123,12.232:23.123,12.232:23.123]
```
### CLEAR_CURRENT_SUBSCRIPTION
```ts
{ type: "CLEAR_CURRENT_SUBSCRIPTION", clientId: clientId }
```
### SET_CURRENT_SUBSCRIPTION
```ts
{ type: "SET_CURRENT_SUBSCRIPTION", place: places[0], clientId: clientId }
```
### CLEAR_CURRENT_SUBSCRIPTIONS
```ts
{ type: "CLEAR_CURRENT_SUBSCRIPTIONS", clientId: clientId }
```
### SET_CURRENT_SUBSCRIPTIONS
```ts
{ type: "SET_CURRENT_SUBSCRIPTIONS", places: places, clientId: clientId }
```
### DISCONNECT
```ts
{ type: "DISCONNECT", clientId: clientId }
```