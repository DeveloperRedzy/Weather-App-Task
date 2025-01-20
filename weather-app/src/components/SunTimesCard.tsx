import { FC } from 'react';
import { Card, CardContent, Typography, Grid2 } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../contexts/WeatherContext';
import { useParams } from 'react-router-dom';

export const SunTimesCard: FC = () => {
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
        <Typography variant='h6' sx={{ mb: 10 }}>
          {t('sunTimes.title')}
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6 }}>
            <Typography color='text.secondary'>
              {t('sunTimes.sunrise')}
            </Typography>
            <Typography variant='h6'>
              {new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString()}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography color='text.secondary'>
              {t('sunTimes.sunset')}
            </Typography>
            <Typography variant='h6'>
              {new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString()}
            </Typography>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};
