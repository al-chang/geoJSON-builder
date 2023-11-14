import React, { useRef, useEffect, useState } from "react";
import { View, Map as olMap } from "ol";

import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Attribution, Zoom } from "ol/control";
import "./index.css";
import useFeatureStore from "@/stores/featureStore";
import VectorLayer from "ol/layer/Vector";
import { featuresToVector, styleGeometry } from "@/utils";
import VectorSource from "ol/source/Vector";
import Geometry from "ol/geom/Geometry";
import useMapStore from "@/stores/mapStore";

// Controls are defined outside of the component
const zoomControl = new Zoom();

const attribution = new Attribution({ collapsible: false });

// Credit to https://medium.com/swlh/how-to-incorporate-openlayers-maps-into-react-65b411985744 for inspiration
const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<olMap | undefined>();
  const { features } = useFeatureStore();
  const { zoom, center } = useMapStore();

  // Initialize map on first render
  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map
    const _map = new olMap({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: [zoomControl, attribution],
      view: new View({
        center: [0, 0],
        zoom: 0,
        minZoom: 0,
        maxZoom: 28,
      }),
    });

    _map.setTarget(mapRef.current);
    setMap(_map);

    return () => _map.setTarget(undefined);
  }, []);

  // Update map view when props change
  useEffect(() => {
    map?.getView().setCenter(center);
    map?.getView().setZoom(zoom);
  }, [center, map, zoom]);

  // Add feature layers to map
  useEffect(() => {
    const layers: VectorLayer<VectorSource<Geometry>>[] = [];

    features
      .filter((feature) => feature.meta.visible)
      .forEach((feature) => {
        const vectorLayer = new VectorLayer({
          source: featuresToVector(feature),
          style: styleGeometry(feature.geometry.type),
        });
        map?.addLayer(vectorLayer);
        layers.push(vectorLayer);
      });

    return () => layers.forEach((layer) => map?.removeLayer(layer));
  }, [features, map]);

  return <div ref={mapRef} className="w-full h-full"></div>;
};

export default Map;
