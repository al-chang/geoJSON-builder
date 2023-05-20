import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { GeoJSON as GeoJSONFormat } from "ol/format";
import {
  TFeature,
  TSearchResponse,
  TFeatureCollection,
  TGeometry,
} from "./types";
import { get } from "ol/proj";
import { Coordinate } from "ol/coordinate";

export const osm = new OSM();

export const vector = (geoJSON: TFeatureCollection | TFeature | TGeometry) => {
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
      meta: {
        visible: true,
        uuid: crypto.randomUUID(),
      },
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

export const GeoJSONCenter = (geoJSON: TGeometry): Coordinate => {
  switch (geoJSON.type) {
    case "Point":
      return geoJSON.coordinates;
    case "MultiPoint": {
      const maxX = Math.max(...geoJSON.coordinates.map((c) => c[0]));
      const minX = Math.min(...geoJSON.coordinates.map((c) => c[0]));
      const maxY = Math.max(...geoJSON.coordinates.map((c) => c[1]));
      const minY = Math.min(...geoJSON.coordinates.map((c) => c[1]));
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
    case "LineString": {
      const maxX = Math.max(...geoJSON.coordinates.map((c) => c[0]));
      const minX = Math.min(...geoJSON.coordinates.map((c) => c[0]));
      const maxY = Math.max(...geoJSON.coordinates.map((c) => c[1]));
      const minY = Math.min(...geoJSON.coordinates.map((c) => c[1]));
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
    case "MultiLineString": {
      const maxX = Math.max(
        ...geoJSON.coordinates.map((c) => Math.max(...c.map((c) => c[0])))
      );
      const minX = Math.min(
        ...geoJSON.coordinates.map((c) => Math.min(...c.map((c) => c[0])))
      );
      const maxY = Math.max(
        ...geoJSON.coordinates.map((c) => Math.max(...c.map((c) => c[1])))
      );
      const minY = Math.min(
        ...geoJSON.coordinates.map((c) => Math.min(...c.map((c) => c[1])))
      );
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
    case "Polygon": {
      const maxX = Math.max(...geoJSON.coordinates[0].map((c) => c[0]));
      const minX = Math.min(...geoJSON.coordinates[0].map((c) => c[0]));
      const maxY = Math.max(...geoJSON.coordinates[0].map((c) => c[1]));
      const minY = Math.min(...geoJSON.coordinates[0].map((c) => c[1]));
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
    case "MultiPolygon": {
      const maxX = Math.max(
        ...geoJSON.coordinates.map((c) => Math.max(...c[0].map((c) => c[0])))
      );
      const minX = Math.min(
        ...geoJSON.coordinates.map((c) => Math.min(...c[0].map((c) => c[0])))
      );
      const maxY = Math.max(
        ...geoJSON.coordinates.map((c) => Math.max(...c[0].map((c) => c[1])))
      );
      const minY = Math.min(
        ...geoJSON.coordinates.map((c) => Math.min(...c[0].map((c) => c[1])))
      );
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
  }
};
