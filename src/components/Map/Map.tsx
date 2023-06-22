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
import styled from "styled-components";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import { useMapContext } from "../../contexts/Map/useMapContext";
import { TGeometryType, metaSymbol } from "../../types";
import ZoomSlider from "../Controls/ZoomSlider";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const style = (
  geometryType: TGeometryType,
  { red, green, blue } = { red: 0, green: 0, blue: 255 }
): Style => {
  switch (geometryType) {
    case "Point":
      return new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: `rgba(${red}, ${green}, ${blue}, 0.1)` }),
          stroke: new Stroke({
            color: `rgb(${red}, ${green}, ${blue})`,
            width: 1,
          }),
        }),
      });
    case "LineString":
      return new Style({
        stroke: new Stroke({
          color: `rgb(${red}, ${green}, ${blue})`,
          width: 1,
        }),
      });
    case "Polygon":
      return new Style({
        fill: new Fill({ color: `rgba(${red}, ${green}, ${blue}, 0.1)` }),
        stroke: new Stroke({
          color: `rgb(${red}, ${green}, ${blue})`,
          width: 1,
        }),
      });
    case "MultiPoint":
      return new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: `rgba(${red}, ${green}, ${blue}, 0.1)` }),
          stroke: new Stroke({
            color: `rgb(${red}, ${green}, ${blue})`,
            width: 1,
          }),
        }),
      });
    case "MultiLineString":
      return new Style({
        stroke: new Stroke({
          color: `rgb(${red}, ${green}, ${blue})`,
          width: 1,
        }),
      });
    case "MultiPolygon":
      return new Style({
        fill: new Fill({ color: `rgba(${red}, ${green}, ${blue}, 0.1)` }),
        stroke: new Stroke({
          color: `rgb(${red}, ${green}, ${blue})`,
          width: 1,
        }),
      });
    default:
      throw new Error(`Unsupported geometry type: ${geometryType}`);
  }
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
            key={feature.properties[metaSymbol].uuid}
            source={vector(feature)}
            style={style(feature.geometry.type)}
            editable={editMode}
            visible={feature.properties[metaSymbol].visible}
          />
        ))}
        {previewGeoJson && (
          <VectorLayer
            source={vector(previewGeoJson)}
            style={style(previewGeoJson.type, { red: 255, green: 0, blue: 0 })}
          />
        )}
      </Layers>
      <Controls>
        <FullScreenControl />
        <ZoomSlider />
      </Controls>
    </MapContainer>
  );
};

export default Map;
