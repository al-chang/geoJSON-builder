export type TMetaProperties = {
  visible: boolean;
};

export type TFeature = {
  geometry: TGeoJSON;
  type: "Feature";
  properties: Record<string, string | number>;
  meta: TMetaProperties;
};

export type TFeatureCollection = {
  type: "FeatureCollection";
  features: TFeature[];
};

export enum GeoJSONType {
  Point = "Point",
  MultiPolygon = "MultiPolygon",
  Polygon = "Polygon",
}

export type TGeoJSON = {
  type: GeoJSONType;
  coordinates: number[][][];
};

export type TSearchResponse = {
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
  geojson: TGeoJSON;
};
