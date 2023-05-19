import { PropsWithChildren, useState } from "react";
import { TFeatureCollection, TSearchResponse } from "../../types";
import { searchResponseToFeature } from "../../util";
import { BuilderContext } from "./useBuilderContext";
import { useMapContext } from "../Map/useMapContext";

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

  const removeFeature = (place_id: number) => {
    setFeatureCollection((_featureCollection) => ({
      ..._featureCollection,
      features: _featureCollection.features.filter(
        (f) => f.properties.place_id !== place_id
      ),
    }));
  };

  const toggleFeatureVisibility = (place_id: number) => {
    setFeatureCollection((_featureCollection) => ({
      ..._featureCollection,
      features: _featureCollection.features.map((f) =>
        f.properties.place_id === place_id
          ? { ...f, meta: { ...f.meta, visible: !f.meta.visible } }
          : f
      ),
    }));
  };

  const exportFeatureCollection = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(featureCollection));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `features.geojson`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const saveEdits = () => {
    map?.getLayers().forEach((layer) => {
      console.log(layer.getRevision());
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
