import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { GeoJSON as GeoJSONFormat } from "ol/format";
import { Feature, GeoJSON, SearchResponse } from "./types";
import { get } from "ol/proj";

export const osm = new OSM();

export const vector = (geoJSON: GeoJSON) => {
  return new VectorSource({
    features: new GeoJSONFormat().readFeatures(geoJSON, {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      featureProjection: get("EPSG:3857")!,
    }),
  });
};

export const searchResponseToFeature = (
  searchResponse: SearchResponse
): Feature => {
  return {
    geometry: searchResponse.geojson,
    type: "Feature",
    properties: {
      name: searchResponse.display_name,
      place_id: searchResponse.place_id,
      osm_id: searchResponse.osm_id,
    },
  };
};

export const dimensionsFromBoundingBox = (boundingBox: number[]) => {
  const [minX, minY, maxX, maxY] = boundingBox;
  return [Math.abs(maxX - minX), Math.abs(maxY - minY)];
};

export const areaFromBoundingBox = (boundingBox: number[]) => {
  const [minX, minY, maxX, maxY] = boundingBox;
  return Math.abs(maxX - minX) * Math.abs(maxY - minY);
};
