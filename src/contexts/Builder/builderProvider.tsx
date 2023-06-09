import { PropsWithChildren, useReducer, useState } from "react";
import { TFeatureCollection } from "../../types";
import { searchResponseToFeature } from "../../util";
import { BuilderContext, FeatureCollectionActions } from "./useBuilderContext";

const featureCollectionReducer = (
  state: TFeatureCollection,
  action: FeatureCollectionActions
): TFeatureCollection => {
  switch (action.type) {
    case "addFeature":
      return {
        ...state,
        features: [...state.features, searchResponseToFeature(action.payload)],
      };
    case "removeFeature":
      return {
        ...state,
        features: state.features.filter(
          (f) => f.properties.meta.uuid !== action.payload
        ),
      };
    case "toggleFeatureVisibility":
      return {
        ...state,
        features: state.features.map((f) =>
          f.properties.meta.uuid === action.payload
            ? {
                ...f,
                properties: {
                  ...f.properties,
                  meta: {
                    ...f.properties.meta,
                    visible: !f.properties.meta.visible,
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
                feature.properties.meta.uuid === f.properties.meta.uuid
            )?.geometry || f.geometry,
          properties: {
            ...f.properties,
            meta: { ...f.properties.meta, visible: true },
          },
        })),
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

  const exportFeatureCollection = () => {
    const _featureCollection = {
      ...featureCollection,
      features: featureCollection.features.map((f) => ({
        ...f,
        meta: undefined,
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
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};
