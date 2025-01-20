import { FC } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../contexts/WeatherContext';

const getAqiLabel = (aqi: number, t: (key: string) => string): string => {
  switch (aqi) {
    case 1:
      return t('airQuality.level.good');
    case 2:
      return t('airQuality.level.fair');
    case 3:
      return t('airQuality.level.moderate');
    case 4:
      return t('airQuality.level.poor');
    case 5:
      return t('airQuality.level.veryPoor');
    default:
      return t('airQuality.level.unknown');
  }
};

const getAqiColor = (aqi: number): string => {
  switch (aqi) {
    case 1:
      return '#4caf50';
    case 2:
      return '#8bc34a';
    case 3:
      return '#ffc107';
    case 4:
      return '#ff9800';
    case 5:
      return '#f44336';
    default:
      return '#9e9e9e';
  }
};

export const AirQualityCard: FC = () => {
  const { t } = useTranslation();
  const { airQualityData } = useWeather();

  if (!airQualityData) return null;

  const aqi = airQualityData.list[0].main.aqi;
  const components = airQualityData.list[0].components;

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          {t('airQuality.title')}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={getAqiLabel(aqi, t)}
            sx={{
              bgcolor: getAqiColor(aqi),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Typography variant='body2'>
            CO: {components.co.toFixed(1)} μg/m³
          </Typography>
          <Typography variant='body2'>
            NO₂: {components.no2.toFixed(1)} μg/m³
          </Typography>
          <Typography variant='body2'>
            O₃: {components.o3.toFixed(1)} μg/m³
          </Typography>
          <Typography variant='body2'>
            SO₂: {components.so2.toFixed(1)} μg/m³
          </Typography>
          <Typography variant='body2'>
            PM2.5: {components.pm2_5.toFixed(1)} μg/m³
          </Typography>
          <Typography variant='body2'>
            PM10: {components.pm10.toFixed(1)} μg/m³
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
