import { FC } from 'react';
import { Card, CardContent, Typography, Grid2 } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../contexts/WeatherContext';
import { useParams } from 'react-router-dom';

export const WeatherDetailsCard: FC = () => {
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
        <Typography variant='h6' sx={{ mb: 2 }}>
          {t('weatherDetails.title')}
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6 }}>
            <Typography color='text.secondary'>
              {t('weatherDetails.humidity')}
            </Typography>
            <Typography variant='h6'>
              {currentWeather.main.humidity}%
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography color='text.secondary'>
              {t('weatherDetails.pressure')}
            </Typography>
            <Typography variant='h6'>
              {currentWeather.main.pressure} hPa
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography color='text.secondary'>
              {t('weatherDetails.windSpeed')}
            </Typography>
            <Typography variant='h6'>
              {currentWeather.wind.speed} m/s
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography color='text.secondary'>
              {t('weatherDetails.windDirection')}
            </Typography>
            <Typography variant='h6'>{currentWeather.wind.deg}°</Typography>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};
