import { FC } from 'react';
import { Box, Typography, useTheme, Grid2 } from '@mui/material';
import { ForecastData } from '../types/weather';
import { getWeatherIcon } from '../utils/weatherIcons.tsx';

interface ForecastChartProps {
  data: ForecastData;
}

export const ForecastChart: FC<ForecastChartProps> = ({ data }) => {
  const theme = useTheme();

  const groupedData = data.list.reduce(
    (acc: { [key: string]: (typeof data.list)[0][] }, item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {}
  );

  return (
    <Grid2 container spacing={{ xs: 1, sm: 2 }} sx={{ p: { xs: 1, sm: 0 } }}>
      {Object.entries(groupedData).map(([date, items]) => {
        const dayData = items[0];
        const maxTemp = Math.max(...items.map((item) => item.main.temp_max));
        const minTemp = Math.min(...items.map((item) => item.main.temp_min));

        return (
          <Grid2 key={date} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: 1,
                height: '100%',
                textAlign: 'center',
              }}
            >
              <Typography variant='subtitle2' color='text.secondary'>
                {new Date(dayData.dt * 1000).toLocaleDateString(undefined, {
                  weekday: 'short',
                })}
              </Typography>
              <Typography
                variant='caption'
                display='block'
                color='text.secondary'
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                {new Date(dayData.dt * 1000).toLocaleDateString()}
              </Typography>
              <Box sx={{ my: 1 }}>
                {getWeatherIcon(dayData.weather[0].icon)}
              </Box>
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {dayData.weather[0].description}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant='h6'
                  component='span'
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  }}
                >
                  {Math.round(maxTemp)}°
                </Typography>
                <Typography
                  variant='body2'
                  component='span'
                  color='text.secondary'
                  sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {Math.round(minTemp)}°
                </Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant='caption'
                  display='block'
                  color='text.secondary'
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                >
                  Humidity: {dayData.main.humidity}%
                </Typography>
                <Typography
                  variant='caption'
                  display='block'
                  color='text.secondary'
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                >
                  Wind: {dayData.wind.speed} m/s
                </Typography>
              </Box>
            </Box>
          </Grid2>
        );
      })}
    </Grid2>
  );
};
