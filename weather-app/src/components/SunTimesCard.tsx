import { FC } from "react";
import { Card, CardContent, Typography, Grid2 } from "@mui/material";
import type { WeatherData } from "@/types/weather";
import { useTranslation } from "react-i18next";

interface SunTimesCardProps {
  weatherData: WeatherData;
}

export const SunTimesCard: FC<SunTimesCardProps> = ({ weatherData }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("sunTimes.title")}
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6 }}>
            <Typography color="text.secondary">
              {t("sunTimes.sunrise")}
            </Typography>
            <Typography variant="h6">
              {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Typography color="text.secondary">
              {t("sunTimes.sunset")}
            </Typography>
            <Typography variant="h6">
              {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
            </Typography>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};
