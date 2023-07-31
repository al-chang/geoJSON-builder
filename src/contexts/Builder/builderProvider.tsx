import { PropsWithChildren, useReducer, useState } from "react";
import { TFeatureCollection, metaSymbol } from "../../types";
import { BuilderContext, FeatureCollectionActions } from "./useBuilderContext";

const featureCollectionReducer = (
  state: TFeatureCollection,
  action: FeatureCollectionActions
): TFeatureCollection => {
  switch (action.type) {
    case "addFeature":
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case "removeFeature":
      return {
        ...state,
        features: state.features.filter(
          (f) => f.properties[metaSymbol].uuid !== action.payload
        ),
      };
    case "toggleFeatureVisibility":
      return {
        ...state,
        features: state.features.map((f) =>
          f.properties[metaSymbol].uuid === action.payload
            ? {
                ...f,
                properties: {
                  ...f.properties,
                  [metaSymbol]: {
                    ...f.properties[metaSymbol],
                    visible: !f.properties[metaSymbol].visible,
                  },
                },
              }
            : f
        ),
      };
    case "saveEdits":
      return {
        ...state,
        features: state.features.map((f) => ({
          type: "Feature",
          geometry:
            action.payload.find(
              (feature) =>
                feature.properties[metaSymbol].uuid ===
                f.properties[metaSymbol].uuid
            )?.geometry || f.geometry,
          properties: {
            ...f.properties,
            [metaSymbol]: { ...f.properties[metaSymbol], visible: true },
          },
        })),
      };
    case "savePropertyEdits":
      return {
        ...state,
        features: state.features.map((f) =>
          f.properties[metaSymbol].uuid === action.payload[metaSymbol].uuid
            ? { ...f, properties: action.payload }
            : f
        ),
      };
    default:
      return state;
  }
};

export const BuilderProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [featureCollection, dispatchFeatureCollection] = useReducer(
    featureCollectionReducer,
    {
      type: "FeatureCollection",
      features: [],
    }
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [propertyIDEdit, setPropertyIDEdit] = useState<string | null>(null);

  const exportFeatureCollection = () => {
    const _featureCollection = {
      ...featureCollection,
      features: featureCollection.features.map((f) => ({
        ...f,
        [metaSymbol]: undefined,
      })),
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(_featureCollection));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `features.geojson`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <BuilderContext.Provider
      value={{
        featureCollection,
        dispatchFeatureCollection,
        exportFeatureCollection,
        editMode,
        setEditMode,
        propertyIDEdit,
        setPropertyIDEdit,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};
