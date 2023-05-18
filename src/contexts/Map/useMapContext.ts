import { createContext, useContext } from "react";
import Map from "ol/Map";
import { Coordinate } from "ol/coordinate";
import { GeoJSON } from "../../types";

type TMapContext = {
  map: Map | null;
  previewGeoJson: GeoJSON | null;
  center: Coordinate;
  zoom: number;
  setMap: (map: Map | null) => void;
  setPreviewGeoJson: (geoJson: GeoJSON | null) => void;
  setCenter: (center: Coordinate) => void;
  setZoom: (zoom: number) => void;
};

export const MapContext = createContext<TMapContext>(null!);

export const useMapContext = () => {
  return useContext(MapContext);
};
