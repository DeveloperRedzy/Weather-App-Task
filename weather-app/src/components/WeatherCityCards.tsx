import { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid2 } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { getWeatherIcon } from '../utils/weatherIcons.tsx';
import { WeatherCardSkeleton } from './WeatherCardSkeleton';
import { WeatherData } from '../types/weather';

interface WeatherCityCardProps {
  city: WeatherData;
  onClick: (location: string) => void;
}

const WeatherCityCard: FC<WeatherCityCardProps> = memo(({ city, onClick }) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
        },
      }}
      onClick={() => onClick(`${city.coord.lat}:${city.coord.lon}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
            {city.name}
          </Typography>
          {getWeatherIcon(city.weather[0].icon)}
        </Box>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {city.weather[0].description}
        </Typography>
        <Typography variant='h6' sx={{ mb: 1 }}>
          {Math.round(city.main.temp)}°C
        </Typography>
        <Typography variant='body1'>
          Feels like: {Math.round(city.main.feels_like)}°C
        </Typography>
        <Typography variant='body1'>
          Max: {Math.round(city.main.temp_max)}°C
        </Typography>
        <Typography variant='body1'>
          Min: {Math.round(city.main.temp_min)}°C
        </Typography>
      </CardContent>
    </Card>
  );
});

interface WeatherCityCardsProps {
  searchQuery: string;
}

export const WeatherCityCards: FC<WeatherCityCardsProps> = memo(
  ({ searchQuery }) => {
    const navigate = useNavigate();
    const weatherData = useAppSelector((state) => state.weather.weatherData);
    const connectionStatus = useAppSelector(
      (state) => state.weather.connectionStatus
    );

    const filteredCities = weatherData.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardClick = (location: string) => {
      navigate(`/location/${location}`);
    };

    if (connectionStatus === 'connecting') {
      return <WeatherCardSkeleton count={weatherData.length || 3} />;
    }

    return (
      <Grid2 container spacing={3}>
        {filteredCities.map((city) => (
          <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={city.id}>
            <WeatherCityCard city={city} onClick={handleCardClick} />
          </Grid2>
        ))}
      </Grid2>
    );
  }
);
