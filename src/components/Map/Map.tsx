import React, { useRef, useEffect } from "react";
import { View, Map as olMap } from "ol";

import "./Map.css";
import Layers from "../Layers/Layers";
import TileLayer from "../Layers/TileLayer";
import Controls from "../Controls/Controls";
import FullScreenControl from "../Controls/FullScreenControl";
import { osm, vector } from "../../util";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import VectorLayer from "../Layers/VectorLayer";
import { GeoJSONType } from "../../types";
import styled from "styled-components";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import { useMapContext } from "../../contexts/Map/useMapContext";

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
  const { featureCollection, editMode } = useBuilderContext();

  // Initialize map on first render
  useEffect(() => {
    if (!mapRef.current) return;

    const options = {
      view: new View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: [],
    };

    const mapObject = new olMap(options);
    mapObject.setTarget(mapRef.current);
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
            source={vector(feature)}
            style={styles[feature.geometry.type]}
            editable={editMode}
            visible={feature.meta.visible}
          />
        ))}
        {previewGeoJson && (
          <VectorLayer
            source={vector(previewGeoJson)}
            style={previewStyles[previewGeoJson.type]}
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
