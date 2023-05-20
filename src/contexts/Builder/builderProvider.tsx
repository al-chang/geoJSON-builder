import { PropsWithChildren, useState } from "react";
import { TFeatureCollection, TSearchResponse } from "../../types";
import { searchResponseToFeature } from "../../util";
import { BuilderContext } from "./useBuilderContext";
import { useMapContext } from "../Map/useMapContext";
import Vector from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";

export const BuilderProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [featureCollection, setFeatureCollection] =
    useState<TFeatureCollection>({ type: "FeatureCollection", features: [] });
  const [editMode, setEditMode] = useState<boolean>(false);

  const { map } = useMapContext();

  const addFeature = (searchResponse: TSearchResponse) => {
    if (
      featureCollection.features.some(
        (f) => f.properties.place_id === searchResponse.place_id
      )
    )
      return;

    const newFeature = searchResponseToFeature(searchResponse);
    setFeatureCollection((_featureCollection) => ({
      ..._featureCollection,
      features: [..._featureCollection.features, newFeature],
    }));
  };

  const removeFeature = (id: string) => {
    setFeatureCollection((_featureCollection) => ({
      ..._featureCollection,
      features: _featureCollection.features.filter((f) => f.meta.uuid !== id),
    }));
  };

  const toggleFeatureVisibility = (id: string) => {
    setFeatureCollection((_featureCollection) => ({
      ..._featureCollection,
      features: _featureCollection.features.map((f) =>
        f.meta.uuid === id
          ? { ...f, meta: { ...f.meta, visible: !f.meta.visible } }
          : f
      ),
    }));
  };

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

  const saveEdits = () => {
    const geoJson = new GeoJSON();
    map
      ?.getLayers()
      .getArray()
      .forEach((layer) => {
        if (layer instanceof Vector) {
          const features = layer.getSource().getFeatures();
          const featureCollection = geoJson.writeFeaturesObject(
            features
          ) as TFeatureCollection;
        }
      });
  };

  return (
    <BuilderContext.Provider
      value={{
        featureCollection,
        addFeature,
        removeFeature,
        exportFeatureCollection,
        editMode,
        setEditMode,
        saveEdits,
        toggleFeatureVisibility,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};
