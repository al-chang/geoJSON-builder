import React, { useRef, useEffect } from "react";
import { View, Map as olMap } from "ol";

import "./Map.css";
import Layers from "../Layers/Layers";
import TileLayer from "../Layers/TileLayer";
import Controls from "../Controls/Controls";
import FullScreenControl from "../Controls/FullScreenControl";
import { osm, vector } from "../../util";
import { useMapContext } from "../../hooks/useMap";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import VectorLayer from "../Layers/VectorLayer";
import { useBuilderContext } from "../../hooks/useBuilder";
import { GeoJSONType } from "../../types";
import styled from "styled-components";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const styles: Record<GeoJSONType, Style> = {
  MultiPolygon: new Style({
    stroke: new Stroke({ color: "blue", width: 1 }),
    fill: new Fill({ color: "rgba(0, 0, 255, 0.1)" }),
  }),
  Polygon: new Style({
    stroke: new Stroke({ color: "blue", width: 1 }),
    fill: new Fill({ color: "rgba(0, 0, 255, 0.1)" }),
  }),
  Point: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: "rgba(0, 0, 255, 0.1)" }),
      stroke: new Stroke({ color: "red", width: 1 }),
    }),
  }),
};

const previewStyles: Record<GeoJSONType, Style> = {
  MultiPolygon: new Style({
    stroke: new Stroke({ color: "red", width: 1 }),
    fill: new Fill({ color: "rgba(255, 0, 0, 0.1)" }),
  }),
  Polygon: new Style({
    stroke: new Stroke({ color: "red", width: 1 }),
    fill: new Fill({ color: "rgba(255, 0, 0, 0.1)" }),
  }),
  Point: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: "rgba(255, 0, 0, 0.1)" }),
      stroke: new Stroke({ color: "red", width: 1 }),
    }),
  }),
};

// Credit to https://medium.com/swlh/how-to-incorporate-openlayers-maps-into-react-65b411985744 for inspiration
const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, setMap, previewGeoJson, center, zoom } = useMapContext();
  const { featureCollection } = useBuilderContext();

  // Initialize map on first render
  useEffect(() => {
    const options = {
      view: new View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: [],
    };

    const mapObject = new olMap(options);
    mapObject.setTarget(mapRef.current!);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, [center, zoom, setMap]);

  // Update map if center or zoom change
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
    map.getView().setZoom(zoom);
  }, [center, zoom, map]);

  return (
    <MapContainer ref={mapRef}>
      <Layers>
        <TileLayer source={osm} zIndex={0} />
        {featureCollection.features.map((feature) => (
          <VectorLayer
            key={feature.properties.place_id}
            source={vector(feature.geometry)}
            style={styles[feature.geometry.type]}
          />
        ))}
        {previewGeoJson && (
          <VectorLayer
            source={vector(previewGeoJson)}
            style={previewStyles[previewGeoJson.type]}
            editable
          />
        )}
      </Layers>
      <Controls>
        <FullScreenControl />
      </Controls>
    </MapContainer>
  );
};

export default Map;
