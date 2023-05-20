import React, { PropsWithChildren } from "react";
import Map from "ol/Map";
import { Coordinate } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import { MapContext } from "./useMapContext";
import { TGeometry } from "../../types";

export const MapProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [map, setMap] = React.useState<Map | null>(null);
  const [previewGeoJson, setPreviewGeoJson] = React.useState<TGeometry | null>(
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
