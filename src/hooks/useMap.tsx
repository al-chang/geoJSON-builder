import React, { PropsWithChildren, createContext, useContext } from "react";
import Map from "ol/Map";
import { Coordinate } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import { GeoJSON } from "../types";

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

const MapContext = createContext<TMapContext>(null!);

export const useMapContext = () => {
  return useContext(MapContext);
};

export const MapProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [map, setMap] = React.useState<Map | null>(null);
  const [previewGeoJson, setPreviewGeoJson] = React.useState<GeoJSON | null>(
    null
  );
  const [center, setCenter] = React.useState<Coordinate>(
    fromLonLat([-71.060511, 42.3554334])
  );
  const [zoom, setZoom] = React.useState<number>(9);

  return (
    <MapContext.Provider
      value={{
        map,
        previewGeoJson,
        center,
        zoom,
        setMap,
        setPreviewGeoJson,
        setCenter,
        setZoom,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
