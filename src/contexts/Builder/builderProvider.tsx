import { PropsWithChildren, useState } from "react";
import { FeatureCollection, SearchResponse } from "../../types";
import { searchResponseToFeature } from "../../util";
import { BuilderContext } from "./useBuilderContext";

export const BuilderProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [featureCollection, setFeatureCollection] = useState<FeatureCollection>(
    { type: "FeatureCollection", features: [] }
  );

  const addFeature = (searchResponse: SearchResponse) => {
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

  return (
    <BuilderContext.Provider
      value={{ featureCollection, addFeature, removeFeature }}
    >
      {children}
    </BuilderContext.Provider>
  );
};
