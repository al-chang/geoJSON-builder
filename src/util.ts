import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { GeoJSON as GeoJSONFormat } from "ol/format";
import {
  TFeature,
  TGeoJSON,
  TSearchResponse,
  GeoJSONType,
  TFeatureCollection,
} from "./types";
import { get } from "ol/proj";
import { Coordinate } from "ol/coordinate";

export const osm = new OSM();

export const vector = (geoJSON: TFeatureCollection | TFeature | TGeoJSON) => {
  return new VectorSource({
    features: new GeoJSONFormat().readFeatures(geoJSON, {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      featureProjection: get("EPSG:3857")!,
    }),
  });
};

export const searchResponseToFeature = (
  searchResponse: TSearchResponse
): TFeature => {
  return {
    geometry: searchResponse.geojson,
    type: "Feature",
    properties: {
      name: searchResponse.display_name,
      place_id: searchResponse.place_id,
      osm_id: searchResponse.osm_id,
    },
    meta: {
      visible: true,
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

export const GeoJSONCenter = (geoJSON: TGeoJSON): Coordinate => {
  // TODO: Implement for other GeoJSON types
  switch (geoJSON.type) {
    // case GeoJSONType.Point:
    //   return geoJSON.coordinates;
    // case GeoJSONType.MultiPolygon:
    //   return GeoJSONCenter({
    //     type: GeoJSONType.Polygon,
    //     coordinates: geoJSON.coordinates[0],
    //   });
    case GeoJSONType.Polygon: {
      const maxX = Math.max(...geoJSON.coordinates[0].map((c) => c[0]));
      const minX = Math.min(...geoJSON.coordinates[0].map((c) => c[0]));
      const maxY = Math.max(...geoJSON.coordinates[0].map((c) => c[1]));
      const minY = Math.min(...geoJSON.coordinates[0].map((c) => c[1]));
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
    default:
      throw new Error(`Unknown GeoJSON type: ${geoJSON.type}`);
  }
};
