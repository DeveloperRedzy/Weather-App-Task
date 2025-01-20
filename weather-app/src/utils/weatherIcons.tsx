import { FC } from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';

export const getWeatherIcon = (iconCode: string) => {
  const iconMap: { [key: string]: FC } = {
    '01d': () => <WbSunnyIcon sx={{ fontSize: 40, color: '#FFB300' }} />,
    '01n': () => <WbSunnyIcon sx={{ fontSize: 40, color: '#FFA000' }} />,
    '02d': () => <FilterDramaIcon sx={{ fontSize: 40, color: '#90CAF9' }} />,
    '02n': () => <FilterDramaIcon sx={{ fontSize: 40, color: '#64B5F6' }} />,
    '03d': () => <CloudIcon sx={{ fontSize: 40, color: '#78909C' }} />,
    '03n': () => <CloudIcon sx={{ fontSize: 40, color: '#78909C' }} />,
    '04d': () => <CloudIcon sx={{ fontSize: 40, color: '#546E7A' }} />,
    '04n': () => <CloudIcon sx={{ fontSize: 40, color: '#546E7A' }} />,
    '09d': () => <WaterDropIcon sx={{ fontSize: 40, color: '#4FC3F7' }} />,
    '09n': () => <WaterDropIcon sx={{ fontSize: 40, color: '#4FC3F7' }} />,
    '10d': () => <WaterDropIcon sx={{ fontSize: 40, color: '#039BE5' }} />,
    '10n': () => <WaterDropIcon sx={{ fontSize: 40, color: '#039BE5' }} />,
    '11d': () => <ThunderstormIcon sx={{ fontSize: 40, color: '#FFD600' }} />,
    '11n': () => <ThunderstormIcon sx={{ fontSize: 40, color: '#FFD600' }} />,
    '13d': () => <AcUnitIcon sx={{ fontSize: 40, color: '#90A4AE' }} />,
    '13n': () => <AcUnitIcon sx={{ fontSize: 40, color: '#90A4AE' }} />,
  };

  const IconComponent = iconMap[iconCode] || iconMap['01d'];
  return <IconComponent />;
};
