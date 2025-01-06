import { FC } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import type { WeatherData } from "@/types/weather";
import { getWeatherIcon } from "../utils/weatherIcons";
import { useTranslation } from "react-i18next";

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
}

export const CurrentWeatherCard: FC<CurrentWeatherCardProps> = ({
  weatherData,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            {t("currentWeather.title")}
          </Typography>
          {getWeatherIcon(weatherData.weather[0].icon)}
        </Box>
        <Typography
          variant="h3"
          sx={{ mb: 2, fontSize: { xs: "2rem", sm: "3rem" } }}
        >
          {Math.round(weatherData.main.temp)}°C
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {weatherData.weather[0].description}
        </Typography>
        <Typography variant="body1">
          {t("currentWeather.feelsLike")}:{" "}
          {Math.round(weatherData.main.feels_like)}°C
        </Typography>
      </CardContent>
    </Card>
  );
};
