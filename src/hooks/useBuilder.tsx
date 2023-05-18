import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { FeatureCollection, SearchResponse } from "../types";
import { searchResponseToFeature } from "../util";

type TBuilderContext = {
  featureCollection: FeatureCollection;
  addFeature: (searchResponse: SearchResponse) => void;
  removeFeature: (place_id: number) => void;
};

const BuilderContext = createContext<TBuilderContext>(null!);

export const useBuilderContext = () => {
  return useContext(BuilderContext);
};

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
