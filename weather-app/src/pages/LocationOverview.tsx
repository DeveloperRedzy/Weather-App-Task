import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Grid2,
  CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import { useWeatherWebSocket } from '../hooks/useWeatherWebSocket';
import { CurrentWeatherCard } from '../components/CurrentWeatherCard';
import { WeatherDetailsCard } from '../components/WeatherDetailsCard';
import { SunTimesCard } from '../components/SunTimesCard';
import { AirQualityCard } from '../components/AirQualityCard';
import { ForecastCard } from '../components/ForecastCard';
import { WeatherMapCard } from '../components/WeatherMapCard';

type MapLayer = 'clouds' | 'precipitation' | 'temp';

const LocationOverview: FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [selectedMapLayer, setSelectedMapLayer] = useState<MapLayer>('temp');

  const weatherData = useAppSelector((state) =>
    state.weather.weatherData.find(
      (city) => `${city.coord.lat}:${city.coord.lon}` === locationId
    )
  );
  const forecastData = useAppSelector((state) => state.weather.forecastData);
  const airQualityData = useAppSelector(
    (state) => state.weather.airQualityData
  );
  const connectionStatus = useAppSelector(
    (state) => state.weather.connectionStatus
  );

  const { selectLocation } = useWeatherWebSocket();

  useEffect(() => {
    if (locationId) {
      selectLocation(locationId);
    }
    return () => {
      selectLocation(null);
    };
  }, [locationId, selectLocation]);

  if (connectionStatus === 'connecting' || !weatherData) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleMapLayerChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLayer: MapLayer
  ) => {
    if (newLayer !== null) {
      setSelectedMapLayer(newLayer);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box
        sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant='h4'
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
        >
          {weatherData.name}
        </Typography>
      </Box>

      <Grid2 container spacing={{ xs: 2, md: 3 }}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <CurrentWeatherCard weatherData={weatherData} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <WeatherDetailsCard weatherData={weatherData} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <SunTimesCard weatherData={weatherData} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          {airQualityData && <AirQualityCard data={airQualityData} />}
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <ForecastCard forecastData={forecastData} />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <WeatherMapCard
            center={[weatherData.coord.lat, weatherData.coord.lon]}
            selectedMapLayer={selectedMapLayer}
            onMapLayerChange={handleMapLayerChange}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default LocationOverview;
