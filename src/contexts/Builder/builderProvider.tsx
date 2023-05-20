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
      features: _featureCollection.features.filter(
        (f) => f.properties.meta.uuid !== id
      ),
    }));
  };

  const toggleFeatureVisibility = (id: string) => {
    console.log(id);
    setFeatureCollection((_featureCollection) => ({
      ..._featureCollection,
      features: _featureCollection.features.map((f) =>
        f.properties.meta.uuid === id
          ? {
              ...f,
              meta: {
                ...f.properties.meta,
                visible: !f.properties.meta.visible,
              },
            }
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
    const _featureCollection: TFeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    map
      ?.getLayers()
      .getArray()
      .forEach((layer) => {
        if (layer instanceof Vector) {
          const features = geoJson.writeFeaturesObject(
            layer.getSource().getFeatures(),
            {
              featureProjection: "EPSG:3857",
            }
          ) as TFeatureCollection;
          features.features.forEach((feature) => {
            _featureCollection.features.push(feature);
          });
        }
      });
    // Map meta variables to correct type
    _featureCollection.features = _featureCollection.features.map((f) => ({
      ...f,
      properties: {
        ...f.properties,
        meta: {
          uuid: f.properties.meta.uuid,
          visible: f.properties.meta.visible.toString() === "true",
        },
      },
    }));
    setFeatureCollection(_featureCollection);
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
