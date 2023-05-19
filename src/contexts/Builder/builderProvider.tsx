import { PropsWithChildren, useState } from "react";
import { TFeatureCollection, TSearchResponse } from "../../types";
import { searchResponseToFeature } from "../../util";
import { BuilderContext } from "./useBuilderContext";

export const BuilderProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [featureCollection, setFeatureCollection] =
    useState<TFeatureCollection>({ type: "FeatureCollection", features: [] });

  const addFeature = (searchResponse: TSearchResponse) => {
    if (
      featureCollection.features.some(
        (f) => f.properties.place_id === searchResponse.place_id
      )
    )
      return;

    const newFeature = searchResponseToFeature(searchResponse);
    setFeatureCollection({
      ...featureCollection,
      features: [...featureCollection.features, newFeature],
    });
  };

  const removeFeature = (place_id: number) => {
    setFeatureCollection({
      ...featureCollection,
      features: featureCollection.features.filter(
        (f) => f.properties.place_id !== place_id
      ),
    });
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

  return (
    <BuilderContext.Provider
      value={{
        featureCollection,
        addFeature,
        removeFeature,
        exportFeatureCollection,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};
