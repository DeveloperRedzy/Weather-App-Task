import { FC, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface WeatherMapProps {
  center: [number, number];
  layer: "clouds" | "precipitation" | "temp";
}

export const WeatherMap: FC<WeatherMapProps> = ({ center, layer }) => {
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(center, 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      // Add marker for the city location
      L.marker(center).addTo(mapRef.current);
    } else {
      mapRef.current.setView(center);
    }

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Remove previous weather layer
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    // OpenWeatherMap tile layer URL
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    let layerUrl = "";

    switch (layer) {
      case "temp":
        layerUrl = `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`;
        break;
      case "clouds":
        layerUrl = `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`;
        break;
      case "precipitation":
        layerUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`;
        break;
    }

    // Add new weather layer
    tileLayerRef.current = L.tileLayer(layerUrl, {
      opacity: 0.5,
    }).addTo(mapRef.current);
  }, [layer]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};
