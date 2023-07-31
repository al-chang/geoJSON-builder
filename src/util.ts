import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { GeoJSON as GeoJSONFormat } from "ol/format";
import {
  TFeature,
  TSearchResponse,
  TFeatureCollection,
  TGeometry,
  metaSymbol,
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
  properties: {
    ...properties,
    [metaSymbol]: {
      visible: true,
      uuid: crypto.randomUUID(),
    },
  },
});

export const dimensionsFromBoundingBox = (boundingBox: number[]) => {
  const [minX, minY, maxX, maxY] = boundingBox;
  return [Math.abs(maxX - minX), Math.abs(maxY - minY)];
};

export const areaFromBoundingBox = (boundingBox: number[]) => {
  const [minX, minY, maxX, maxY] = boundingBox;
  return Math.abs(maxX - minX) * Math.abs(maxY - minY);
};

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
  return Math.log2(360 / diff);
};
