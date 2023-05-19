import { createContext, useContext } from "react";
import { TFeatureCollection, TSearchResponse } from "../../types";

type TBuilderContext = {
  featureCollection: TFeatureCollection;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  saveEdits: () => void;
  addFeature: (searchResponse: TSearchResponse) => void;
  removeFeature: (place_id: number) => void;
  toggleFeatureVisibility: (place_id: number) => void;
  exportFeatureCollection: () => void;
};

export const BuilderContext = createContext<TBuilderContext>(null!);

export const useBuilderContext = () => {
  return useContext(BuilderContext);
};
