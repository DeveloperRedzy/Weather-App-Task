import { FC, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Autocomplete,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useWeatherWebSocket } from '../hooks/useWeatherWebSocket';
import { useTranslation } from 'react-i18next';
import { useRetry } from '../hooks/useRetry';

interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const SnackbarAlert = ({
  open,
  onClose,
  severity,
  message,
}: {
  open: boolean;
  onClose: () => void;
  severity: 'success' | 'warning';
  message: string;
}) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export const WeatherAddCityDialog: FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [options, setOptions] = useState<GeocodingResult[]>([]);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addWeatherLocation, locations } = useWeatherWebSocket();
  const { t } = useTranslation();
  const { executeWithRetry } = useRetry();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSearchTerm('');
    setOptions([]);
  };

  const searchCities = async (input: string) => {
    if (!input.trim() || input.length < 2) return;

    setIsSearching(true);
    try {
      const response = (await executeWithRetry(() =>
        fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        )
      )) as Response;
      const data = (await response.json()) as GeocodingResult[];
      setOptions(data);
    } catch (error) {
      console.error('Error searching for city:', error);
      setOptions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (_event: any, newValue: string) => {
    setSearchTerm(newValue);
    if (newValue) {
      searchCities(newValue);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (_event: any, value: GeocodingResult | null) => {
    if (value) {
      const locationKey = `${value.lat}:${value.lon}`;
      if (locations.includes(locationKey)) {
        setShowError(true);
        setSearchTerm('');
        setOptions([]);
      } else {
        addWeatherLocation(locationKey);
        setShowSuccess(true);
        handleDialogClose();
      }
    }
  };

  return (
    <>
      <Button
        variant='outlined'
        onClick={handleDialogOpen}
        startIcon={<Add />}
        sx={{ width: '200px', ml: 2 }}
        disableRipple
      >
        {t('addCity.button')}
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby='add-city-dialog-title'
        keepMounted={false}
        maxWidth='sm'
        PaperProps={{
          sx: {
            width: '100%',
            m: 2,
          },
        }}
      >
        <DialogTitle id='add-city-dialog-title'>
          {t('addCity.title')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              fullWidth
              autoComplete
              includeInputInList
              filterSelectedOptions
              loading={isSearching}
              options={options}
              value={null}
              inputValue={searchTerm}
              onInputChange={handleInputChange}
              onChange={handleSelect}
              getOptionLabel={(option) =>
                `${option.name}${option.state ? `, ${option.state}` : ''}, ${option.country}`
              }
              isOptionEqualToValue={(option, value) =>
                option.lat === value.lat && option.lon === value.lon
              }
              renderOption={(props, option) => (
                <li
                  {...props}
                  key={`${option.name}-${option.country}-${option.lat}-${option.lon}`}
                >
                  {`${option.name}${option.state ? `, ${option.state}` : ''}, ${option.country}`}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('addCity.searchPlaceholder')}
                  variant='outlined'
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isSearching && (
                          <CircularProgress color='inherit' size={20} />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  autoFocus
                />
              )}
              noOptionsText={t('addCity.noResults')}
              loadingText={t('addCity.searching')}
            />
          </Box>
        </DialogContent>
      </Dialog>
      <SnackbarAlert
        open={showError}
        onClose={() => setShowError(false)}
        severity='warning'
        message={t('addCity.alreadyAdded')}
      />
      <SnackbarAlert
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        severity='success'
        message={t('addCity.successfullyAdded')}
      />
    </>
  );
};
