import { createContext, useContext } from "react";
import { FeatureCollection, SearchResponse } from "../../types";

type TBuilderContext = {
  featureCollection: FeatureCollection;
  addFeature: (searchResponse: SearchResponse) => void;
  removeFeature: (place_id: number) => void;
};

export const BuilderContext = createContext<TBuilderContext>(null!);

export const useBuilderContext = () => {
  return useContext(BuilderContext);
};
