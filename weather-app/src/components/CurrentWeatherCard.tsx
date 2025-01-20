import { FC } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { getWeatherIcon } from '../utils/weatherIcons';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../contexts/WeatherContext';
import { useParams } from 'react-router-dom';

export const CurrentWeatherCard: FC = () => {
  const { t } = useTranslation();
  const { locationId } = useParams<{ locationId: string }>();
  const { weatherData } = useWeather();

  const currentWeather = locationId
    ? weatherData.find((data) => {
        const [lat, lon] = locationId.split(':').map(Number);
        return data.coord.lat === lat && data.coord.lon === lon;
      })
    : null;

  if (!currentWeather) return null;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography
            variant='h5'
            sx={{ flexGrow: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
          >
            {t('currentWeather.title')}
          </Typography>
          {getWeatherIcon(currentWeather.weather[0].icon)}
        </Box>
        <Typography
          variant='h3'
          sx={{ mb: 2, fontSize: { xs: '2rem', sm: '3rem' } }}
        >
          {Math.round(currentWeather.main.temp)}°C
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {currentWeather.weather[0].description}
        </Typography>
        <Typography variant='body1'>
          {t('currentWeather.feelsLike')}:{' '}
          {Math.round(currentWeather.main.feels_like)}°C
        </Typography>
      </CardContent>
    </Card>
  );
};
