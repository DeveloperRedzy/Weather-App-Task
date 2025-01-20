import { FC, useState, useCallback, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addLocationThunk } from '../store/features/weatherSlice';
import { showSnackbar } from '../store/features/uiSlice';
import { useTranslation } from 'react-i18next';

interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export const WeatherAddCityDialog: FC = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const savedLocations = useAppSelector(
    (state) => state.weather.savedLocations
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(t('addCity.searchError'));
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError(t('addCity.searchError'));
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const handleAddCity = async (city: City) => {
    const cityLocationString = `${city.lat}:${city.lon}`;
    if (savedLocations.includes(cityLocationString)) {
      dispatch(
        showSnackbar({
          message: t('addCity.alreadyAdded'),
          severity: 'error',
        })
      );
      return;
    }

    try {
      await dispatch(
        addLocationThunk({ lat: city.lat, lon: city.lon })
      ).unwrap();
      dispatch(
        showSnackbar({
          message: t('addCity.successfullyAdded'),
          severity: 'success',
        })
      );
      handleClose();
    } catch (error) {
      dispatch(
        showSnackbar({
          message: t('addCity.error'),
          severity: 'error',
        })
      );
    }
  };

  return (
    <>
      <IconButton
        color='primary'
        onClick={handleOpen}
        sx={{ position: 'fixed', right: 20, bottom: 20 }}
      >
        <AddIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>{t('addCity.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
            <Autocomplete
              fullWidth
              freeSolo
              options={searchResults}
              getOptionLabel={(option) =>
                typeof option === 'string'
                  ? option
                  : `${option.name}, ${option.country}`
              }
              filterOptions={(x) => x}
              loading={loading}
              loadingText={t('addCity.searching')}
              noOptionsText={
                searchQuery
                  ? t('addCity.noResults')
                  : t('addCity.searchPlaceholder')
              }
              renderOption={(props, option) => (
                <li {...props} key={props.id}>
                  {`${option.name}, ${option.country}`}
                </li>
              )}
              onInputChange={(_, newValue) => {
                setSearchQuery(newValue);
              }}
              onChange={(_, newValue) => {
                if (newValue && typeof newValue !== 'string') {
                  handleAddCity(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('addCity.searchPlaceholder')}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color='inherit' size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
