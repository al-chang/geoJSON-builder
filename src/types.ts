type TCoordinate = [number, number];

type TPoint = {
  type: "Point";
  coordinates: TCoordinate;
};

type TMultiPoint = {
  type: "MultiPoint";
  coordinates: TCoordinate[];
};

type TLineString = {
  type: "LineString";
  coordinates: TCoordinate[];
};

type TMultiLineString = {
  type: "MultiLineString";
  coordinates: TCoordinate[][];
};

type TPolygon = {
  type: "Polygon";
  coordinates: TCoordinate[][];
};

type TMultiPolygon = {
  type: "MultiPolygon";
  coordinates: TCoordinate[][][];
};

export type TGeometry =
  | TPoint
  | TMultiPoint
  | TLineString
  | TMultiLineString
  | TPolygon
  | TMultiPolygon;

export type TGeometryType = TGeometry["type"];

export const metaSymbol = Symbol("meta");

export type TMetaProperties = {
  visible: boolean;
  uuid: string;
};

export type TProperties = {
  [metaSymbol]: TMetaProperties;
  [key: string]: string | number;
};

export type TFeature = {
  geometry: TGeometry;
  type: "Feature";
  properties: TProperties;
};

export type TFeatureCollection = {
  type: "FeatureCollection";
  features: TFeature[];
};

export type TSearchResponse = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  icon: string;
  geojson?: TGeometry;
};
