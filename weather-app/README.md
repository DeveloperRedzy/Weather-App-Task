# Weather App

A modern weather application built with React, TypeScript, and Material-UI that provides real-time weather information, forecasts, and air quality data.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key

## Setup

1. Clone the repository

```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

To get an API key:

1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Create an account
3. Navigate to API keys section
4. Copy your API key

5. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Start the WebSocket server (in a separate terminal)

```bash
cd weather-web-socket
npm install
node server.js
```

## Features

- Real-time weather updates
- 5-day weather forecast
- Air quality information
- Interactive weather map
- Multiple city support
- Responsive design
- Dark/Light theme
- Internationalization support

## Technologies

- React
- TypeScript
- Material-UI
- Redux Toolkit
- WebSocket
- Vite
- i18next

## License

MIT
