import { createContext, useContext } from "react";
import Map from "ol/Map";
import { Coordinate } from "ol/coordinate";
import { TGeoJSON } from "../../types";

type TMapContext = {
  map: Map | null;
  previewGeoJson: TGeoJSON | null;
  center: Coordinate;
  zoom: number;
  setMap: (map: Map | null) => void;
  setPreviewGeoJson: (geoJson: TGeoJSON | null) => void;
  setCenter: (center: Coordinate) => void;
  setZoom: (zoom: number) => void;
};

export const MapContext = createContext<TMapContext>(null!);

export const useMapContext = () => {
  return useContext(MapContext);
};
