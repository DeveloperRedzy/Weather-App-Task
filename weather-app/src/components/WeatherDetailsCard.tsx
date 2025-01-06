import { FC } from "react";
import { Card, CardContent, Typography, Grid2 } from "@mui/material";
import type { WeatherData } from "@/types/weather";
import { useTranslation } from "react-i18next";

interface WeatherDetailsCardProps {
  weatherData: WeatherData;
}

export const WeatherDetailsCard: FC<WeatherDetailsCardProps> = ({
  weatherData,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("weatherDetails.title")}
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6 }}>
            <Typography color="text.secondary">
              {t("weatherDetails.humidity")}
            </Typography>
            <Typography variant="h6">{weatherData.main.humidity}%</Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography color="text.secondary">
              {t("weatherDetails.pressure")}
            </Typography>
            <Typography variant="h6">
              {weatherData.main.pressure} hPa
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography color="text.secondary">
              {t("weatherDetails.windSpeed")}
            </Typography>
            <Typography variant="h6">{weatherData.wind.speed} m/s</Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography color="text.secondary">
              {t("weatherDetails.windDirection")}
            </Typography>
            <Typography variant="h6">{weatherData.wind.deg}°</Typography>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};
