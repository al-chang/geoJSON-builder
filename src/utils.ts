import { Style, Fill, Stroke } from "ol/style";
import CircleStyle from "ol/style/Circle";
import {
  TFeature,
  TFeatureCollection,
  TGeometry,
  TGeometryType,
} from "./types";
import { get } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Coordinate } from "ol/coordinate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const f = (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
  f.cancel = () => clearTimeout(timeout);
  return f;
};

export const geometryToFeature = (
  geometry: TGeometry,
  properties?: { [key: string]: string | number }
): TFeature => ({
  geometry: geometry,
  type: "Feature",
  properties: properties ?? {},
  meta: {
    visible: true,
    uuid: crypto.randomUUID(),
  },
});

// Utility function for deter
export const styleGeometry = (
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

// Convert a feature to a vector to be rendered on the map
export const featuresToVector = (
  geoJSON: TFeatureCollection | TFeature | TGeometry
) => {
  return new VectorSource({
    features: new GeoJSON().readFeatures(geoJSON, {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      featureProjection: get("EPSG:3857")!,
    }),
  });
};

// Returns the center of a geometry
export const geometryCenter = (geometry: TGeometry): Coordinate => {
  switch (geometry.type) {
    case "Point":
      return geometry.coordinates;
    case "MultiPoint": {
      const maxX = Math.max(...geometry.coordinates.map((c) => c[0]));
      const minX = Math.min(...geometry.coordinates.map((c) => c[0]));
      const maxY = Math.max(...geometry.coordinates.map((c) => c[1]));
      const minY = Math.min(...geometry.coordinates.map((c) => c[1]));
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
    case "LineString": {
      const maxX = Math.max(...geometry.coordinates.map((c) => c[0]));
      const minX = Math.min(...geometry.coordinates.map((c) => c[0]));
      const maxY = Math.max(...geometry.coordinates.map((c) => c[1]));
      const minY = Math.min(...geometry.coordinates.map((c) => c[1]));
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
    case "MultiLineString": {
      const maxX = Math.max(
        ...geometry.coordinates.map((c) => Math.max(...c.map((c) => c[0])))
      );
      const minX = Math.min(
        ...geometry.coordinates.map((c) => Math.min(...c.map((c) => c[0])))
      );
      const maxY = Math.max(
        ...geometry.coordinates.map((c) => Math.max(...c.map((c) => c[1])))
      );
      const minY = Math.min(
        ...geometry.coordinates.map((c) => Math.min(...c.map((c) => c[1])))
      );
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
    case "Polygon": {
      const maxX = Math.max(...geometry.coordinates[0].map((c) => c[0]));
      const minX = Math.min(...geometry.coordinates[0].map((c) => c[0]));
      const maxY = Math.max(...geometry.coordinates[0].map((c) => c[1]));
      const minY = Math.min(...geometry.coordinates[0].map((c) => c[1]));
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
    case "MultiPolygon": {
      const maxX = Math.max(
        ...geometry.coordinates.map((c) => Math.max(...c[0].map((c) => c[0])))
      );
      const minX = Math.min(
        ...geometry.coordinates.map((c) => Math.min(...c[0].map((c) => c[0])))
      );
      const maxY = Math.max(
        ...geometry.coordinates.map((c) => Math.max(...c[0].map((c) => c[1])))
      );
      const minY = Math.min(
        ...geometry.coordinates.map((c) => Math.min(...c[0].map((c) => c[1])))
      );
      return [(maxX + minX) / 2, (maxY + minY) / 2];
    }
  }
};

// Calculates the bounding box of a given geometry - bounding box is the smallest box that contains all points
export const calculateBoundingBox = (
  geometry: TGeometry
): { minX: number; minY: number; maxX: number; maxY: number } => {
  switch (geometry.type) {
    case "Point":
      return {
        minX: geometry.coordinates[0],
        minY: geometry.coordinates[1],
        maxX: geometry.coordinates[0],
        maxY: geometry.coordinates[1],
      };
    case "MultiPoint": {
      const maxX = Math.max(...geometry.coordinates.map((c) => c[0]));
      const minX = Math.min(...geometry.coordinates.map((c) => c[0]));
      const maxY = Math.max(...geometry.coordinates.map((c) => c[1]));
      const minY = Math.min(...geometry.coordinates.map((c) => c[1]));
      return { minX, minY, maxX, maxY };
    }
    case "LineString": {
      const maxX = Math.max(...geometry.coordinates.map((c) => c[0]));
      const minX = Math.min(...geometry.coordinates.map((c) => c[0]));
      const maxY = Math.max(...geometry.coordinates.map((c) => c[1]));
      const minY = Math.min(...geometry.coordinates.map((c) => c[1]));
      return { minX, minY, maxX, maxY };
    }
    case "MultiLineString": {
      const maxX = Math.max(
        ...geometry.coordinates.map((c) => Math.max(...c.map((c) => c[0])))
      );
      const minX = Math.min(
        ...geometry.coordinates.map((c) => Math.min(...c.map((c) => c[0])))
      );
      const maxY = Math.max(
        ...geometry.coordinates.map((c) => Math.max(...c.map((c) => c[1])))
      );
      const minY = Math.min(
        ...geometry.coordinates.map((c) => Math.min(...c.map((c) => c[1])))
      );
      return { minX, minY, maxX, maxY };
    }
    case "Polygon": {
      const maxX = Math.max(...geometry.coordinates[0].map((c) => c[0]));
      const minX = Math.min(...geometry.coordinates[0].map((c) => c[0]));
      const maxY = Math.max(...geometry.coordinates[0].map((c) => c[1]));
      const minY = Math.min(...geometry.coordinates[0].map((c) => c[1]));
      return { minX, minY, maxX, maxY };
    }
    case "MultiPolygon": {
      const maxX = Math.max(
        ...geometry.coordinates.map((c) => Math.max(...c[0].map((c) => c[0])))
      );
      const minX = Math.min(
        ...geometry.coordinates.map((c) => Math.min(...c[0].map((c) => c[0])))
      );
      const maxY = Math.max(
        ...geometry.coordinates.map((c) => Math.max(...c[0].map((c) => c[1])))
      );
      const minY = Math.min(
        ...geometry.coordinates.map((c) => Math.min(...c[0].map((c) => c[1])))
      );
      return { minX, minY, maxX, maxY };
    }
  }
};

// Returns a value to represent the desired zoom, given a bounding box
export const calculateZoomFromBoundingBox = ({
  minX,
  minY,
  maxX,
  maxY,
}: {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}): number => {
  const diffX = Math.abs(maxX - minX);
  const diffY = Math.abs(maxY - minY);
  const diff = Math.max(diffX, diffY);
  return Math.min(Math.log2(360 / diff), 20);
};
