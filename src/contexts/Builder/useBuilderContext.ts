import { createContext, useContext } from "react";
import { TFeature, TFeatureCollection, TSearchResponse } from "../../types";

type TBuilderContext = {
  featureCollection: Readonly<TFeatureCollection>;
  dispatchFeatureCollection: (action: FeatureCollectionActions) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  // saveEdits: () => void;
  // addFeature: (searchResponse: TSearchResponse) => void;
  // removeFeature: (id: string) => void;
  // toggleFeatureVisibility: (id: string) => void;
  exportFeatureCollection: () => void;
};

export const BuilderContext = createContext<TBuilderContext>(null!);

type TEditMode = { type: "editMode"; payload: boolean };
type TSaveEdits = { type: "saveEdits"; payload: TFeature[] };
type TAddFeature = { type: "addFeature"; payload: TSearchResponse };
type TRemoveFeature = { type: "removeFeature"; payload: string };
type TToggleFeatureVisibility = {
  type: "toggleFeatureVisibility";
  payload: string;
};
type TExportFeatureCollection = { type: "exportFeatureCollection" };

export type FeatureCollectionActions =
  | TEditMode
  | TSaveEdits
  | TAddFeature
  | TRemoveFeature
  | TToggleFeatureVisibility
  | TExportFeatureCollection;

export const useBuilderContext = () => {
  return useContext(BuilderContext);
};
