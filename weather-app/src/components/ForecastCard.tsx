import { FC } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { ForecastChart } from "./ForecastChart";
import { ForecastData } from "../store/features/weatherSlice";
import { useTranslation } from "react-i18next";

interface ForecastCardProps {
  forecastData: ForecastData | null;
}

export const ForecastCard: FC<ForecastCardProps> = ({ forecastData }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("forecast.title")}
        </Typography>
        {forecastData && <ForecastChart data={forecastData} />}
      </CardContent>
    </Card>
  );
};
