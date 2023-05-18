export type Feature = {
  geometry: GeoJSON;
  type: "Feature";
  properties: Record<string, string | number>;
};

export type FeatureCollection = {
  type: "FeatureCollection";
  features: Feature[];
};

export enum GeoJSONType {
  Point = "Point",
  MultiPolygon = "MultiPolygon",
  Polygon = "Polygon",
}

export type GeoJSON = {
  type: GeoJSONType;
  coordinates: number[][][];
};

export type SearchResponse = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  icon: string;
  geojson: GeoJSON;
};
