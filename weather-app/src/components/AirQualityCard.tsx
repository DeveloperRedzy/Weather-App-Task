import { FC } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { AirQualityData } from '../store/features/weatherSlice';
import { useTranslation } from 'react-i18next';

interface AirQualityCardProps {
  data: AirQualityData;
}

const getAQIColor = (aqi: number) => {
  switch (aqi) {
    case 1:
      return '#4CAF50'; // Good - Green
    case 2:
      return '#8BC34A'; // Fair - Light Green
    case 3:
      return '#FFC107'; // Moderate - Yellow
    case 4:
      return '#FF5722'; // Poor - Orange
    case 5:
      return '#F44336'; // Very Poor - Red
    default:
      return '#9E9E9E';
  }
};

const getAQILabel = (aqi: number, t: (key: string) => string) => {
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

export const AirQualityCard: FC<AirQualityCardProps> = ({ data }) => {
  const { t } = useTranslation();
  const airQuality = data.list[0];
  const aqi = airQuality.main.aqi;
  //const components = airQuality.components;
  return (
    <Box>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant='h6' gutterBottom>
          {t('airQuality.title')}
        </Typography>
        <Typography variant='h4' gutterBottom>
          {getAQILabel(aqi, t)}
        </Typography>
        <LinearProgress
          variant='determinate'
          value={(aqi / 5) * 100}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getAQIColor(aqi),
            },
          }}
        />
      </Box>
    </Box>
  );
};
