import { createContext, useContext } from "react";
import Map from "ol/Map";
import { Coordinate } from "ol/coordinate";
import { TGeometry } from "../../types";

type TMapContext = {
  map: Map | null;
  previewGeoJson: TGeometry | null;
  center: Coordinate;
  zoom: number;
  setMap: (map: Map | null) => void;
  setPreviewGeoJson: (geoJson: TGeometry | null) => void;
  setCenter: (center: Coordinate) => void;
  setZoom: (zoom: number) => void;
};

export const MapContext = createContext<TMapContext>(null!);

export const useMapContext = () => {
  return useContext(MapContext);
};
