import { createContext, useContext } from "react";
import { TFeature, TFeatureCollection, TSearchResponse } from "../../types";

type TBuilderContext = {
  featureCollection: Readonly<TFeatureCollection>;
  dispatchFeatureCollection: (action: FeatureCollectionActions) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  exportFeatureCollection: () => void;
  propertyIDEdit: string | null;
  setPropertyIDEdit: (uuid: string | null) => void;
};

export const BuilderContext = createContext<TBuilderContext>(null!);

type TSaveEdits = { type: "saveEdits"; payload: TFeature[] };
type TAddFeature = { type: "addFeature"; payload: TSearchResponse };
type TRemoveFeature = { type: "removeFeature"; payload: string };
type TToggleFeatureVisibility = {
  type: "toggleFeatureVisibility";
  payload: string;
};

export type FeatureCollectionActions =
  | TSaveEdits
  | TAddFeature
  | TRemoveFeature
  | TToggleFeatureVisibility;

export const useBuilderContext = () => {
  return useContext(BuilderContext);
};
