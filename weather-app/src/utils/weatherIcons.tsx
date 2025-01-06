import { FC } from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";

export const getWeatherIcon = (iconCode: string) => {
  // OpenWeather icon codes: https://openweathermap.org/weather-conditions
  const iconMap: { [key: string]: FC } = {
    "01d": () => <WbSunnyIcon sx={{ fontSize: 40, color: "#FFB300" }} />, // clear sky day
    "01n": () => <WbSunnyIcon sx={{ fontSize: 40, color: "#FFA000" }} />, // clear sky night
    "02d": () => <FilterDramaIcon sx={{ fontSize: 40, color: "#90CAF9" }} />, // few clouds day
    "02n": () => <FilterDramaIcon sx={{ fontSize: 40, color: "#64B5F6" }} />, // few clouds night
    "03d": () => <CloudIcon sx={{ fontSize: 40, color: "#78909C" }} />, // scattered clouds
    "03n": () => <CloudIcon sx={{ fontSize: 40, color: "#78909C" }} />,
    "04d": () => <CloudIcon sx={{ fontSize: 40, color: "#546E7A" }} />, // broken clouds
    "04n": () => <CloudIcon sx={{ fontSize: 40, color: "#546E7A" }} />,
    "09d": () => <WaterDropIcon sx={{ fontSize: 40, color: "#4FC3F7" }} />, // shower rain
    "09n": () => <WaterDropIcon sx={{ fontSize: 40, color: "#4FC3F7" }} />,
    "10d": () => <WaterDropIcon sx={{ fontSize: 40, color: "#039BE5" }} />, // rain
    "10n": () => <WaterDropIcon sx={{ fontSize: 40, color: "#039BE5" }} />,
    "11d": () => <ThunderstormIcon sx={{ fontSize: 40, color: "#FFD600" }} />, // thunderstorm
    "11n": () => <ThunderstormIcon sx={{ fontSize: 40, color: "#FFD600" }} />,
    "13d": () => <AcUnitIcon sx={{ fontSize: 40, color: "#90A4AE" }} />, // snow
    "13n": () => <AcUnitIcon sx={{ fontSize: 40, color: "#90A4AE" }} />,
  };

  const IconComponent = iconMap[iconCode] || iconMap["01d"];
  return <IconComponent />;
};
