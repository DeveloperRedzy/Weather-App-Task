import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from '@mui/icons-material';
import { Box, TextField } from '@mui/material';
import { WeatherAddCityDialog } from '../components/WeatherAddCityDialog';
import { WeatherCityCards } from '../components/WeatherCityCards';

const Dashboard: FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: 4 }}>
        <Search sx={{ color: 'primary', mr: 1, my: 0.5 }} />
        <TextField
          id='search'
          label={t('search')}
          variant='standard'
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete='off'
        />
        <WeatherAddCityDialog />
      </Box>
      <WeatherCityCards searchQuery={searchQuery} />
    </Box>
  );
};

export default Dashboard;
