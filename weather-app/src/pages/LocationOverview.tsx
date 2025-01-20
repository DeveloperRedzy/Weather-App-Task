import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid2, IconButton, Box, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import {
  fetchLocationDetails,
  fetchWeatherForLocation,
} from '../store/features/weatherSlice';
import { WeatherDetailsCard } from '../components/WeatherDetailsCard';
import { WeatherMapCard } from '../components/WeatherMapCard';
import { ForecastCard } from '../components/ForecastCard';
import { AirQualityCard } from '../components/AirQualityCard';
import { CurrentWeatherCard } from '../components/CurrentWeatherCard';
import { SunTimesCard } from '../components/SunTimesCard';
import { useWeather } from '../contexts/WeatherContext';

type MapLayer = 'clouds' | 'precipitation' | 'temp';

const LocationOverview: FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedMapLayer, setSelectedMapLayer] = useState<MapLayer>('temp');
  const { weatherData, forecastData, airQualityData } = useWeather();

  useEffect(() => {
    if (!locationId) {
      navigate('/dashboard');
    }
  }, [locationId, navigate]);

  const currentLocationWeather = locationId
    ? weatherData.find((data) => {
        const [lat, lon] = locationId.split(':').map(Number);
        return data.coord.lat === lat && data.coord.lon === lon;
      })
    : undefined;

  useEffect(() => {
    if (locationId) {
      dispatch(fetchWeatherForLocation(locationId));
      dispatch(fetchLocationDetails(locationId));
    }
  }, [dispatch, locationId]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleMapLayerChange = (
    _: React.MouseEvent<HTMLElement>,
    newLayer: MapLayer
  ) => {
    if (newLayer !== null) {
      setSelectedMapLayer(newLayer);
    }
  };

  if (!locationId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No location specified</Typography>
      </Box>
    );
  }

  if (!currentLocationWeather) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h4' component='h1'>
          {currentLocationWeather.name}
        </Typography>
      </Box>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <CurrentWeatherCard />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <WeatherDetailsCard />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <SunTimesCard />
        </Grid2>
        {airQualityData && (
          <Grid2 size={{ xs: 12 }}>
            <AirQualityCard />
          </Grid2>
        )}
        {forecastData && (
          <Grid2 size={{ xs: 12 }}>
            <ForecastCard />
          </Grid2>
        )}
        <Grid2 size={{ xs: 12 }}>
          <WeatherMapCard
            location={locationId}
            selectedMapLayer={selectedMapLayer}
            onMapLayerChange={handleMapLayerChange}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default LocationOverview;
