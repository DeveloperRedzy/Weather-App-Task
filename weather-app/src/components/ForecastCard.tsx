import { FC } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ForecastChart } from './ForecastChart';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../contexts/WeatherContext';

export const ForecastCard: FC = () => {
  const { t } = useTranslation();
  const { forecastData } = useWeather();

  if (!forecastData) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 2 }}>
          {t('forecast.title')}
        </Typography>
        <ForecastChart data={forecastData} />
      </CardContent>
    </Card>
  );
};
