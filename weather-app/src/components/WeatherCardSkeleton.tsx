import { FC } from "react";
import { Card, CardContent, Skeleton, Box, Grid2 } from "@mui/material";

interface WeatherCardSkeletonProps {
  count?: number;
}

export const WeatherCardSkeleton: FC<WeatherCardSkeletonProps> = ({
  count = 3,
}) => {
  return (
    <Grid2 container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={index}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={32}
                  sx={{ flexGrow: 1 }}
                />
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
              <Skeleton variant="text" width="40%" sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="45%" />
              <Skeleton variant="text" width="40%" />
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};
