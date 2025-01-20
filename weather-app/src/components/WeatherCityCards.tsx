import { FC, memo, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid2,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { getWeatherIcon } from '../utils/weatherIcons';
import { WeatherCardSkeleton } from './WeatherCardSkeleton';
import { WeatherData } from '../types/weather';
import {
  fetchLocations,
  fetchAllWeatherData,
  removeLocationThunk,
} from '../store/features/weatherSlice';
import { showSnackbar } from '../store/features/uiSlice';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../contexts/WeatherContext';

interface WeatherCityCardProps {
  city: WeatherData;
  onClick: (location: string) => void;
  onDelete: (location: string) => void;
}

const WeatherCityCard: FC<WeatherCityCardProps> = memo(
  ({ city, onClick, onDelete }) => {
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(`${city.coord.lat}:${city.coord.lon}`);
    };

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
            <IconButton onClick={handleDelete} size='small' sx={{ mr: 1 }}>
              <DeleteIcon />
            </IconButton>
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
  }
);

interface WeatherCityCardsProps {
  searchQuery: string;
}

export const WeatherCityCards: FC<WeatherCityCardsProps> = memo(
  ({ searchQuery }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { weatherData, savedLocations, status } = useWeather();

    useEffect(() => {
      if (status === 'idle') {
        dispatch(fetchLocations());
      }
    }, [dispatch, status]);

    useEffect(() => {
      if (savedLocations.length > 0 && weatherData.length === 0) {
        dispatch(fetchAllWeatherData(savedLocations));
      }
    }, [dispatch, savedLocations, weatherData.length]);

    const filteredCities = useMemo(
      () =>
        weatherData.filter((city) =>
          city?.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
        ),
      [weatherData, searchQuery]
    );

    const handleCardClick = (location: string) => {
      navigate(`/location/${location}`);
    };

    const handleDeleteCity = async (location: string) => {
      try {
        const [lat, lon] = location.split(':').map(Number);
        await dispatch(removeLocationThunk({ lat, lon })).unwrap();
        dispatch(
          showSnackbar({
            message: t('city.successfullyDeleted'),
            severity: 'success',
          })
        );
      } catch (error) {
        dispatch(
          showSnackbar({
            message: t('city.deleteFailed'),
            severity: 'error',
          })
        );
      }
    };

    if (status === 'loading' && weatherData.length === 0) {
      return <WeatherCardSkeleton count={savedLocations.length || 3} />;
    }

    return (
      <Grid2 container spacing={3}>
        {filteredCities.map((city) => (
          <Grid2
            size={{ xs: 12, md: 6, lg: 4 }}
            key={`${city.name}_${city.coord.lat}_${city.coord.lon}`}
          >
            <WeatherCityCard
              city={city}
              onClick={handleCardClick}
              onDelete={handleDeleteCity}
            />
          </Grid2>
        ))}
      </Grid2>
    );
  }
);
