import { FC } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";
import { WeatherMap } from "./WeatherMap";
import { useTranslation } from "react-i18next";

type MapLayer = "clouds" | "precipitation" | "temp";

interface WeatherMapCardProps {
  center: [number, number];
  selectedMapLayer: MapLayer;
  onMapLayerChange: (
    event: React.MouseEvent<HTMLElement>,
    newLayer: MapLayer,
  ) => void;
}

export const WeatherMapCard: FC<WeatherMapCardProps> = ({
  center,
  selectedMapLayer,
  onMapLayerChange,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
          }}
        >
          <Typography variant="h6">{t("weatherMap.title")}</Typography>
          <ToggleButtonGroup
            value={selectedMapLayer}
            exclusive
            onChange={onMapLayerChange}
            size="small"
            sx={{
              flexWrap: "wrap",
              "& .MuiToggleButton-root": {
                flex: { xs: 1, sm: "initial" },
              },
            }}
          >
            <ToggleButton value="temp">
              {t("weatherMap.temperature")}
            </ToggleButton>
            <ToggleButton value="clouds">{t("weatherMap.clouds")}</ToggleButton>
            <ToggleButton value="precipitation">
              {t("weatherMap.precipitation")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Paper sx={{ height: { xs: 300, sm: 400 } }}>
          <WeatherMap center={center} layer={selectedMapLayer} />
        </Paper>
      </CardContent>
    </Card>
  );
};