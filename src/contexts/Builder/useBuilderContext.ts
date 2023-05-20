import { createContext, useContext } from "react";
import { TFeatureCollection, TSearchResponse } from "../../types";

type TBuilderContext = {
  featureCollection: Readonly<TFeatureCollection>;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  saveEdits: () => void;
  addFeature: (searchResponse: TSearchResponse) => void;
  removeFeature: (id: string) => void;
  toggleFeatureVisibility: (id: string) => void;
  exportFeatureCollection: () => void;
};

export const BuilderContext = createContext<TBuilderContext>(null!);

export const useBuilderContext = () => {
  return useContext(BuilderContext);
};
